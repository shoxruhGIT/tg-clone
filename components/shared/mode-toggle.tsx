"use client";

import { useTheme } from "next-themes";
import React from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export default function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return resolvedTheme === "dark" ? (
    <Button
      variant={"ghost"}
      size={"icon"}
      className="cursor-pointer"
      onClick={() => setTheme("light")}
    >
      <Sun />
    </Button>
  ) : (
    <Button
      variant={"ghost"}
      size={"icon"}
      className="cursor-pointer"
      onClick={() => setTheme("dark")}
    >
      <Moon />
    </Button>
  );
}
