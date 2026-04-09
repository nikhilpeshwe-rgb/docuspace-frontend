const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "14px",
        marginBottom: "12px",
        background: "white",
      }}
    >
      {children}
    </div>
  );
};

export default Card;