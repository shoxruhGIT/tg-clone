import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React from "react";

export default function Settings() {
  return (
    <div>
      <Button size={"icon"} variant="secondary" className="cursor-pointer">
        <Menu />
      </Button>
    </div>
  );
}
