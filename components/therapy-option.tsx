import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TherapyOptionProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  disabled?: boolean;
}

export const TherapyOption = ({
  title,
  description,
  icon,
  href,
  disabled = false,
}: TherapyOptionProps) => {
  return (
    <Link
      href={disabled ? "#" : href}
      onClick={(e) => disabled && e.preventDefault()}
    >
      <motion.div
        className={cn(
          "rounded-xl p-6 bg-muted transition-colors cursor-pointer flex flex-col gap-4 h-full",
          disabled
            ? "opacity-50 cursor-not-allowed hover:bg-muted"
            : "hover:bg-accent"
        )}
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
      >
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            {disabled && (
              <span className="text-xs text-muted-foreground">
                (Coming Soon)
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
};
