import Link from "next/link";

// Shared panel shell so every dashboard widget has the same chrome
export default function Card({ title, subtitle, action, className = "", children }) {
  return (
    <section className={`rounded-xl border border-[#E8E4DC] bg-white ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            <h2 className="text-[15px] font-semibold text-[#2A2A28]">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-[#8A8A80]">{subtitle}</p>}
          </div>
          {action &&
            (action.href ? (
              <Link
                href={action.href}
                className="shrink-0 text-xs font-medium text-[#7A1F2B] hover:underline"
              >
                {action.label}
              </Link>
            ) : (
              action
            ))}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
