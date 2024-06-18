"use client";

import {
  ArrowRightIcon,
  AtSymbolIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { handleSendEmailVerificationCode } from "@/helpers/cognito-actions";
import { useFormState } from "react-dom";
import FormConfirmButton from "../FormConfirmButton";
import { useSearchParams } from "next/navigation";

export default function SendVerificationCodeForm() {
  const searchParams = useSearchParams();
  const [response, dispatch] = useFormState(handleSendEmailVerificationCode, {
    message: "",
    errorMessage: "",
  });
  return (
    <form action={dispatch} className="w-full max-w-80 space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>Resend Verification Code</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                defaultValue={searchParams.get("email") ?? ""}
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <FormConfirmButton label="Send" />
          <div className="flex h-8 items-end space-x-1">
            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {response?.errorMessage && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">
                    {response.errorMessage}
                  </p>
                </>
              )}
              {response?.message && (
                <p className="text-sm text-green-500">{response.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
