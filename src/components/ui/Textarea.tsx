type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = (props: TextareaProps) => {
  return (
    <textarea
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

export default Textarea;