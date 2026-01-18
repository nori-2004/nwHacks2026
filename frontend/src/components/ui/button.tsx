import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma-style button variants with CSS variables for theme support
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary blue button
        default: "bg-primary text-primary-foreground rounded-[6px] hover:bg-primary/90 active:bg-primary/80",
        // Destructive/red
        destructive:
          "bg-destructive text-destructive-foreground rounded-[6px] hover:bg-destructive/90 active:bg-destructive/80",
        // Outline style
        outline:
          "border border-border bg-transparent text-foreground rounded-[6px] hover:bg-accent active:bg-accent/80",
        // Secondary gray button
        secondary:
          "bg-secondary text-secondary-foreground rounded-[6px] hover:bg-accent active:bg-accent/80",
        // Ghost button (very minimal)
        ghost: "text-foreground rounded-[6px] hover:bg-accent active:bg-accent/80",
        // Link style
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        sm: "h-7 px-2 py-1 text-[12px]",
        lg: "h-9 px-4 py-2",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
