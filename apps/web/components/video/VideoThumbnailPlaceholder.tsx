export function VideoThumbnailPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate to-ink">
      <div className="w-12 h-12 rounded-full border-2 border-amber/60 flex items-center justify-center">
        <div className="w-3.5 h-3.5 bg-amber/60 rounded-full" />
      </div>
      <span className="font-display font-bold text-sm tracking-[0.5px] text-paper/30">
        we<span className="text-amber/50">knoq</span>
      </span>
    </div>
  );
}
