// POST /api/submit
// Body: { url, topic?, note?, email? }
// Saves a video submission to the database for manual review.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@weknoq/db";
import { z } from "zod";

const SubmitSchema = z.object({
  url:   z.string().url("Please enter a valid URL"),
  topic: z.string().optional(),
  note:  z.string().max(1000).optional(),
  email: z.string().email().optional().or(z.literal("")).transform(v => v === "" ? undefined : v),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SubmitSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "Invalid submission";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { url, topic, note, email } = parsed.data;

    await (prisma as any).videoSubmission.create({
      data: {
        url,
        topic:  topic  ?? null,
        note:   note   ?? null,
        email:  email  ?? null,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit] error:", err);
    return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });
  }
}
