interface AvatarProps {
  imageUrl?: string;
  name: string;
}

export default function Avatar({ imageUrl, name }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="h-12 w-12 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
      {initials}
    </div>
  );
}