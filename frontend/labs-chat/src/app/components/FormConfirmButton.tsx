import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useFormStatus } from "react-dom";
import Image from "next/image";

import ArrowIcon from "@images/1904labsArrow_lightBG.svg";

const FormConfirmButton = ({ label }) => {
  const status = useFormStatus();

  return (
    <button
      className="mx-auto mt-4 flex w-80 justify-center bg-gradient-button bg-3x-wide bg-right fill-white px-4 py-2 font-bold text-form-primary-contrast transition-all duration-500 ease-in-out hover:bg-form-primary-hover hover:bg-left hover:fill-green-500"
      disabled={status.pending}
    >
      <span className="font-medium uppercase shadow-black drop-shadow-1904labs-text">
        {label}
      </span>
      <svg className="ml-3 mt-0.5" height={20} width={15}>
        <path d="M3.995.106l2.828 2.828-2.828 2.829-2.829-2.829zM7.53 3.641l2.83 2.829-2.83 2.828L4.702 6.47zm3.536 3.536l2.828 2.828-2.828 2.829-2.829-2.829zM7.53 10.712l2.829 2.829-2.829 2.828-2.828-2.828zm-3.535 3.536l2.828 2.828-2.828 2.829-2.829-2.829z"></path>
      </svg>
    </button>
  );
};

export default FormConfirmButton;
