"use client";

import { MultiFileUpload as FileUpload } from "@/components/upload/upload_file";
import { MultiFileUpload } from "@/components/upload/upload_image";
import { MTD } from "@/lib/constants";
import { Resp, ReturnType } from "@/lib/constants/return.const";
import { useMakeReq } from "@/lib/state/hooks/useMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { message, Modal, Tag } from "antd";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputField, TextAreaField } from "../../components/form-input";
import { TodoItem } from "./todo-item";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingData: any | null;
  isUpdate: boolean;
}
export const TodoValidator = z.object({
  title: z.string().min(2, { message: "min length is 2" }),
  body: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export type TodoDto = z.infer<typeof TodoValidator>;

export function TodoModal({
  isOpen,
  onClose,
  isUpdate,
  editingData,
}: TodoModalProps) {
  const uploadRef = useRef(undefined);
  const uploadRef2 = useRef(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    // control,
    reset,
  } = useForm<TodoDto>({
    resolver: zodResolver(TodoValidator),
    defaultValues: isUpdate ? { ...editingData } : {},
  });
  const makeReq = useMakeReq();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [modifiedData, setModifiedData] = useState<Partial<TodoItem>>({
    tags: [],
  });
  // Function to handle field changes
  const handleChange = (fieldName: keyof TodoItem, value: string) => {
    setModifiedData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  //=============== latest data

  // Reset form when modal opens with a todo to edit

  const toggleTag = (tag: string) => {
    if (modifiedData.tags?.includes(tag)) {
      setModifiedData({
        ...modifiedData,
        tags: modifiedData.tags?.filter((t) => t !== tag),
      });
    } else {
      setModifiedData({
        ...modifiedData,
        tags: [...(modifiedData?.tags || []), tag],
      });
    }
  };
  const handleErr = (message: string) => {
    messageApi.error(`${message}: `);
    setLoading(false);
  };
  const onSubmit = async (data: TodoItem) => {
    setLoading(true);
    const updateObj: any = {};
    let resp: Resp<any>;
    //==================================  FILE REF   ====================================================================================
    //==================================  --------- -=======
    if (uploadRef.current) {
      //@ts-expect-error it could not recognize the ref
      const uploadDto: Resp<any> = await uploadRef.current.uploadSingle(
        editingData?.imgId
      );
      if (!uploadDto.ok) return handleErr(`upload Error: ${uploadDto.message}`);
      // console.log("the uploadDto====", uploadDto);
      if (uploadDto.respCode != ReturnType.NotModified) {
        setModifiedData((prevState) => ({
          ...prevState,
          imgId: uploadDto.body._id,
          imgUrl: uploadDto.body.url,
        }));
        data.imgUrl = uploadDto.body.url;
        updateObj.imgUrl = uploadDto.body.url;
        data.imgId = uploadDto.body._id;
        updateObj.imgId = uploadDto.body._id;
        console.log(">>>>>>>>>>>>>>>>>>>>>>updating", data.imgUrl, data);
      }
    }
    if (uploadRef2.current) {
      //@ts-expect-error it could not recognize the ref
      const uploadDto: Resp<any> = await uploadRef2.current.uploadSingle(
        editingData?.imgFileId
      );
      if (!uploadDto.ok) return handleErr(`upload Error: ${uploadDto.message}`);
      // console.log("the uploadDto====", uploadDto);
      if (uploadDto.respCode != ReturnType.NotModified) {
        setModifiedData((prevState) => ({
          ...prevState,
          fileId: uploadDto.body._id,
          fileUrl: uploadDto.body.url,
        }));
        data.fileUrl = uploadDto.body.url;
        updateObj.fileUrl = uploadDto.body.url;
        data.fileId = uploadDto.body._id;
        updateObj.fileId = uploadDto.body._id;
        console.log(">>>>>>>>>>>>>>>>>>>>>>updatingFill", data.imgUrl, data);
      }
    }
    //==================================  End FILE REF
    //==================================  --------- -===========================================================================================
    if (isUpdate) {
      if (!editingData || !("_id" in editingData))
        return handleErr("malformed update");
      console.log(">>>>>>>>>>>>>>>>>>>>>>updating22", data.imgUrl, data);
      resp = await makeReq(
        `todo/${editingData._id}`,
        { ...modifiedData, ...updateObj },
        MTD.PATCH
      );
      if (!resp.ok) return handleErr(resp.message);
    } else {
      data.tags = modifiedData?.tags as string[];
      resp = await makeReq(`todo`, data, MTD.POST);
      if (!resp.ok) return handleErr(resp.message);
    }
    await queryClient.invalidateQueries({ queryKey: ["todo"] });
    reset();
    if (uploadRef.current) {
      //@ts-expect-error it could not recognize the ref
      uploadRef.current.reset();
    }
    messageApi.success(
      `successfully ${isUpdate ? "updated" : "created"} todo  `
    );
    setLoading(false);
  };

  return (
    <Modal
      title={editingData ? "Edit Todo" : "Create New Todo"}
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      okText={editingData ? "Update" : "Create"}
    >
      {contextHolder}
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          register={register}
          errors={errors}
          handleChange={handleChange}
          label={"Title"}
          name={"title"}
          req={true}
          placeholder={"Add the Title"}
        />

        <TextAreaField
          label={"body"}
          name={"body"}
          errors={errors}
          register={register}
          req={false}
          handleChange={handleChange}
          placeholder={"Add the todo body"}
        />
        <div>Thumbnail</div>
        <MultiFileUpload
          oldData={[{ _id: editingData?.imgId, url: editingData?.imgUrl }]}
          imgOnly={false}
          maxFileNo={1}
          ref={uploadRef}
          isUpdate={isUpdate}
          isLoading={loading}
          apiUrl="file/image"
          fileId={editingData?.imgId}
        />
        <div>File Attacment</div>
        <FileUpload
          oldData={[{ _id: editingData?.fileId, url: editingData?.fileUrl }]}
          imgOnly={false}
          maxFileNo={1}
          ref={uploadRef2}
          isUpdate={isUpdate}
          isLoading={loading}
          apiUrl="file"
          fileId={editingData?.fileId}
        />
      </form>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mt-1">
          {MockTags.map((tag) => (
            <Tag
              key={tag}
              color={
                modifiedData?.tags?.includes(tag) ? TagColors[tag] : undefined
              }
              onClick={() => toggleTag(tag)}
              className="cursor-pointer text-sm"
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </Modal>
  );
} // Tag color map

export const TagColors: Record<string, string> = {
  Work: "blue",
  Personal: "green",
  Urgent: "red",
  Ideas: "purple",
  Later: "orange",
};
export const MockTags = ["Work", "Personal", "Urgent", "Ideas", "Later"];
