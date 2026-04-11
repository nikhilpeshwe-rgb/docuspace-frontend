import React from "react";

interface AppShellProps {
  sidebar?: React.ReactNode;
  main: React.ReactNode;
  rightPanel?: React.ReactNode;
}

const AppShell = ({ sidebar, main, rightPanel }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1800px] grid grid-cols-1 gap-8 p-6 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
        {sidebar && (
          <aside className="overflow-hidden h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            {sidebar}
          </aside>
        )}

        <main className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
          {main}
        </main>

        {rightPanel && (
          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            {rightPanel}
          </aside>
        )}
      </div>
    </div>
  );
};

export default AppShell;