"use client";

import React, { useState } from "react";
import { MdOutlineLocalOffer } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const PROMO_CODES: Record<string, number> = { WELCOME10: 0.1 };

type PromoCodeFormProps = {
  applied: string | null;
  onApply: (code: string) => void;
};

const PromoCodeForm = ({ applied, onApply }: PromoCodeFormProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    const normalized = code.trim().toUpperCase();
    if (!(normalized in PROMO_CODES)) {
      setError("This code is not valid.");
      return;
    }
    setError(null);
    onApply(normalized);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex gap-3">
        <div className="relative w-full">
          <MdOutlineLocalOffer className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-black/40" />
          <Input
            id="promoCode"
            name="promoCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Promo code"
            className="h-11 rounded-full pl-11"
          />
        </div>
        <Button
          type="button"
          className="h-11 w-28 rounded-full"
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>
      {error && <span className="text-sm text-destructive">{error}</span>}
      {applied && !error && (
        <span className="text-sm text-muted-foreground">
          Code {applied} applied.
        </span>
      )}
    </div>
  );
};

export default PromoCodeForm;
