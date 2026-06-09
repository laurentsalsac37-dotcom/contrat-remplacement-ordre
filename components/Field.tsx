type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}