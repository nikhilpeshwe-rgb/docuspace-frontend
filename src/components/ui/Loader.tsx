type LoaderProps = {
  text?: string;
  className?: string;
};

const Loader = ({ text = "Loading...", className = "" }: LoaderProps) => {
  return (
    <div className={`flex space-y-4 items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 ${className}`}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      <span>{text}</span>
    </div>
  );
};

export default Loader;