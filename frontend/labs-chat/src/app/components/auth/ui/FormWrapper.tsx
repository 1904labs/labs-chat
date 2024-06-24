import React from "react";

interface FormWrapperProps {
  children: React.ReactNode;
  dispatch: any;
  title: string;
}

const FormWrapper = ({ children, dispatch, title }: FormWrapperProps) => {
  return (
    <form action={dispatch} className="w-full">
      <div className="flex flex-1 flex-col items-center rounded-lg px-6 pb-4 pt-8">
        <h1
          className={`mb-8 text-center text-4xl font-semibold text-1904labs-grey-500`}
        >
          {title}
        </h1>
        <div className="w-full max-w-80">{children}</div>
      </div>
    </form>
  );
};

export default FormWrapper;
