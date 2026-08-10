import { Link } from "react-router-dom";

interface UserShopLinkCardProps {
  shopId?: string;
}

export default function UserShopLinkCard({ shopId }: UserShopLinkCardProps) {
  return (
    <section className="rounded-2xl border border-primary/10 bg-white p-4">
      <h2 className="text-base font-semibold text-primary">Shop Link</h2>
      {shopId ? (
        <div className="mt-2 space-y-1.5">
          <p className="text-sm text-primary/70">Connected Shop ID: {shopId}</p>
          <Link
            to={`/shops/${shopId}`}
            className="inline-flex rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            Open shop profile
          </Link>
          <p className="text-xs text-primary/55">
            Shop profile and admin actions are now available.
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm text-primary/70">
          This user currently has no linked shop.
        </p>
      )}
    </section>
  );
}
