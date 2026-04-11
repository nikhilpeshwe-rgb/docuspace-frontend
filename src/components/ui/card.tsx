const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {children}
    </div>
  );
};

export default Card;