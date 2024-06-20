import { ExclamationCircleIcon } from "@heroicons/react/24/outline"

interface FormErrorMessageProps {
    message: string | undefined;
}

const FormErrorMessage = ({ message }: FormErrorMessageProps) => {
    return (
        <div className="flex items-end space-x-1 mt-5">
            <div
                className="flex items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {message && (
                    <div className="flex space-x-2">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{message}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FormErrorMessage;