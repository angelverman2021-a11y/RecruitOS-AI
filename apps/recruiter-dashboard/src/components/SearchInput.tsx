interface Props {
  placeholder?: string;
}

export default function SearchInput({ placeholder = "Search..." }: Props) {
  return (
    <div className="flex items-center gap-2 bg-[#1c1b1d] px-4 py-2 rounded-lg ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-[#00daf3]/50 transition-all duration-200">
      <span className="text-gray-400 text-sm">🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent text-white placeholder-gray-500 outline-none w-full text-sm"
      />
    </div>
  );
}