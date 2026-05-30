export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "orange" | "green" | "red" | "blue";
}) {
  const toneClass = {
    default: "text-ink",
    orange: "text-bitcoin",
    green: "text-success",
    red: "text-danger",
    blue: "text-blue-600",
  }[tone];

  return (
    <div className="rounded-[22px] border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className={`mt-2 text-2xl font-extrabold leading-tight ${toneClass}`}>{value}</p>
      {sub ? <p className="mt-1 text-sm text-muted">{sub}</p> : null}
    </div>
  );
}
