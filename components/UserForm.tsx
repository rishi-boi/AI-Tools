"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import {
  requestPasswordReset,
  signIn,
  signUp,
  useSession,
} from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./Loader";

// Creating seperate schemas to handle login and registration
// LOGIN SCHEMA
const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// REGISTER SCHEMA
const registerSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// PASSWORD RESET
const passwordResetSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;
type FormValues = LoginFormValues | RegisterFormValues;

export default function UserForm({ type }: { type?: string }) {
  const { data, isPending } = useSession();
  const navigate = useRouter();
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const isLogin = type === "login";

  useEffect(() => {
    if (data) {
      // If user is already logged in, redirect to home
      navigate.push("/");
    }
  }, [data, navigate]);

  const form = useForm<FormValues>({
    // Set up validation schema
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      // bringing back name if registering
      ...(isLogin ? {} : { name: "" }),
    },
  });
  const resetForm = useForm<PasswordResetFormValues>({
    // Set up validation schema
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    // Clear any existing form errors
    form.clearErrors();
    if (isLogin) {
      // LOGIN logic
      const loginValues = values as LoginFormValues;
      try {
        await signIn.email(
          {
            email: loginValues.email,
            password: loginValues.password,
          },
          {
            onSuccess: () => {
              setSubmittedSuccessfully(true);
              navigate.push("/"); // Redirect to home
            },
            onError: (ctx) => {
              const errorMessage = ctx.error.message;

              // Set specific field errors based on error message
              if (errorMessage.toLowerCase().includes("email")) {
                form.setError("email", {
                  message: errorMessage,
                  type: "manual",
                });
              } else if (errorMessage.toLowerCase().includes("password")) {
                form.setError("password", {
                  message: errorMessage,
                  type: "manual",
                });
              } else {
                // Set root error for general errors
                form.setError("root", {
                  message: errorMessage || "Login failed. Please try again.",
                  type: "manual",
                });
              }
            },
          }
        );
      } catch (error) {
        form.setError("root", {
          message: "An unexpected error occurred. Please try again.",
          type: "manual",
        });
        console.error("Login failed:", error);
      }
    } else {
      // REGISTER logic
      const registerValues = values as RegisterFormValues;
      try {
        await signUp.email(
          {
            email: registerValues.email,
            password: registerValues.password,
            name: registerValues.name,
          },
          {
            onSuccess: () => {
              setSubmittedSuccessfully(true);
            },
            onError: (ctx) => {
              const errorMessage = ctx.error.message;

              // Set specific field errors based on error message
              if (errorMessage.toLowerCase().includes("email")) {
                form.setError("email", {
                  message: errorMessage,
                  type: "manual",
                });
              } else if (errorMessage.toLowerCase().includes("password")) {
                form.setError("password", {
                  message: errorMessage,
                  type: "manual",
                });
              } else if (errorMessage.toLowerCase().includes("name")) {
                form.setError("name", {
                  message: errorMessage,
                  type: "manual",
                });
              } else {
                // Set root error for general errors
                form.setError("root", {
                  message:
                    errorMessage || "Registration failed. Please try again.",
                  type: "manual",
                });
              }
            },
          }
        );
      } catch (error) {
        form.setError("root", {
          message: "An unexpected error occurred. Please try again.",
          type: "manual",
        });
        console.error("Registration failed:", error);
      }
    }
  }

  async function handlePasswordReset(values: PasswordResetFormValues) {
    try {
      await requestPasswordReset(
        {
          email: values.email,
          redirectTo: '/reset-password'
        },
        {
          onSuccess: () => {
            setSubmittedSuccessfully(true);
          },
          onError: (ctx) => {
            const errorMessage = ctx.error.message;

            // Set specific field errors based on error message
            if (errorMessage.toLowerCase().includes("email")) {
              form.setError("email", {
                message: errorMessage,
                type: "manual",
              });
            } else {
              // Set root error for general errors
              form.setError("root", {
                message: errorMessage || "Please try again.",
                type: "manual",
              });
            }
          },
        }
      );
    } catch (error) {
      form.setError("root", {
        message: "An unexpected error occurred. Please try again.",
        type: "manual",
      });
      console.error("Try Again !!:", error);
    }
  }

  return isPending && data?.user ? (
    <Loader />
  ) : (
    <>
      {submittedSuccessfully ? (
        <>
          <h3 className="text-sm font-medium text-green-500">
            {isLogin ? "Login successful!" : "Registration successful!"}
          </h3>
          {!isLogin && (
            <p>
              A verification link has been sent to:{" "}
              <span className="font-semibold">{form.getValues("email")}</span>
            </p>
          )}
        </>
      ) : passwordReset ? (
        <Form {...resetForm}>
          {/* Display root form errors */}
          {resetForm.formState.errors.root && (
            <h3 className="text-sm font-medium text-red-600">
              {resetForm.formState.errors.root.message}
            </h3>
          )}

          <form
            onSubmit={resetForm.handleSubmit(handlePasswordReset)}
            className="space-y-3"
          >
            <FormField
              control={resetForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={resetForm.formState.isSubmitting}
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={resetForm.formState.isSubmitting}
              className="w-full"
            >
              {resetForm.formState.isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Sending Password Link...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...form}>
          {/* Display root form errors */}
          {form.formState.errors.root && (
            <h3 className="text-sm font-medium text-red-600">
              {form.formState.errors.root.message}
            </h3>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {!isLogin && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        type="text"
                        placeholder="Enter your full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
            {isLogin && (
              <p
                className="text-primary underline underline-offset-2 cursor-pointer"
                onClick={() => setPasswordReset(true)}
              >
                Forgot Password?
              </p>
            )}
            <p>
              {isLogin ? "Don't" : "Already"} have an account?{" "}
              <Link
                className="text-primary underline underline-offset-2 cursor-pointer"
                href={isLogin ? "/register" : "/login"}
              >
                {isLogin ? "register" : "login"}
              </Link>
            </p>
          </form>
        </Form>
      )}
    </>
  );
}
