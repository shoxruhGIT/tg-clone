import { confirmTextScheme } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const DangerZoneForm = () => {
  const form = useForm<z.infer<typeof confirmTextScheme>>({
    resolver: zodResolver(confirmTextScheme),
    defaultValues: { confirmText: "" },
  });

  function onSubmit(values: z.infer<typeof confirmTextScheme>) {
    console.log(values);
  }

  return (
    <>
      <p className="text-xs text-muted-foreground text-center">
        Are you sure you want to delete your account? This action cannot be
        undone.
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="mt-2 w-full font-spaceGrotesk font-bold cursor-pointer"
            variant={"destructive"}
          >
            Delete permenantly
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="confirmText"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>
                      Please type <span className="font-bold">DELETE</span> to
                      confirm.
                    </FormDescription>
                    <FormControl>
                      <Input className="bg-secondary" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <Button className="w-full font-bold cursor-pointer">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DangerZoneForm;
