// Shown inside a dashboard card when there is nothing to chart yet
export default function EmptyState({ children = "Nothing here yet.", className = "py-10" }) {
  return <p className={`text-center text-sm text-subtle ${className}`}>{children}</p>;
}
