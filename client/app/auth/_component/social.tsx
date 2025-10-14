import { Button } from "@/components/ui/button";
import React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function Social() {
  return (
    <div className="grid grid-cols-2 gap-1 w-full">
      <Button variant={"outline"} className="cursor-pointer ">
        <span>Sign up with google</span>
        <FaGoogle />
      </Button>
      <Button variant={"secondary"} className="cursor-pointer ">
        <span>Sign up with github</span>
        <FaGithub />
      </Button>
    </div>
  );
}
