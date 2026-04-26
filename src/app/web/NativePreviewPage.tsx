import NativeAppRoot from "@/app/native/NativeAppRoot";

export default function NativePreviewPage() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto flex max-w-6xl gap-6 lg:flex-row">
        <div className="w-full max-w-[420px] overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-xl">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            Mobile Preview
          </div>
          <div className="h-[820px]">
            <NativeAppRoot />
          </div>
        </div>

        <div className="hidden max-w-md flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:block">
          <h1 className="text-xl font-semibold text-slate-900">Native Shell Preview</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Этот маршрут нужен как bridge-слой: mobile shell можно проверять прямо из текущего web-клиента,
            пока отдельный Expo entrypoint собирается параллельно.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Общий bootstrap и store уже переиспользуются.</li>
            <li>Основная вкладочная навигация живёт в native shell.</li>
            <li>Вторичные разделы вынесены в экран `More`.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
