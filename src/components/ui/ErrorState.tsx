type ErrorStateProps = {
  title?: string;
  message: string;
  className?: string;
};

const ErrorState = ({
  title = "Something went wrong",
  message,
  className = "",
}: ErrorStateProps) => {
  return (
    <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
      <p className="font-medium text-red-700">{title}</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  );
};

export default ErrorState;