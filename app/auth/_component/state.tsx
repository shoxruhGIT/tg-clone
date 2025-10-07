"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import SignIn from "./sign-in";
import Verify from "./verify";

export default function StateAuth() {
  return (
    <>
      {/* <SignIn /> */}
      <Verify />
    </>
  );
}
