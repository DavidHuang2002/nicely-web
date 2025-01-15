import Image from "next/image";

export const TherapistAvatar = ({ size = 32 }: { size?: number }) => {
  return (
    <div
      className="relative rounded-full overflow-hidden ring-1 ring-border shrink-0"
      style={{ width: size, height: size }}
    >
      <Image
        src="/therapist-avatar.webp"
        alt="AI Therapist Avatar"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};
