import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "./utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const values = props.value || props.defaultValue || [0]
  
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-4 w-full grow overflow-hidden rounded-full bg-gray-300">
        <SliderPrimitive.Range className="absolute h-full bg-black" />
      </SliderPrimitive.Track>
      {Array.from({ length: values.length }).map((_, i) => (
        <SliderPrimitive.Thumb 
          key={i}
          className="block h-8 w-8 rounded-full border-4 border-black bg-white shadow-lg hover:shadow-xl ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing active:scale-110" 
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
