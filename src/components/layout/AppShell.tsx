import React from "react";

interface AppShellProps {
  sidebar?: React.ReactNode;
  main: React.ReactNode;
  rightPanel?: React.ReactNode;
}

const AppShell = ({ sidebar, main, rightPanel }: AppShellProps) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: rightPanel ? "260px 1fr 320px" : "260px 1fr",
        minHeight: "100vh",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #e5e5e5",
          padding: "20px",
          background: "#fafafa",
        }}
      >
        {sidebar}
      </aside>

      <main style={{ padding: "24px" }}>{main}</main>

      {rightPanel && (
        <aside
          style={{
            borderLeft: "1px solid #e5e5e5",
            padding: "20px",
            background: "#fcfcfc",
          }}
        >
          {rightPanel}
        </aside>
      )}
    </div>
  );
};

export default AppShell;