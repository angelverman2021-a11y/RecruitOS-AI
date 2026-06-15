interface SkillTagProps {
  skillName: string;
}

export default function SkillTag({ skillName }: SkillTagProps) {
  return (
    <span className="inline-flex items-center rounded-md bg-[#2a2a2c] px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
      {skillName}
    </span>
  );
}