
import { LockKeyhole, LucideMail, LucideUser } from "lucide-react";


interface GoToLinkProps {
  path: string;
  text1: string;
  text2: string;
}

export function GoToLink({ path, text1, text2 }: GoToLinkProps) {
  return (
    <div className="mt-4 text-center">
    <span className="text-sm text-gray-600 dark:text-gray-400">{text1}</span>{" "}
    <a
      href={path}
      className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
    >
      {text2}
    </a>
  </div>
  );
}

export function EmailInput({ register, error }: any) {
  return (
    <>
    <div className="space-y-2 mb-4">
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <div className="relative">
        <input
          {...register}
          type="email"
          placeholder="Enter your email"
          required
          className="w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-4 pr-10 text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        <LucideMail />
        </span>
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    </div>
    </>
    
  );
}

export function Password({ register, error, placeHolder, label }: any) {
  return (
    <div className="space-y-2 mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          {...register}
          type="password"
          placeholder={placeHolder}
          required
          className="w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-4 pr-10 text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        <LockKeyhole/>
        </span>
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    </div>
  );
}

export function NameInput({ register, error, placeholder }: any) {
  return (
    <div>
      <input
        {...register}
        type="text"
        required
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-4 pr-10 text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      {/*<span className="absolute right-4 top-4"><SvgSignup2/></span>*/}
      {error && <p className="text-red">{error.message}</p>}
    </div>
  );
}

export function UserNameInput({ register, error, placeholder, lable }: any) {
  return (
    <div className="space-y-2 mb-4">
      <label className="block text-sm font-medium text-gray-700">{lable}</label>
      <div className="relative">
        <input
          {...register}
          type="text"
          placeholder={placeholder}
          required
          className="w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-4 pr-10 text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <LucideUser className="h-5 w-5" />
        </span>
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    </div>
  );
}

export function SubmitInput({ loading = false, title }: {loading: boolean, title: string}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 py-3 px-4 text-center font-medium text-white shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 mb-4"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </div>
      ) : (
        title
      )}
    </button>
  );
}
