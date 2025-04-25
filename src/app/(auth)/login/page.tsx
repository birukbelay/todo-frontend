"use client";
import {
  GoToLink,
  Password,
  SubmitInput,
  UserNameInput,
} from "@/app/(auth)/components/inputs";
import { DisplayErrors } from "@/lib/functions/object";
import { useAuth } from "@/lib/state/context/jotai-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

import { message } from "antd";
import { AuthLayout } from "../components/auth-layout";
import { LoginValidator, TLoginSchema } from "../models";

const SignIn: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { loadingAuth, login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({ resolver: zodResolver(LoginValidator) });

  const onSubmit = async (input: TLoginSchema) => {
    const data = await login(input);
    if (!data.ok) {
      messageApi.error(`${data.message}`);
      return;
    }
    messageApi.success(
      `Successfully logged In as ${data.body.user_data?.email}`
    );
    router.push("/todo");
  };

  return (
    <>
      {contextHolder}
      <AuthLayout title="Login">
        <form onSubmit={handleSubmit(onSubmit)}>
          <UserNameInput
            register={register("info")}
            error={errors.info}
            placeholder="Enter User Name"
            lable="Username"
          />
          <Password
            register={register("password")}
            error={errors.password}
            placeHolder="Enter Password"
            label="Password"
          />
          <SubmitInput title="Login" loading={loadingAuth } />

          <GoToLink
            path="/signup"
            text1="Don't have any account?"
            text2="Sign Up"
          />

          {DisplayErrors(errors)}
        </form>
      </AuthLayout>
    </>
  );
};

export default SignIn;
