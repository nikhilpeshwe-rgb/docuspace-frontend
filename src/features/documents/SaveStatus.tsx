interface SaveStatusProps {
  state: "idle" | "dirty" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
}

const formatTime = (date: Date | null) => {
  if (!date) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SaveStatus = ({ state, lastSavedAt }: SaveStatusProps) => {
  let text = "";
  let textColorClass = "text-slate-500";

  switch (state) {
    case "dirty":
      text = "Unsaved changes";
      textColorClass = "text-amber-600";
      break;
    case "saving":
      text = "Saving...";
      textColorClass = "text-blue-600";
      break;
    case "saved":
      text = lastSavedAt
        ? `Saved at ${formatTime(lastSavedAt)}`
        : "Saved";
      textColorClass = "text-green-600";
      break;
    case "error":
      text = "Save failed";
      textColorClass = "text-red-600";
      break;
    default:
      text = "Ready";
      textColorClass = "text-slate-500";
  }

  return <div className={`text-sm font-medium ${textColorClass}`}>{text}</div>;
};

export default SaveStatus;
