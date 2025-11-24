import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const LOGO_VARIANTS = {
  full: "/logo.svg",
  icon: "/logo-icon.svg",
} as const;

type LogoVariant = keyof typeof LOGO_VARIANTS;

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: LogoVariant;
}

export const Logo = ({ variant = "full", className, ...rest }: LogoProps) => {
  return (
    <img
      src={LOGO_VARIANTS[variant]}
      alt="Sentrix logo"
      className={cn(
        "select-none pointer-events-none",
        variant === "full" ? "h-8 w-auto" : "h-6 w-6",
        className
      )}
      draggable={false}
      {...rest}
    />
  );
};

