"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "./utils";

function Slider({
  className,
  defaultValue = [0],
  value,
  min = 0,
  max = 100,
  onValueChange,
  ...props
}) {
  const isControlled = value !== undefined;

  const currentValue = isControlled ? value : defaultValue;

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      min={min}
      max={max}
      value={currentValue}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        "data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {/* TRACK */}
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-muted relative h-2 w-full grow overflow-hidden rounded-full"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-primary absolute h-full"
        />
      </SliderPrimitive.Track>

      {/* THUMBS */}
      {(Array.isArray(currentValue) ? currentValue : [currentValue]).map(
        (_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            data-slot="slider-thumb"
            className="block size-4 rounded-full border border-primary bg-background shadow-sm transition focus-visible:ring-2 outline-none"
          />
        )
      )}
    </SliderPrimitive.Root>
  );
}

export { Slider };