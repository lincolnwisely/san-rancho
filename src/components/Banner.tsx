export function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="bg-accent px-6 py-2 text-center text-xs tracking-wide text-surface uppercase"
    >
      {children}
    </div>
  );
}
