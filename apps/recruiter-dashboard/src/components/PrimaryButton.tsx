interface Props {
  text: string;
  onClick: () => void;
}

export default function PrimaryButton({ text, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-[#571bc1] to-[#8781ff] text-white font-semibold px-6 py-2 rounded-lg transition-transform duration-200 hover:scale-105"
    >
      {text}
    </button>
  );
}