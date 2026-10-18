"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  CARD_BRAND_LABELS,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  getCardBrand,
  isValidCardNumber,
  isValidCvc,
  isValidExpiry,
} from "@/lib/payment";

export type PaymentDetails = {
  cardNumber: string;
  nameOnCard: string;
  expiry: string;
  cvc: string;
};

type Errors = Partial<Record<keyof PaymentDetails, string>>;

const validate = (values: PaymentDetails): Errors => {
  const errors: Errors = {};
  if (!isValidCardNumber(values.cardNumber))
    errors.cardNumber = "Enter a valid card number.";
  if (values.nameOnCard.trim().length < 2)
    errors.nameOnCard = "Enter the name shown on the card.";
  if (!isValidExpiry(values.expiry))
    errors.expiry = "Enter a future date as MM/YY.";
  if (!isValidCvc(values.cvc, values.cardNumber))
    errors.cvc = "Enter the security code.";
  return errors;
};

const PAYMENT_LABELS: Record<keyof PaymentDetails, string> = {
  cardNumber: "Card number",
  nameOnCard: "Name on card",
  expiry: "Expiry",
  cvc: "CVC",
};

type PaymentFormProps = {
  total: number;
  processing: boolean;
  defaultName?: string;
  onSubmit: (values: PaymentDetails) => void;
};

const PaymentForm = ({
  total,
  processing,
  defaultName = "",
  onSubmit,
}: PaymentFormProps) => {
  const [values, setValues] = useState<PaymentDetails>({
    cardNumber: "",
    nameOnCard: defaultName,
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const brand = getCardBrand(values.cardNumber);

  const set = (key: keyof PaymentDetails, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear a field's message as soon as the shopper edits it
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
    const firstInvalid = Object.keys(nextErrors)[0];
    if (!firstInvalid) onSubmit(values);
    else document.getElementById(firstInvalid)?.focus();
  };

  const errorKeys = Object.keys(errors) as (keyof PaymentDetails)[];

  return (
    <Card className="w-full rounded-[20px] border-black/10 shadow-none">
      <form onSubmit={handleSubmit} noValidate>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold">Payment</CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <Lock className="size-3.5" />
            This is a simulated checkout. No real payment is made.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FieldSet disabled={processing}>
            <FieldGroup className="gap-5">
              <Field data-invalid={!!errors.cardNumber}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="cardNumber">Card number</FieldLabel>
                  {brand !== "unknown" && (
                    <Badge variant="secondary">{CARD_BRAND_LABELS[brand]}</Badge>
                  )}
                </div>
                <Input
                  id="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 1234 1234 1234"
                  value={values.cardNumber}
                  onChange={(e) =>
                    set("cardNumber", formatCardNumber(e.target.value))
                  }
                  aria-invalid={!!errors.cardNumber}
                  className="h-12 text-base tabular-nums disabled:opacity-100"
                />
                <FieldError className="text-base font-semibold text-red-700">{errors.cardNumber}</FieldError>
              </Field>
              <Field data-invalid={!!errors.nameOnCard}>
                <FieldLabel htmlFor="nameOnCard">Name on card</FieldLabel>
                <Input
                  id="nameOnCard"
                  autoComplete="cc-name"
                  value={values.nameOnCard}
                  onChange={(e) => set("nameOnCard", e.target.value)}
                  aria-invalid={!!errors.nameOnCard}
                  className="h-12 text-base disabled:opacity-100"
                />
                <FieldError className="text-base font-semibold text-red-700">{errors.nameOnCard}</FieldError>
              </Field>
              <div className="grid grid-cols-2 gap-5">
                <Field data-invalid={!!errors.expiry}>
                  <FieldLabel htmlFor="expiry">Expiry</FieldLabel>
                  <Input
                    id="expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={values.expiry}
                    onChange={(e) => set("expiry", formatExpiry(e.target.value))}
                    aria-invalid={!!errors.expiry}
                    className="h-12 text-base tabular-nums disabled:opacity-100"
                  />
                  <FieldError className="text-base font-semibold text-red-700">{errors.expiry}</FieldError>
                </Field>
                <Field data-invalid={!!errors.cvc}>
                  <FieldLabel htmlFor="cvc">CVC</FieldLabel>
                  <Input
                    id="cvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder={brand === "amex" ? "1234" : "123"}
                    maxLength={4}
                    value={values.cvc}
                    onChange={(e) => set("cvc", digitsOnly(e.target.value))}
                    aria-invalid={!!errors.cvc}
                    className="h-12 text-base tabular-nums disabled:opacity-100"
                  />
                  <FieldError className="text-base font-semibold text-red-700">{errors.cvc}</FieldError>
                </Field>
              </div>
              <FieldDescription>
                Card details stay in this browser tab and are never saved.
              </FieldDescription>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="sticky bottom-0 z-10 flex-col items-stretch gap-3 rounded-b-[20px] bg-white pt-4 md:static md:pt-0">
          {errorKeys.length > 0 && (
            <div
              role="alert"
              className="rounded-lg border-2 border-red-700 bg-red-50 p-4 text-base text-red-800"
            >
              <p className="font-bold">
                Payment not sent yet. Please fix:
              </p>
              <ul className="mt-1 list-disc pl-5">
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
                      {PAYMENT_LABELS[key]}: {errors[key]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {processing && (
            <p role="status" className="text-base font-semibold text-black">
              Processing your payment, please wait…
            </p>
          )}
          <Button
            type="submit"
            disabled={processing}
            className="text-sm md:text-base font-medium rounded-full w-full h-[54px] md:h-[60px] gap-2"
          >
            {processing ? (
              <>
                <Spinner />
                Processing payment…
              </>
            ) : (
              `Pay $${total}`
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PaymentForm;
