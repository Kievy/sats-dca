import type { LucideIcon } from "lucide-react";

export function PageTitle({
  icon: Icon,
  title,
  action,
}: {
  icon: LucideIcon;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full bg-action text-bitcoin">
          <Icon size={22} />
        </div>
        <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">{title}</h1>
      </div>
      {action}
    </header>
  );
}
