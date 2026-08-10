import { formatMoney, formatDate,statusLabel } from "../../../lib/utils/helpers";



type RevenueRow = {
  orderId: string;
  subOrderId: string;
  status?: string;
  amount: number;
  updatedAt?: string;
};

function RevenueTile({ row, currency }: { row: RevenueRow; currency: string }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">{row.orderId}</p>
          <p className="mt-0.5 text-xs text-primary/55">{row.subOrderId}</p>
        </div>
        <span className="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary/70">
          {statusLabel(row.status)}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-primary/10 pt-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-primary/50">
            Amount
          </p>
          <p className="mt-0.5 text-base font-bold text-primary">
            {formatMoney(row.amount, currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.12em] text-primary/50">
            Updated
          </p>
          <p className="mt-0.5 text-xs font-medium text-primary/70">
            {formatDate(row.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RevenueTile;
