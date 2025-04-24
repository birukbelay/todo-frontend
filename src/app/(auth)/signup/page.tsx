"use client";
import { AuthLayout } from "@/app/(auth)/components/auth-layout";
import {
  EmailInput,
  GoToLink,
  NameInput,
  Password,
  SubmitInput,
} from "@/app/(auth)/components/inputs";

import { BASE_URL } from "@/lib/constants";
import { API } from "@/lib/constants/api-paths";
import { HandleAxiosErr } from "@/lib/functions/axios.error";
import { DisplayErrors } from "@/lib/functions/object";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
import { message } from "antd";
import { SignupValidator, TSignupSchema } from "../models";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TSignupSchema>({ resolver: zodResolver(SignupValidator) });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TSignupSchema) => {
    try {
      setLoading(true);
      const datas = await axios.post(`${BASE_URL}/${API.register}`, data); // mutation.mutateAsync({ url: API.register, body: data, method: MTD.POST })
      console.log("registration data==", datas);
      // toast.success("Successfully Registered");
      reset();
      setLoading(false);
      router.push(`/signup/${data.email}`);
      console.log("data====||", datas);
    } catch (e: any) {
      setLoading(false);
      const resp = HandleAxiosErr(e);
      console.log("---", resp);
      messageApi.error(resp.Message);
    }
  };

  return (
    <>
      <AuthLayout title={"Sign Up"}>
        {contextHolder}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Div */}
          <div className=" space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1">
                <NameInput
                  register={register("firstName")}
                  error={errors.lastName}
                  placeholder={"First Name"}
                />
              </div>
              <div className="flex-1">
                <NameInput
                  register={register("lastName")}
                  error={errors.lastName}
                  placeholder={"Last Name"}
                />
              </div>
            </div>
          </div>

          <EmailInput
            register={register("email")}
            error={errors.email}
            placeholder={"email"}
          />
          <Password
            register={register("password")}
            error={errors.password}
            placeHolder={"6+ Characters, 1 Capital letter"}
            label={"Password"}
          />
          <Password
            register={register("confirmPassword")}
            error={errors.confirmPassword}
            placeHolder={"Re-enter your password"}
            label={"Re-type Password"}
          />
          <SubmitInput title={"Create account"} loading={loading} />
          {DisplayErrors(errors)}
          <GoToLink
            path={"/login"}
            text1={"Already have an account?"}
            text2="Sign In"
          />
        </form>
      </AuthLayout>
    </>
  );
};

export default SignUp;
