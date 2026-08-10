import {
  formatDate,
  formatMoney,
  statusLabel,
} from "../../../lib/utils/helpers";



const RevenueTable = ({
  rows,
  currency = "NGN",
}: {
  rows: {
    orderId: string;
    subOrderId: string;
    status?: string;
    amount: number;
    updatedAt?: string;
  }[];
  currency?: string;
}) => {
  return (
    <table className="min-w-full text-sm">
      <thead className="bg-primary/5 text-left text-xs uppercase tracking-[0.14em] text-primary/65">
        <tr>
          <th className="px-4 py-3">Order</th>
          <th className="px-4 py-3">Sub-order</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Amount</th>
          <th className="px-4 py-3">Updated</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.subOrderId}
            className="border-t border-primary/10 align-top"
          >
            <td className="px-4 py-3 font-semibold text-primary">
              {row.orderId}
            </td>
            <td className="px-4 py-3 text-primary/75">{row.subOrderId}</td>
            <td className="px-4 py-3 text-primary/75">
              {statusLabel(row.status)}
            </td>
            <td className="px-4 py-3 text-primary/75">
              {formatMoney(row.amount, currency)}
            </td>
            <td className="px-4 py-3 text-primary/75">
              {formatDate(row.updatedAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RevenueTable;
