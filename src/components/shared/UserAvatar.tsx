import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserAvatarProps {
  name: string;
  level: number;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ name, level, avatarUrl, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "size-10",
    md: "size-16",
    lg: "size-24",
  };

  const badgeSizeClasses = {
    sm: "size-6 -bottom-1 -right-1",
    md: "size-6 -bottom-1 -right-1",
    lg: "size-6 -bottom-1 -right-1",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-block">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <Badge
        variant="default"
        className={`absolute flex items-center justify-center rounded-full p-0 ${badgeSizeClasses[size]}`}
      >
        {level}
      </Badge>
    </div>
  );
}

