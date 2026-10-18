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
  FieldDescription,
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
  username: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  phone: "",
  birthDate: "",
  acceptTerms: false,
};

type Errors = Partial<Record<keyof Account, string>>;

const validate = (v: Account): Errors => {
  const errors: Errors = {};
  if (!/^\S+@\S+\.\S+$/.test(v.email)) errors.email = "Enter a valid email.";
  if (!/^[a-z0-9_]{4,}$/i.test(v.username))
    errors.username = "At least 4 letters, numbers or underscores.";
  if (v.password.length < 8 || !/\d/.test(v.password))
    errors.password = "At least 8 characters including a number.";
  if (v.confirmPassword !== v.password)
    errors.confirmPassword = "Passwords do not match.";
  if (!v.firstName.trim()) errors.firstName = "Required.";
  if (!v.lastName.trim()) errors.lastName = "Required.";
  if (v.phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a phone number.";
  if (!v.birthDate) errors.birthDate = "Required.";
  if (!v.acceptTerms) errors.acceptTerms = "You must accept the terms.";
  return errors;
};

export default function CreateAccountPage() {
  const router = useRouter();
  const [values, setValues] = useState<Account>(EMPTY);
  // Errors show per field once it has been left (or after a submit attempt)
  // and then update live as the shopper types.
  const [touched, setTouched] = useState<Partial<Record<keyof Account, boolean>>>({});
  const allErrors = validate(values);
  const errors: Errors = Object.fromEntries(
    Object.entries(allErrors).filter(([key]) => touched[key as keyof Account])
  );

  const touch = (key: keyof Account) =>
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

  const field = (
    key: Exclude<keyof Account, "acceptTerms">,
    label: string,
    props: React.ComponentProps<typeof Input> = {},
    hint?: string
  ) => (
    <Field data-invalid={!!errors[key]}>
      <FieldLabel htmlFor={key}>{label}</FieldLabel>
      <Input
        id={key}
        name={key}
        value={values[key]}
        onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
        onBlur={() => touch(key)}
        aria-invalid={!!errors[key]}
        aria-describedby={
          [hint && `${key}-hint`, errors[key] && `${key}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className="h-11"
        {...props}
      />
      {hint && <FieldDescription id={`${key}-hint`}>{hint}</FieldDescription>}
      <FieldError id={`${key}-error`}>{errors[key]}</FieldError>
    </Field>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setTouched(
      Object.fromEntries(Object.keys(EMPTY).map((key) => [key, true]))
    );
    track("account_submitted", {
      success: Object.keys(nextErrors).length === 0,
      error_fields: Object.keys(nextErrors),
    });
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }
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
                Register to continue
              </CardTitle>
              <CardDescription>
                An account is required to place an order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-5">
                {field("email", "Email", { type: "email", autoComplete: "email" })}
                {field(
                  "username",
                  "Username",
                  { autoComplete: "username" },
                  "At least 4 letters, numbers or underscores."
                )}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {field(
                    "password",
                    "Password",
                    { type: "password", autoComplete: "new-password" },
                    "At least 8 characters including a number."
                  )}
                  {field("confirmPassword", "Confirm password", {
                    type: "password",
                    autoComplete: "new-password",
                  })}
                  {field("firstName", "First name", { autoComplete: "given-name" })}
                  {field("lastName", "Last name", { autoComplete: "family-name" })}
                  {field("phone", "Phone", { type: "tel", autoComplete: "tel" })}
                  {field("birthDate", "Date of birth", { type: "date" })}
                </div>
                <Field data-invalid={!!errors.acceptTerms}>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      checked={values.acceptTerms}
                      onChange={(e) => {
                        setValues((prev) => ({ ...prev, acceptTerms: e.target.checked }));
                        touch("acceptTerms");
                      }}
                      aria-invalid={!!errors.acceptTerms}
                      className="size-5"
                    />
                    I accept the terms of service and privacy policy
                  </label>
                  <FieldError>{errors.acceptTerms}</FieldError>
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="text-sm md:text-base font-medium rounded-full w-full h-[54px] md:h-[60px]"
              >
                Create account
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
