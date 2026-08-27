export const SubmitButton = ({
  pending,
  pendingLabel,
  children,
}: {
  pending: boolean;
  pendingLabel: string;
  children: React.ReactNode;
}) => (
  <button
    type="submit"
    disabled={pending}
    className="h-11 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
  >
    {pending ? pendingLabel : children}
  </button>
);
