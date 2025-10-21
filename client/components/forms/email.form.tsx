import { emailSchema, oldEmailScheme, otpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/http/axios";
import { toast } from "sonner";
import { generateToken } from "@/lib/generate-token";

const EmailForm = () => {
  const [verify, setVerify] = useState(false);

  const { data: session, update } = useSession();

  const emailForm = useForm<z.infer<typeof oldEmailScheme>>({
    resolver: zodResolver(oldEmailScheme),
    defaultValues: {
      email: "",
      oldEmail: session?.currentUser?.email,
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "", email: "" },
  });

  const otpMutation = useMutation({
    mutationFn: async (email: string) => {
      const token = await generateToken(session?.currentUser?._id);
      const { data } = await axiosClient.post<{ email: string }>(
        "/api/user/send-otp",
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
    onSuccess: ({ email }) => {
      toast.success("OTP sent to your new email");
      otpForm.setValue("email", email);
      setVerify(true);
    },
  });

  function onEmailSubmit(values: z.infer<typeof oldEmailScheme>) {
    otpMutation.mutate(values.email);
  }

  const verifyMutation = useMutation({
    mutationFn: async (otp: string) => {
      const token = await generateToken(session?.currentUser?._id);
      const { data } = await axiosClient.put(
        "/api/user/email",
        { email: otpForm.getValues("email"), otp },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Email updated successfully");
      signOut();
    },
  });

  function onVerifySubmit(values: z.infer<typeof otpSchema>) {
    verifyMutation.mutate(values.otp);
  }

  return !verify ? (
    <Form {...emailForm}>
      <form
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        className="space-y-2"
      >
        <FormField
          control={emailForm.control}
          name="oldEmail"
          render={({ field }) => (
            <FormItem>
              <Label>Current email</Label>
              <FormControl>
                <Input className="h-10 bg-secondary" disabled {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={emailForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>Enter a new email</Label>
              <FormControl>
                <Input
                  placeholder="info@example.com"
                  className="h-10 bg-secondary"
                  disabled={otpMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={otpMutation.isPending}
        >
          Verify email
        </Button>
      </form>
    </Form>
  ) : (
    <Form {...otpForm}>
      <form
        onSubmit={otpForm.handleSubmit(onVerifySubmit)}
        className="space-y-2"
      >
        <Label>New email</Label>
        <Input
          className="h-10 bg-secondary"
          disabled
          value={emailForm.watch("email")}
        />
        <FormField
          control={otpForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <Label>One-Time Password</Label>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  className="w-full"
                  pattern={REGEXP_ONLY_DIGITS}
                  disabled={verifyMutation.isPending}
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
          className="w-full"
          disabled={verifyMutation.isPending}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default EmailForm;
