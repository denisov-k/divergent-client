export function AppLoader({
  fullScreen = false,
}: {
  fullScreen?: boolean;
}) {
  return (
    <div
      className={`flex w-full items-center justify-center self-stretch bg-background ${fullScreen ? "min-h-0 flex-1" : "min-h-[160px]"}`}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}
