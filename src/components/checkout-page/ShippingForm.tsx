"use client";

import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShippingInfo } from "@/lib/features/checkout/checkoutSlice";
import { track } from "@/lib/analytics";

const COUNTRIES = [
  "United States",
  "Canada",
  "Mexico",
  "Argentina",
  "United Kingdom",
  "Spain",
  "France",
  "Germany",
];

const EMPTY_SHIPPING: ShippingInfo = {
  email: "",
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  country: COUNTRIES[0],
};

type Errors = Partial<Record<keyof ShippingInfo, string>>;

const validate = (values: ShippingInfo): Errors => {
  const errors: Errors = {};
  if (!/^\S+@\S+\.\S+$/.test(values.email))
    errors.email = "Enter a valid email address.";
  if (values.fullName.trim().length < 2) errors.fullName = "Enter your name.";
  if (values.address.trim().length < 4)
    errors.address = "Enter your street address.";
  if (!values.city.trim()) errors.city = "Enter your city.";
  if (!values.postalCode.trim()) errors.postalCode = "Enter a postal code.";
  if (!values.country) errors.country = "Choose your country.";
  return errors;
};

const LABELS: Record<keyof ShippingInfo, string> = {
  email: "Email",
  fullName: "Full name",
  address: "Address",
  city: "City",
  postalCode: "Postal code",
  country: "Country",
};

type ShippingFormProps = {
  defaultValues: ShippingInfo | null;
  onSubmit: (values: ShippingInfo) => void;
  promoApplied?: boolean;
};

const ShippingForm = ({
  defaultValues,
  onSubmit,
  promoApplied = false,
}: ShippingFormProps) => {
  const [values, setValues] = useState<ShippingInfo>(
    defaultValues ?? EMPTY_SHIPPING
  );
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const update =
    (key: keyof ShippingInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [key]: value }));
      // Clear a field's message as soon as the shopper fixes it
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    track("shipping_submitted", {
      success: Object.keys(nextErrors).length === 0,
      error_fields: Object.keys(nextErrors),
      promo_applied: promoApplied,
    });
    const firstInvalid = Object.keys(nextErrors)[0];
    if (!firstInvalid) {
      setSubmitting(true);
      onSubmit(values);
    } else {
      document.getElementById(firstInvalid)?.focus();
    }
  };

  const textField = (
    key: keyof ShippingInfo,
    label: string,
    props: React.ComponentProps<typeof Input> = {}
  ) => (
    <Field data-invalid={!!errors[key]}>
      <FieldLabel htmlFor={key} className="text-base">
        {label}
      </FieldLabel>
      <Input
        id={key}
        name={key}
        value={values[key]}
        onChange={update(key)}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        className="h-12 text-base"
        {...props}
      />
      <FieldError
        id={`${key}-error`}
        className="text-base font-semibold text-red-700"
      >
        {errors[key] && `${label}: ${errors[key]}`}
      </FieldError>
    </Field>
  );

  const errorKeys = Object.keys(errors) as (keyof ShippingInfo)[];

  return (
    <Card className="w-full rounded-[20px] border-black/10 shadow-none">
      <form onSubmit={handleSubmit} noValidate>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold">
            Contact & Shipping
          </CardTitle>
          <CardDescription>Where should we send your order?</CardDescription>
        </CardHeader>
        <CardContent>
          {errorKeys.length > 0 && (
            <div
              role="alert"
              className="mb-5 rounded-lg border-2 border-red-700 bg-red-50 p-4 text-base text-red-800"
            >
              <p className="font-bold">
                {errorKeys.length === 1
                  ? "1 thing needs fixing before you can continue:"
                  : `${errorKeys.length} things need fixing before you can continue:`}
              </p>
              <ul className="mt-2 list-disc pl-5">
                {errorKeys.map((key) => (
                  <li key={key}>
                    <a
                      href={`#${key}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(key)?.focus();
                      }}
                      className="font-semibold underline underline-offset-2"
                    >
                      {LABELS[key]}: {errors[key]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <FieldGroup className="gap-5">
            {textField("email", LABELS.email, {
              type: "email",
              autoComplete: "email",
              placeholder: "you@example.com",
            })}
            {textField("fullName", LABELS.fullName, { autoComplete: "name" })}
            {textField("address", LABELS.address, {
              autoComplete: "street-address",
            })}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {textField("city", LABELS.city, {
                autoComplete: "address-level2",
              })}
              {textField("postalCode", LABELS.postalCode, {
                autoComplete: "postal-code",
              })}
            </div>
            <Field data-invalid={!!errors.country}>
              <FieldLabel htmlFor="country" className="text-base">
                {LABELS.country}
              </FieldLabel>
              {/* Native select: clearly a dropdown, large, and uses the
                  phone's own picker instead of a custom popup */}
              <select
                id="country"
                name="country"
                autoComplete="country-name"
                value={values.country}
                onChange={update("country")}
                aria-invalid={!!errors.country}
                aria-describedby={errors.country ? "country-error" : undefined}
                className="h-12 w-full cursor-pointer rounded-md border-2 border-black/50 bg-white px-3 text-base text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black aria-invalid:border-red-700"
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <FieldError
                id="country-error"
                className="text-base font-semibold text-red-700"
              >
                {errors.country && `${LABELS.country}: ${errors.country}`}
              </FieldError>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="sticky bottom-0 z-10 flex-col items-stretch gap-3 rounded-b-[20px] bg-white pt-4 md:static md:pt-0">
          {errorKeys.length > 0 && (
            <p className="text-base font-semibold text-red-700">
              Still to fix: {errorKeys.map((key) => LABELS[key]).join(", ")}
            </p>
          )}
          <Button
            type="submit"
            disabled={submitting}
            className="text-sm md:text-base font-medium rounded-full w-full h-[54px] md:h-[60px]"
          >
            {submitting ? "Continuing..." : "Continue to payment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ShippingForm;
