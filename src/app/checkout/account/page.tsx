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

// Rules shown next to each field so shoppers know them before submitting
const HINTS: Partial<Record<keyof Account, string>> = {
  username: "At least 4 letters, numbers or underscores.",
  password: "At least 8 characters including a number.",
  phone: "At least 7 digits.",
};

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
  // Fields the shopper has left (or tried to submit); their errors update
  // live while typing
  const [touched, setTouched] = useState<Partial<Record<keyof Account, boolean>>>({});
  const liveErrors = validate(values);
  const errors: Errors = Object.fromEntries(
    Object.entries(liveErrors).filter(([key]) => touched[key as keyof Account])
  );

  const markTouched = (key: keyof Account) =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const field = (
    key: Exclude<keyof Account, "acceptTerms">,
    label: string,
    props: React.ComponentProps<typeof Input> = {}
  ) => (
    <Field data-invalid={!!errors[key]}>
      <FieldLabel htmlFor={key}>{label}</FieldLabel>
      <Input
        id={key}
        name={key}
        value={values[key]}
        onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
        onBlur={() => markTouched(key)}
        aria-invalid={!!errors[key]}
        aria-describedby={HINTS[key] ? `${key}-hint` : undefined}
        className="h-11"
        {...props}
      />
      {HINTS[key] && !errors[key] && (
        <FieldDescription id={`${key}-hint`}>{HINTS[key]}</FieldDescription>
      )}
      <FieldError>{errors[key]}</FieldError>
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
                Register to continue
              </CardTitle>
              <CardDescription>
                An account is optional. Create one, or{" "}
                <Link href="/checkout" className="font-medium text-black underline underline-offset-4">
                  continue as guest
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-5">
                {field("email", "Email", { type: "email", autoComplete: "email" })}
                {field("username", "Username", { autoComplete: "username" })}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {field("password", "Password", {
                    type: "password",
                    autoComplete: "new-password",
                  })}
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
                        markTouched("acceptTerms");
                      }}
                    />
                    I accept the terms of service and privacy policy
                  </label>
                  <FieldError>{errors.acceptTerms}</FieldError>
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button
                type="submit"
                className="text-sm md:text-base font-medium rounded-full w-full h-[54px] md:h-[60px]"
              >
                Create account
              </Button>
              <Button
                asChild
                variant="outline"
                className="text-sm md:text-base font-medium rounded-full w-full h-[54px] md:h-[60px]"
              >
                <Link href="/checkout">Continue as guest</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
