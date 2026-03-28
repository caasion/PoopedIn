import { ReactNode } from "react";

interface AppShellProps {
  left: ReactNode;
  children: ReactNode;
  right: ReactNode;
}

export default function AppShell({ left, children, right }: AppShellProps) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-20 pb-8">
      <div className="flex gap-5 items-start">
        {/* Left sidebar */}
        <aside className="w-[250px] shrink-0 hidden lg:block sticky top-20">
          {left}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px]">{children}</main>

        {/* Right sidebar */}
        <aside className="w-[300px] shrink-0 hidden xl:block sticky top-20">
          {right}
        </aside>
      </div>
    </div>
  );
}
