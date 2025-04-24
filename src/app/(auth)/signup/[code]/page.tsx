"use client";
import { AuthLayout } from "@/app/(auth)/components/auth-layout";
import {
  GoToLink,
  SubmitInput,
  UserNameInput,
} from "@/app/(auth)/components/inputs";

import { BASE_URL } from "@/lib/constants";

import { API } from "@/lib/constants/api-paths";
import { HandleAxiosErr } from "@/lib/functions/axios.error";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CodeValidator, TCodeSchema } from "../../models";
// import { usePathname } from "next/navigation";

const VerifyCode = (params: any) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TCodeSchema>({
    resolver: zodResolver(CodeValidator),
    defaultValues: { phoneOrEmail: decodeURIComponent(params.code) },
  });

  const onSubmit = async (data: TCodeSchema) => {
    try {
      setLoading(true);

      const paths = pathname?.split("/") || "";
      const datas = await axios.post(`${BASE_URL}/${API.activate}`, {
        code: data.code,
        phoneOrEmail: paths[paths?.length - 1],
      }); // mutation.mutateAsync({ url: API.register, body: data, method: MTD.POST })
      console.log("registration data==", datas);
      toast.success("Account Successfully Verified");
      reset();
      router.push(`/login`);
      console.log("data====||", datas);
      setLoading(false);
    } catch (e: any) {
      const resp = HandleAxiosErr(e);
      toast.error(resp.Message);
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout title={"Verify Code"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <UserNameInput
            register={register("code")}
            error={errors.code}
            placeholder={"verification code"}
          />

          <SubmitInput loading={loading} title={"Verify Code"} />
          {/*{!isEmptyObject(errors) ? `${JSON.stringify(errors)}` : ""}*/}
          <GoToLink
            path={"/signup"}
            text1={"Didnt Get Code?"}
            text2="Register"
          />
        </form>
      </AuthLayout>
    </>
  );
};

export default VerifyCode;
