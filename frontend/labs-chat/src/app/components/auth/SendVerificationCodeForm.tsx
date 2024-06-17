"use client";

import {
  ArrowRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { handleSendEmailVerificationCode } from "@helpers/cognito-actions";
import { useFormState, useFormStatus } from "react-dom";

export default function SendVerificationCode() {
  const [response, dispatch] = useFormState(handleSendEmailVerificationCode, {
    message: "",
    errorMessage: "",
  });
  const { pending } = useFormStatus();
return (
    <>
        <button
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={pending}
            onClick={dispatch}
        >
            Resend Verification Code{" "}
            <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </button>
        <div className="flex h-8 items-end space-x-1">
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {response?.errorMessage && (
                    <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{response.errorMessage}</p>
                    </>
                )}
                {response?.message && (
                    <p className="text-sm text-green-500">{response.message}</p>
                )}
            </div>
        </div>
    </>
);
}