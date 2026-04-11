type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
};

const EmptyState = ({ title, description, className = "" }: EmptyStateProps) => {
  return (
    <div className={`rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center ${className}`}>
      <p className="font-medium text-slate-700">{title}</p>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
    </div>
  );
};

export default EmptyState;