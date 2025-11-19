import * as React from "react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4B8B32] focus-visible:border-[#4B8B32] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Select.displayName = "Select"

export { Select }
