import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary";
}

export function Spinner({ 
  className, 
  size = "default", 
  variant = "default",
  ...props 
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    default: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4"
  };

  const variantClasses = {
    default: "border-muted-foreground/20 border-t-muted-foreground/60",
    primary: "border-primary/30 border-t-primary",
    secondary: "border-secondary/30 border-t-secondary-foreground"
  };

  return (
    <div 
      className={cn(
        "inline-block rounded-full animate-spin", 
        sizeClasses[size],
        variantClasses[variant],
        className
      )} 
      {...props} 
    />
  );
} 