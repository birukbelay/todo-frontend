import { Search } from "lucide-react";

import React, { forwardRef, HTMLInputTypeAttribute } from "react";
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: any;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors ${className}`}
            {...props}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
          )}
        </div>
      </div>
    );
  }
);
export interface InputProps {
  register?: any;
  errors?: any;
  //non use Form
  label: string;
  name: string;
  handleChange?: any;
  placeholder: string;
  req?: boolean;
  inputType?: HTMLInputTypeAttribute;
  row?: number;
  className?: string;
}
export const InputField = ({
  label,
  name,
  register,
  handleChange,
  placeholder,
  errors,
  req = true,
  inputType = "text",
  className = "",
}: InputProps) => {
  return (
    <div className="mb-4.5">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {req && <span className="text-meta-1">*</span>}
      </label>
      <input
        {...register(name)}
        onChange={(e) => handleChange(name, e.target.value)}
        type={inputType}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors ${className}`}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );
};
FormInput.displayName = "FormInput";

export const SearchInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={ref}
          type="search"
          className={`w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors ${className}`}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: any;
  }
>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={ref}
          className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    </div>
  );
});

TextArea.displayName = "TextArea";

export const TextAreaField = ({
  label,
  name,
  register,
  handleChange,
  placeholder,
  errors,
  req = true,
  row = 6,
}: InputProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700">
        {label} {req && <span className="text-meta-1">*</span>}
      </label>
      <textarea
        {...register(name)}
        onChange={(e) => handleChange(name, e.target.value)}
        rows={row}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-4 pr-10 text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      {errors[name] && <p className="text-red">{errors[name].message}</p>}
    </div>
  );
};
