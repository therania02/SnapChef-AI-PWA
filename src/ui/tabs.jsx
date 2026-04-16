"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

// ROOT
function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

// LIST
function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px]",
        className
      )}
      {...props}
    />
  );
}

// TRIGGER
function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex flex-1 items-center justify-center rounded-xl px-2 py-1 text-sm font-medium",
        "data-[state=active]:bg-card",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

// CONTENT
function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

// EXPORT
export { Tabs, TabsList, TabsTrigger, TabsContent };