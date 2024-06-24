import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useFormStatus } from "react-dom";

const FormConfirmButton = ({ label }) => {
  const status = useFormStatus();

  return (
    <button
      className="m-auto mt-4 flex w-full max-w-80 justify-around rounded bg-form-primary px-4 py-2 font-bold text-form-primary-contrast shadow-md hover:bg-form-primary-hover"
      disabled={status.pending}
    >
      {label} <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </button>
  );
};

export default FormConfirmButton;
