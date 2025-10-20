"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { axiosClient } from "@/http/axios";
import { emailSchema } from "@/lib/validation";
import { IError } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function SignIn() {
  const { setEmail, setStep } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const { data } = await axiosClient.post<{ email: string }>(
        "/api/auth/login",
        { email }
      );
      return data;
    },
    onSuccess: (res) => {
      setEmail(res.email);
      setStep("verify");
      toast.success("Verification code sent to your email.");
    },
    onError: (error: IError) => {
      if (error.response?.data?.message) {
        return toast.error(error.response.data.message);
      }
      return toast.error("Something went wrong. Please try again.");
    },
  });

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: z.infer<typeof emailSchema>) {
    mutate(values.email);
  }

  return (
    <div className="w-full">
      <p className="text-center text-muted-foreground text-sm">
        Telegram is a messaging app with a focus on speed and security, it’s
        super-fast, simple and free.
      </p>
      <Form {...form}>
        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input
                    placeholder="info@example.com"
                    className="h-10 bg-secondary"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size={"lg"}
            className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600"
            disabled={isPending}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
