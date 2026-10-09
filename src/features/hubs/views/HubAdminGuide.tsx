import { Link } from "react-router-dom";
import BackLinkButton from "../../users/components/BackLinkButton";

const sectionClass = "scroll-mt-24 space-y-3 border-t border-primary/15 pt-5";
const headingClass = "text-lg font-semibold text-primary";
const listClass =
  "list-decimal space-y-2 pl-5 text-sm leading-6 text-primary/75";

export default function HubAdminGuide() {
  return (
    <article className="min-w-0 max-w-3xl space-y-6">
      <BackLinkButton to="/hub" label="Back to hub dashboard" />
      <header className="space-y-3">
        <h1 className="text-2xl font-bold text-primary">Hub admin guide</h1>
        <p className="text-sm leading-6 text-primary/75">
          Your hub is an independent Flezta partner business. Your account gives
          access only to sub-orders assigned to your hub, not the wider
          marketplace or other partners' accounts.
        </p>
        <Link
          to="/hub/orders?view=attention"
          className="inline-block text-sm font-semibold text-primary underline underline-offset-4"
        >
          Open your work queue
        </Link>
      </header>

      <nav
        aria-label="Guide sections"
        className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-primary"
      >
        <a href="#access" className="underline underline-offset-4">
          Account access
        </a>
        <a href="#orders" className="underline underline-offset-4">
          Find an item
        </a>
        <a href="#receive" className="underline underline-offset-4">
          Receive and inspect
        </a>
        <a href="#decision" className="underline underline-offset-4">
          Reject or dispatch
        </a>
        <a href="#limits" className="underline underline-offset-4">
          Permissions
        </a>
        <a href="#help" className="underline underline-offset-4">
          Problems
        </a>
      </nav>

      <section id="access" className={sectionClass}>
        <h2 className={headingClass}>Account access</h2>
        <ol className={listClass}>
          <li>
            Sign in with the account Flezta has approved for your partner hub.
            Creating an account alone does not grant hub access; a super-admin
            must grant it.
          </li>
          <li>
            Check the business name and address on your dashboard before
            handling any items. If they are wrong, stop and contact Flezta.
          </li>
          <li>
            Keep your password private. Each operator should use their own
            approved account so actions are recorded against the correct person.
            Do not use a marketplace admin account for hub work.
          </li>
          <li>
            Sign out when leaving a shared device. Use "Forgot password?" on the
            sign-in page if you need a password reset.
          </li>
        </ol>
      </section>

      <section id="orders" className={sectionClass}>
        <h2 className={headingClass}>Find the correct item</h2>
        <ol className={listClass}>
          <li>
            Open "Needs attention" from your dashboard. This queue contains
            assigned sub-orders that are ready for QA or already being
            inspected.
          </li>
          <li>
            Use "All orders" to find other assigned sub-orders. Search by order
            or sub-order ID, or filter by status, shop ID, and date. Use the
            refresh button to retrieve the latest information.
          </li>
          <li>
            Open the sub-order and match its ID, item photo, SKU, and quantity
            to the physical handover. For bundles, check every listed component
            and its quantity.
          </li>
          <li>
            Check the handover hub and schedule. A buyer order can contain
            several sub-orders; act only on the particular sub-order assigned to
            your hub.
          </li>
        </ol>
      </section>

      <section id="receive" className={sectionClass}>
        <h2 className={headingClass}>Receive the item and start QA</h2>
        <ol className={listClass}>
          <li>
            For a "Ready for QA" sub-order, confirm the matching item has
            physically arrived at your hub. Do not record receipt before
            arrival.
          </li>
          <li>
            Under "Fulfilment action", choose "Receive and start QA", then
            review and confirm the action. The status becomes "QA in progress"
            and the activity history records your account and the time.
          </li>
          <li>
            Inspect the actual item against the order snapshot and Flezta's
            agreed quality standards. Check identity, quantity, condition, and
            all bundle components. Do not approve an item you have not
            inspected.
          </li>
        </ol>
      </section>

      <section id="decision" className={sectionClass}>
        <h2 className={headingClass}>Reject QA or approve and dispatch</h2>
        <h3 className="text-sm font-semibold text-primary">
          If the item fails QA
        </h3>
        <ol className={listClass}>
          <li>Choose "Reject QA" while the sub-order is "QA in progress".</li>
          <li>
            Enter a specific rejection reason describing what is wrong and what
            the seller must correct. Do not include passwords, payment details,
            or unrelated personal information.
          </li>
          <li>
            Review the reason and confirm. Follow Flezta's agreed process for
            returning the item to the seller; changing the status does not
            arrange transport.
          </li>
          <li>
            The seller must correct the item and resubmit it as "Ready for QA".
            When it arrives again, receive it and repeat the inspection. Earlier
            attempts remain in the activity history.
          </li>
        </ol>
        <h3 className="pt-2 text-sm font-semibold text-primary">
          If the item passes QA
        </h3>
        <ol className={listClass}>
          <li>
            Choose "Approve QA and dispatch" only when QA has passed and the
            item is physically being dispatched through Flezta's agreed delivery
            process.
          </li>
          <li>
            Check the delivery context, read the warning, and confirm. The
            status becomes "Out for delivery".
          </li>
          <li>
            This action does not book a courier or confirm delivery. Flezta
            admins handle delivery confirmation and any subsequent return.
          </li>
        </ol>
      </section>

      <section id="limits" className={sectionClass}>
        <h2 className={headingClass}>What your account can and cannot do</h2>
        <p className="text-sm leading-6 text-primary/75">
          You can receive items and start QA, reject QA with a reason, and
          approve QA for dispatch. Actions are available only at the appropriate
          stage for sub-orders assigned to your hub.
        </p>
        <p className="text-sm leading-6 text-primary/75">
          You cannot cancel, record a return, correct a status, reopen an order,
          change a hub assignment, manage accounts, or view other hubs' work.
          Payment amounts, payouts, commissions, buyer email addresses, and
          private management notes are not part of your hub view. Use delivery
          contact information only for the assigned fulfilment task.
        </p>
      </section>

      <section id="help" className={sectionClass}>
        <h2 className={headingClass}>When something goes wrong</h2>
        <dl className="space-y-4 text-sm leading-6 text-primary/75">
          <div>
            <dt className="font-semibold text-primary">
              Wrong action or wrong item
            </dt>
            <dd>
              Stop handling the affected item and contact Flezta with the
              sub-order ID, what happened, and its physical location. Do not
              make another status change to hide the mistake. Only an admin or
              super-admin can correct a status; history is retained.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-primary">
              No hub access, wrong hub, or access denied
            </dt>
            <dd>
              Contact a Flezta super-admin to check your account and hub grant.
              Signing up again or using another partner's login will not resolve
              the assignment.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-primary">
              Hub closed to new handovers
            </dt>
            <dd>
              A disabled hub cannot receive new assignments or handover
              bookings, but existing assigned sub-orders remain actionable. Do
              not accept a new unassigned handover; contact Flezta if the
              handover details are unclear.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-primary">
              Item is missing or not listed
            </dt>
            <dd>
              Check the sub-order ID and refresh the queue. If it is still
              absent, do not accept or dispatch it as a different sub-order. Ask
              Flezta to verify the assignment.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-primary">
              Status changed or request failed
            </dt>
            <dd>
              Refresh or reopen the sub-order and check its current status and
              activity history before retrying. Another operator may have acted,
              or the first request may have succeeded despite the error. Avoid
              repeated confirmations.
            </dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
