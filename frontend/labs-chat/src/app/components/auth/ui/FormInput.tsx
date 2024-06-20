import React, { JSXElementConstructor } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  unique_id: string;
  label: string;
  type: string;
  IconComponent?: any;
}

const FormInput = ({
  label,
  unique_id,
  type,
  IconComponent,
  ...rest
}: FormInputProps) => {
  return (
    <div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor={unique_id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          className={`peer block w-full rounded-md border border-gray-200 py-[9px] ${IconComponent ? "pl-10" : "pl-3"} text-sm outline-2 placeholder:text-gray-500`}
          id={unique_id}
          type={type}
          name={unique_id}
          {...rest}
        />
        {IconComponent && (
          <IconComponent className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        )}
      </div>
    </div>
  );
};

export default FormInput;
