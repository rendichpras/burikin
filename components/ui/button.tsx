import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-primary shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-sm",
        destructive:
          "bg-destructive text-white border-destructive shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-sm focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/90",
        outline:
          "border-border bg-background shadow-sm hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:shadow-sm hover:bg-accent/10 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-sm",
        ghost:
          "border-transparent hover:bg-accent/10 hover:text-accent-foreground hover:border-accent/10 hover:-translate-y-1 dark:hover:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline border-transparent shadow-none hover:shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
