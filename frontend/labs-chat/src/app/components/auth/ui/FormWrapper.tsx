import React from "react";

interface FormWrapperProps {
  children: React.ReactNode;
  dispatch: any;
  title: string;
}

const FormWrapper = ({ children, dispatch, title }: FormWrapperProps) => {
  return (
    <form action={dispatch} className="w-full max-w-80 space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>{title}</h1>
        <div className="w-full">{children}</div>
      </div>
    </form>
  );
};

export default FormWrapper;
