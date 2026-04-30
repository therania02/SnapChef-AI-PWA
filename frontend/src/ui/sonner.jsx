"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-center"
      style={
        {
          background: "rgb(var(--card))",
          color: "rgb(var(--foreground))",
          border: "1px solid rgb(var(--border))",
          wordBreak: "break-word",
        }
      }
      {...props}
    />
  );
};

export { Toaster };