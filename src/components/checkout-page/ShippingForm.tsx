"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  return errors;
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

  const update =
    (key: keyof ShippingInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    track("shipping_submitted", {
      success: Object.keys(nextErrors).length === 0,
      error_fields: Object.keys(nextErrors),
      promo_applied: promoApplied,
    });
    const [firstInvalid] = Object.keys(nextErrors);
    if (!firstInvalid) onSubmit(values);
    else document.getElementById(firstInvalid)?.focus();
  };

  const textField = (
    key: keyof ShippingInfo,
    label: string,
    props: React.ComponentProps<typeof Input> = {}
  ) => (
    <Field data-invalid={!!errors[key]}>
      <FieldLabel htmlFor={key}>{label}</FieldLabel>
      <Input
        id={key}
        name={key}
        value={values[key]}
        onChange={update(key)}
        aria-invalid={!!errors[key]}
        className="h-11"
        {...props}
      />
      <FieldError>{errors[key]}</FieldError>
    </Field>
  );

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
          <FieldGroup className="gap-5">
            {textField("email", "Email", {
              type: "email",
              autoComplete: "email",
              placeholder: "you@example.com",
            })}
            {textField("fullName", "Full name", { autoComplete: "name" })}
            {textField("address", "Address", {
              autoComplete: "street-address",
            })}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {textField("city", "City", { autoComplete: "address-level2" })}
              {textField("postalCode", "Postal code", {
                autoComplete: "postal-code",
              })}
            </div>
            <Field>
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <Select
                value={values.country}
                onValueChange={(country) =>
                  setValues((prev) => ({ ...prev, country }))
                }
              >
                <SelectTrigger id="country" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="sticky bottom-0 z-10 flex-col gap-2 rounded-b-[20px] bg-white pt-4">
          {Object.keys(errors).length > 0 && (
            <p role="alert" className="w-full text-sm font-medium text-red-600">
              Please fix the highlighted fields above to continue.
            </p>
          )}
          <Button
            type="submit"
            className="text-sm md:text-base font-medium rounded-full w-full h-[54px] md:h-[60px] focus-visible:ring-4 focus-visible:ring-black/40 focus-visible:ring-offset-2"
          >
            Continue to payment
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ShippingForm;
