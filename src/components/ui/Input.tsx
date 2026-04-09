type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = (props: InputProps) => {
  return (
    <input
      {...props}
      style={{
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        width: "100%",
      }}
    />
  );
};

export default Input;