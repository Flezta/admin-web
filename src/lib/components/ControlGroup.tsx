import type { Tone } from "../utils/constants";
import { TONE_RING } from "../utils/constants";

function ControlGroup<T extends string>({
  label,
  options,
  activeValue,
  busyValue,
  disabled,
  onSelect,
  toneFor,
}: {
  label: string;
  options: T[];
  activeValue?: T;
  busyValue?: T | null;
  disabled?: boolean;
  onSelect: (value: T) => void;
  toneFor: (value: T) => Tone;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
        {label}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = activeValue === option;
          const isBusy = busyValue === option;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled || isActive}
              onClick={() => onSelect(option)}
              className={`cursor-pointer rounded-xl border px-3.5 py-2 text-sm font-semibold capitalize transition disabled:cursor-not-allowed disabled:opacity-70 ${
                isActive
                  ? `border-transparent bg-white text-primary-dark ring-2 ${TONE_RING[toneFor(option)]}`
                  : "border-white/25 bg-white/10 text-white hover:border-white/45 hover:bg-white/20"
              }`}
            >
              {isBusy ? "Updating..." : option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ControlGroup;
