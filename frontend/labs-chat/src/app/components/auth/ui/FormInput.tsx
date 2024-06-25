import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  unique_id: string;
  label: string;
  type: string;
  helperText?: string;
  IconComponent?: any;
}

const FormInput = ({
  label,
  unique_id,
  type,
  IconComponent,
  helperText,
  ...rest
}: FormInputProps) => {
  return (
    <div className="py-2">
      <div className="relative">
        <input
          className={`peer block w-full border border-gray-100 py-[9px] drop-shadow-sm ${IconComponent ? "pl-12" : "pl-3"} text-sm outline-2 placeholder:text-1904labs-grey-200`}
          id={unique_id}
          type={type}
          name={unique_id}
          {...rest}
        />
        {IconComponent && (
          <IconComponent className="pointer-events-none absolute left-2 top-1/2 h-full w-[28px] -translate-y-1/2 border-r pr-2 text-gray-500 peer-focus:text-gray-900" />
        )}
      </div>
      {helperText && (
        <p className="pt-2 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormInput;
