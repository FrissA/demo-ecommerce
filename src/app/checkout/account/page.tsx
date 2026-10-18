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

// Guests only need an email. Registering also needs a name, password and
// terms; username, phone and birth date are optional.
const validate = (v: Account, guest: boolean): Errors => {
  const errors: Errors = {};
  if (!/^\S+@\S+\.\S+$/.test(v.email)) errors.email = "Enter a valid email.";
  if (guest) return errors;
  if (v.username && !/^[a-z0-9_]{4,}$/i.test(v.username))
    errors.username = "At least 4 letters, numbers or underscores.";
  if (v.password.length < 8 || !/\d/.test(v.password))
    errors.password = "At least 8 characters including a number.";
  if (v.confirmPassword !== v.password)
    errors.confirmPassword = "Passwords do not match.";
  if (!v.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!v.lastName.trim()) errors.lastName = "Enter your last name.";
  if (v.phone && v.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Enter a valid phone number or leave it empty.";
  if (!v.acceptTerms) errors.acceptTerms = "You must accept the terms.";
  return errors;
};

export default function CreateAccountPage() {
  const router = useRouter();
  const [values, setValues] = useState<Account>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [guest, setGuest] = useState(true);

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
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        className="h-11"
        {...props}
      />
      <FieldError id={`${key}-error`}>{errors[key]}</FieldError>
    </Field>
  );

  const switchMode = (nextGuest: boolean) => {
    setGuest(nextGuest);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values, guest);
    setErrors(nextErrors);
    track("account_submitted", {
      success: Object.keys(nextErrors).length === 0,
      error_fields: Object.keys(nextErrors),
    });
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    saveAccount(guest ? { ...EMPTY, email: values.email } : values);
    router.push("/checkout");
  };

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <BreadcrumbCheckout current={guest ? "Guest checkout" : "Create account"} />
        <h2
          className={cn([
            integralCF.className,
            "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
          ])}
        >
          {guest ? "checkout as guest" : "create account"}
        </h2>
        <Card className="w-full max-w-2xl rounded-[20px] border-black/10 shadow-none">
          <form onSubmit={handleSubmit} noValidate>
            <CardHeader>
              <div
                role="group"
                aria-label="How do you want to check out?"
                className="flex flex-wrap gap-2 mb-4"
              >
                {[
                  { guest: true, label: "Guest checkout" },
                  { guest: false, label: "Create account" },
                ].map((mode) => (
                  <button
                    key={mode.label}
                    type="button"
                    aria-pressed={guest === mode.guest}
                    className={cn([
                      "bg-[#F0F0F0] px-5 py-2.5 text-sm lg:text-base rounded-full",
                      guest === mode.guest && "bg-black font-medium text-white",
                    ])}
                    onClick={() => switchMode(mode.guest)}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold">
                {guest ? "Continue with your email" : "Register to continue"}
              </CardTitle>
              <CardDescription>
                {guest
                  ? "No account needed. We only use your email for order updates."
                  : "Save your details for next time. Optional fields can be left empty."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-5">
                {field("email", "Email", { type: "email", autoComplete: "email" })}
                {!guest && (
                  <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {field("firstName", "First name", { autoComplete: "given-name" })}
                      {field("lastName", "Last name", { autoComplete: "family-name" })}
                      {field("password", "Password", {
                        type: "password",
                        autoComplete: "new-password",
                      })}
                      {field("confirmPassword", "Confirm password", {
                        type: "password",
                        autoComplete: "new-password",
                      })}
                      {field("username", "Username (optional)", {
                        autoComplete: "username",
                      })}
                      {field("phone", "Phone (optional)", {
                        type: "tel",
                        autoComplete: "tel",
                      })}
                      {field("birthDate", "Date of birth (optional)", { type: "date" })}
                    </div>
                    <Field data-invalid={!!errors.acceptTerms}>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          id="acceptTerms"
                          type="checkbox"
                          className="h-5 w-5"
                          checked={values.acceptTerms}
                          aria-invalid={!!errors.acceptTerms}
                          aria-describedby={
                            errors.acceptTerms ? "acceptTerms-error" : undefined
                          }
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, acceptTerms: e.target.checked }))
                          }
                        />
                        I accept the terms of service and privacy policy
                      </label>
                      <FieldError id="acceptTerms-error">{errors.acceptTerms}</FieldError>
                    </Field>
                  </>
                )}
              </FieldGroup>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="text-sm md:text-base font-medium rounded-full w-full h-[54px] md:h-[60px]"
              >
                {guest ? "Continue to shipping" : "Create account"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
