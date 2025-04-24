
import type { RcFile } from "antd/es/upload";
import { toast } from "react-toastify";
export const isJpgOrPng = (file: any) => {
  return (
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "image/png"
  );
};

export const doesObjectExist = (
  name: string,
  list: { name: string }[],
): boolean => {
  return list.some((file: { name: string }) => file.name === name);
};
export const getBase64 = (file: RcFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // @ts-expect-error dont 
    reader.onload = () => resolve(reader?.result);
    reader.onerror = (error) => reject(error);
  });
};

export const beforeUpload = (file: RcFile) => {
  try {
    const isLt30M = file.size / 1024 / 1024 < 50;
    if (!isLt30M) {
      toast.error("Image must smaller than 50MB!");
    }
    return false;
  } catch (e: any) {
    console.log(e.details);
    return false;
  }
};
export const beforeImageUpload = (file: RcFile) => {
  try {
    const isImage = isJpgOrPng(file);
    if (!isImage) {
      toast.error("You can only upload JPG/PNG file!");
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      toast.error("Image must smaller than 10MB!");
    }
    return false;
  } catch (e: any) {
    console.log(e.details);
    return false;
  }
};




