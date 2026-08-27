export interface StatusTabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
}

function StatusTabs<T extends string>({
  items,
  activeValue,
  onSelect,
}: {
  items: StatusTabItem<T>[];
  activeValue: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div
      role="tablist"
      className="flex gap-1.5 overflow-x-auto rounded-2xl border border-primary/10 bg-white p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item) => {
        const isActive = item.value === activeValue;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(item.value)}
            className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold capitalize transition ${
              isActive
                ? "bg-primary text-white shadow-[0_10px_20px_-14px_rgba(0,54,37,0.9)]"
                : "text-primary/70 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            {item.label}
            {typeof item.count === "number" ? (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-primary/8 text-primary/60"
                }`}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export default StatusTabs;
