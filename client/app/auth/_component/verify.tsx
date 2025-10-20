import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { axiosClient } from "@/http/axios";
import { otpSchema } from "@/lib/validation";
import { IError, IUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { signIn } from "next-auth/react";
import { userAgent } from "next/server";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function Verify() {
  const { email } = useAuth();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email, otp: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (otp: string) => {
      const { data } = await axiosClient.post<{ user: IUser }>(
        "/api/auth/verify",
        { email, otp }
      );
      return data;
    },
    onSuccess: ({ user }) => {
      signIn("credentials", { email: user.email, callbackUrl: "/" });
      toast.success("Successfully verified");
      console.log(user);
    },
    onError: (error: IError) => {
      if (error.response?.data?.message) {
        return toast.error(error.response.data.message);
      }
      return toast.error("Something went wrong");
    },
  });

  function onsubmit(values: z.infer<typeof otpSchema>) {
    mutate(values.otp);
  }

  return (
    <div className="w-full">
      <p className="text-center text-muted-foreground text-sm">
        We have sent you an email with a verification code to your email
        address. Please enter the code below.
      </p>

      <Form {...form}>
        <form
          className="w-full space-y-2"
          onSubmit={form.handleSubmit(onsubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input
                    placeholder="info@example.com"
                    className="h-10 bg-secondary"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <Label>One-time password</Label>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    className="w-full"
                    pattern={REGEXP_ONLY_DIGITS}
                    disabled={isPending}
                    {...field}
                  >
                    <InputOTPGroup className="w-full ">
                      <InputOTPSlot
                        index={0}
                        className="w-full dark:bg-primary-foreground bg-secondary"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-full dark:bg-primary-foreground bg-secondary"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-full dark:bg-primary-foreground bg-secondary"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup className="w-full ">
                      <InputOTPSlot
                        index={3}
                        className="w-full dark:bg-primary-foreground bg-secondary"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-full dark:bg-primary-foreground bg-secondary"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-full dark:bg-primary-foreground bg-secondary"
                      />
                    </InputOTPGroup>
                  </InputOTP>
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
