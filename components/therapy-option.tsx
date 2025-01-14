import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface TherapyOptionProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

export const TherapyOption = ({
  title,
  description,
  icon,
  href,
}: TherapyOptionProps) => {
  return (
    <Link href={href}>
      <motion.div
        className="rounded-xl p-6 bg-muted hover:bg-accent transition-colors cursor-pointer flex flex-col gap-4 h-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
};
