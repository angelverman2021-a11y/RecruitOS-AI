interface Props {
  status: "Hired" | "Interviewing" | "Rejected";
}

export default function StatusBadge({ status }: Props) {
  const colors = {
    Hired: "bg-green-500 text-white",
    Interviewing: "bg-yellow-400 text-black",
    Rejected: "bg-red-500 text-white",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}