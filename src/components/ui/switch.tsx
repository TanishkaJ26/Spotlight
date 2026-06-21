"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#A76EF6] data-[state=unchecked]:bg-input",
        "data-[size=default]:h-6 data-[size=default]:w-11",
        "data-[size=sm]:h-5 data-[size=sm]:w-9",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full shadow-lg ring-0 transition-transform bg-white",
          "group-data-[size=default]/switch:h-5 group-data-[size=default]/switch:w-5",
          "group-data-[size=sm]/switch:h-4 group-data-[size=sm]/switch:w-4",
          "group-data-[size=default]/switch:data-[state=checked]:translate-x-5 group-data-[size=default]/switch:data-[state=unchecked]:translate-x-0",
          "group-data-[size=sm]/switch:data-[state=checked]:translate-x-4 group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
