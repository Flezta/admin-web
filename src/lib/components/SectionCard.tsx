import React from 'react'

const SectionCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="rounded-3xl border border-primary/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(0,54,37,0.28)]">
      <h2 className="text-base font-semibold text-primary">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-primary/65">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default SectionCard