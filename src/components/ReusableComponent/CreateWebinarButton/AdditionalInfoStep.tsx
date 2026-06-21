"use client";

import React from "react";
import { Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useWebinarStore } from "@/store/useWebinarStore";

type Props = {};

const AdditionalInfoStep = ({}: Props) => {
  const { formData, updateAdditionalInfoField, getStepValidationErrors } =
    useWebinarStore();

  const { lockChat, couponCode, couponEnabled } = formData.additionalInfo;

  const errors = getStepValidationErrors("additionalInfo");

  const handleToggleLockChat = (checked: boolean) => {
    updateAdditionalInfoField("lockChat", checked);
  };

  const handleToggleCoupon = (checked: boolean) => {
    updateAdditionalInfoField("couponEnabled", checked);
  };

  const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAdditionalInfoField("couponCode", e.target.value);
  };

  return (
    <div className="space-y-8">
      {/* Lock Chat */}
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="lock-chat" className="text-base font-medium">
            Lock Chat
          </Label>

          <p className="text-sm text-muted-foreground">
            Turn it on to make chat visible to your users at all time
          </p>
        </div>

        <Switch
          id="lock-chat"
          checked={lockChat || false}
          onCheckedChange={handleToggleLockChat}
        />
      </div>

      {/* Coupon Code */}
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="coupon-enabled" className="text-base font-medium">
            Coupon Code
          </Label>

          <p className="text-sm text-muted-foreground">
            Turn it on to offer discounts to your viewers
          </p>
        </div>

        <Switch
          id="coupon-enabled"
          checked={couponEnabled || false}
          onCheckedChange={handleToggleCoupon}
        />
      </div>

      {/* Coupon Input */}
      {couponEnabled && (
        <div className="space-y-2">
          <Input
            id="coupon-code"
            value={couponCode || ""}
            onChange={handleCouponCodeChange}
            placeholder="Paste the code here"
            className={cn(
              "bg-background/50",
              errors.couponCode && "border-red-400 focus-visible:ring-red-400",
            )}
          />

          {errors.couponCode && (
            <p className="text-sm text-red-400">{errors.couponCode}</p>
          )}

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />

            <p>
              This coupon code can be used to promote a sale. Users can use it
              for the Buy Now CTA.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalInfoStep;
