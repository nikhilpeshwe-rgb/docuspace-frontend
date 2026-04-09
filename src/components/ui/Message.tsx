interface MessageProps {
  type?: "error" | "success" | "info";
  text: string;
}

const Message = ({ type = "info", text }: MessageProps) => {
  const colors = {
    error: "#dc2626",
    success: "#16a34a",
    info: "#555",
  };

  return <p style={{ color: colors[type] }}>{text}</p>;
};

export default Message;