import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useFormStatus } from "react-dom";

const FormConfirmButton = ({ label }) => {
  const status = useFormStatus();

  return (
    <button
      className="mt-4 flex w-full max-w-80 m-auto justify-around rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
      disabled={status.pending}
    >
      {label} <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </button>
  );
};

export default FormConfirmButton;
