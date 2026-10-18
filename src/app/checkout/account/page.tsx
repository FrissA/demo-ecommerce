"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { Account, saveAccount } from "@/lib/account";
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
  if (v.password.length < 8 || !/\d/.test(v.password))
    errors.password = "At least 8 characters including a number.";
  return errors;
};

export default function CreateAccountPage() {
  const router = useRouter();
  const [values, setValues] = useState<Account>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Account, boolean>>>(
    {}
  );

  // Errors show inline as soon as a field has been left, not only on submit
  const revalidate = (next: Account, nextTouched: typeof touched) => {
    const all = validate(next);
    setErrors(
      Object.fromEntries(
        Object.entries(all).filter(([key]) => nextTouched[key as keyof Account])
      )
    );
  };

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
          const next = { ...values, [key]: e.target.value };
          setValues(next);
          if (touched[key]) revalidate(next, touched);
        }}
        onBlur={() => {
          const nextTouched = { ...touched, [key]: true };
          setTouched(nextTouched);
          revalidate(values, nextTouched);
        }}
        aria-invalid={!!errors[key]}
        className="h-11"
        {...props}
      />
      <FieldError>{errors[key]}</FieldError>
    </Field>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
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
        <BreadcrumbCheckout current="Create account" />
        <h2
          className={cn([
            integralCF.className,
            "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
          ])}
        >
          create account
        </h2>
        <Card className="w-full max-w-2xl rounded-[20px] border-black/10 shadow-none">
          <form onSubmit={handleSubmit} noValidate>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold">
                Check out as a guest
              </CardTitle>
              <CardDescription>
                No account needed to place an order.
              </CardDescription>
              <Button
                asChild
                className="!mt-4 text-sm md:text-base font-medium rounded-full w-full h-[54px] md:h-[60px]"
              >
                <Link href="/checkout">Continue as guest</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-base font-bold mb-4">
                Or create an account (optional)
              </p>
              <FieldGroup className="gap-5">
                {field("email", "Email", { type: "email", autoComplete: "email" })}
                {field("password", "Password", {
                  type: "password",
                  autoComplete: "new-password",
                  placeholder: "At least 8 characters including a number",
                })}
              </FieldGroup>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                variant="outline"
                className="text-sm md:text-base font-medium rounded-full w-full h-[54px] md:h-[60px]"
              >
                Create account and continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
