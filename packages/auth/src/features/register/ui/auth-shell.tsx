export const AuthShell = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  // h-dvh + overflow-y-auto 로 자체 스크롤 컨테이너를 만든다.
  // (shorts 는 body 에 overflow:hidden 을 걸어 부모 스크롤에 의존할 수 없다.)
  <div className="h-dvh overflow-y-auto bg-white text-slate-900">
    <div className="mx-auto flex min-h-full max-w-lg items-center px-6 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        {children}
      </div>
    </div>
  </div>
);
