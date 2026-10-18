"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BreadcrumbCheckout from "@/components/checkout-page/BreadcrumbCheckout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Account, continueAsGuest, saveAccount } from "@/lib/account";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";

const EMPTY: Account = {
  email: "",
  password: "",
};

type Errors = Partial<Record<keyof Account, string>>;

const validate = (v: Account): Errors => {
  const errors: Errors = {};
  if (!/^\S+@\S+\.\S+$/.test(v.email)) errors.email = "Enter a valid email.";
  if (v.password.length < 8)
    errors.password = "Use at least 8 characters.";
  return errors;
};

export default function CreateAccountPage() {
  const router = useRouter();
  const [values, setValues] = useState<Account>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  const field = (
    key: keyof Account,
    label: string,
    props: React.ComponentProps<typeof Input> = {}
  ) => (
    <Field data-invalid={!!errors[key]}>
      <FieldLabel htmlFor={key}>{label}</FieldLabel>
      <Input
        id={key}
        name={key}
        value={values[key]}
        onChange={(e) => {
          setValues((prev) => ({ ...prev, [key]: e.target.value }));
          setErrors((prev) => ({ ...prev, [key]: undefined }));
        }}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        className="h-11"
        {...props}
      />
      <FieldError id={`${key}-error`}>{errors[key]}</FieldError>
    </Field>
  );

  const handleGuest = () => {
    continueAsGuest();
    router.push("/checkout");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    track("account_submitted", {
      success: Object.keys(nextErrors).length === 0,
      error_fields: Object.keys(nextErrors),
    });
    if (Object.keys(nextErrors).length > 0) return;
    saveAccount(values);
    router.push("/checkout");
  };

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <BreadcrumbCheckout current="Checkout" />
        <h2
          className={cn([
            integralCF.className,
            "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
          ])}
        >
          checkout
        </h2>
        <div className="flex w-full max-w-2xl flex-col gap-5">
          <Card className="w-full rounded-[20px] border-black/10 shadow-none">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold">
                Check out as a guest
              </CardTitle>
              <CardDescription>
                No account needed. You only enter your shipping and payment
                details.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                type="button"
                onClick={handleGuest}
                className="text-sm md:text-base font-medium rounded-full w-full min-h-[54px] md:min-h-[60px] h-auto py-3 whitespace-normal"
              >
                Continue as guest
              </Button>
            </CardFooter>
          </Card>
          <Card className="w-full rounded-[20px] border-black/10 shadow-none">
            <form onSubmit={handleSubmit} noValidate>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-bold">
                  Or create an account (optional)
                </CardTitle>
                <CardDescription>
                  Just an email and a password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup className="gap-5">
                  {field("email", "Email", { type: "email", autoComplete: "email" })}
                  {field("password", "Password", {
                    type: "password",
                    autoComplete: "new-password",
                  })}
                </FieldGroup>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  variant="outline"
                  className="text-sm md:text-base font-medium rounded-full w-full min-h-[54px] md:min-h-[60px] h-auto py-3 whitespace-normal border-black"
                >
                  Create account and continue
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
