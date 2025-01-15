import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export const UserAvatar = ({ size = 32 }: { size?: number }) => {
  const { user } = useUser();

  if (!user?.imageUrl) {
    return (
      <div
        className="relative rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0"
        style={{ width: size, height: size }}
      >
        {user?.firstName?.[0] || "?"}
      </div>
    );
  }

  return (
    <div
      className="relative rounded-full overflow-hidden ring-1 ring-border shrink-0"
      style={{ width: size, height: size }}
    >
      <Image
        src={user.imageUrl}
        alt={user.fullName || "User Avatar"}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};
