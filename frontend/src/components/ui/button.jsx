import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const variants = {
      default: "bg-[#4B8B32] text-white hover:bg-green-700 shadow-sm",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 shadow-sm",
      secondary: "bg-[#2196F3] text-white hover:bg-blue-600 shadow-sm",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
      link: "text-[#4B8B32] underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-xs",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B8B32] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
