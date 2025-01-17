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
import { useAuth } from "@/hooks/useAuth";
import { axiosClient } from "@/http/axios";
import { emailSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type SignInSchema = z.infer<typeof emailSchema>;

const SignIn = () => {
  const { setEmail, setStep } = useAuth();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

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
      toast.success("Email sent");
    },
    onError: (error: Error) => {
      const message =
        (isAxiosError(error) && error.response?.data?.message) ||
        "An unknown error occurred";
      return toast.error(message);
    },
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input
                    placeholder="info@sammi.ac"
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
            className="w-full"
            size={"lg"}
            disabled={isPending}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignIn;
