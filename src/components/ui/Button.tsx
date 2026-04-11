interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className="w-full max-w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
    >
      {children}
    </button>
  );
};

export default Button;