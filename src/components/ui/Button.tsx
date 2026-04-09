interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const Button = ({ variant = "primary", style, ...props }: ButtonProps) => {
  const baseStyle: React.CSSProperties = {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
  };

  const variants = {
    primary: { background: "#2563eb", color: "white" },
    secondary: { background: "#e5e7eb", color: "#111" },
    danger: { background: "#dc2626", color: "white" },
  };

  return (
    <button
      {...props}
      style={{
        ...baseStyle,
        ...variants[variant],
        ...style,
      }}
    />
  );
};

export default Button;