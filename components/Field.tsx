type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      {children}
      {hint && <p className="text-xs leading-5 text-slate-500">{hint}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}