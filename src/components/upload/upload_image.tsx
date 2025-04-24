import {
  beforeImageUpload,
  beforeUpload,
  doesObjectExist,
  getBase64,
} from "@/components/upload/image_util";
import { Headers, MTD } from "@/lib/constants";
import { useMakeReq } from "@/lib/state/hooks/useMutation";
import { Modal, UploadFile, UploadProps } from "antd";
import Upload, { RcFile } from "antd/es/upload";
import { Plus } from "lucide-react";
import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { toast } from "react-toastify";

import { NotModified, Resp } from "@/lib/constants/return.const";
import { IUpload } from "@/types/upload";
import { useAtom } from "jotai";
import { atom } from "jotai/index";
import { RotateCcw } from "lucide-react";
export const fileAtom = atom<UploadFile[]>([]);
fileAtom.debugLabel = "files";

export const UploadButton = ({
  txt,
  isLoading,
}: {
  txt: string;
  isLoading: boolean;
}) => (
  <div>
    <button
      className="h-9 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90"
      type="button"
      disabled={isLoading}
    >
      <Plus size={15} strokeWidth={1.75} />
      {isLoading ? "...Loading" : txt}{" "}
    </button>
  </div>
);
export const MultiFileUpload = forwardRef(function UploadComp(
  {
    isLoading,
    isUpdate,
    maxFileNo,
    imgOnly,
    oldData,

    apiUrl = "file/image",
  }: {
    isLoading: boolean;
    imgOnly: boolean;
    oldData: any;
    isUpdate: boolean;
    maxFileNo: number;
    fileId?: string;
    apiUrl: string;
  },
  ref
) {
  const [loading, setLoading] = useState(isLoading);
  /**
   * ==========================     Images List  ======
   * =============================================================
   */
  const [imgList, setImgList] = useAtom(fileAtom);
  //remove image from the existing images
  const onOldRemove = (file: UploadFile) => {
    if (
      file?.url &&
      file.name &&
      !doesObjectExist(file?.name as string, removedImages)
    ) {
      // add it ot the removed images list
      setRemovedImages([...removedImages, file]);
      //remove it from the old images list
      const filteredList = imgList.filter(
        (oldImg) => oldImg.name !== file.name
      );
      setImgList(filteredList);
    }
    console.log("rmvd--", removedImages);
  };

  const onNewFileChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];

    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setImgList(newFileList);
    // setAddedFileList(newFileList);
  };

  /**
   * ==========================     Removed Images   ======
   * =============================================================
   */

  const [removedImages, setRemovedImages] = useState<UploadFile[]>([]);

  // re-add removed image
  const onReAdd = (file: UploadFile) => {
    if (imgList.length >= maxFileNo) {
      toast.warning(
        "Max files has Reached, remove added image to restore this"
      );
      return;
    }
    if (
      file?.url &&
      file.name &&
      !doesObjectExist(file?.name as string, imgList)
    ) {
      // add it ot the Main Images List
      setImgList([...imgList, file]);
      //remove it from the removed Images List
      const filteredList = removedImages.filter(
        (oldImg) => oldImg.name !== file.name
      );
      setRemovedImages(filteredList);
    }
    console.log("rmvd--", removedImages);
  };

  useEffect(() => {
    if (isUpdate && oldData) {
      if (oldData && oldData.length > 0) {
        const list: UploadFile[] = [];
        // console.log("oldData", oldData);
        oldData?.forEach((img: IUpload) => {
          const sImage: UploadFile = {
            "aria-label": undefined,
            "aria-labelledby": undefined,
            name: img?.url,
            response: undefined,
            //FIXME this might change on unusedElements projects with no ID
            uid: img?._id,
            xhr: undefined,
            url: img?.url,
          };
          list.push(sImage);
        });
        setImgList(list);
        // console.log("the old data i---}", list);
        setRemovedImages([]);
      }
    }
  }, [isUpdate, oldData]);

  /**=======================================================================================================V===============================================
   * ==---------------->    Http Functions
   * ==============================================================================================================================================
   */
  // const mutation = useMutate();
  const makeReq = useMakeReq();

  // for making post requests
  const uploadImages = async (id: string): Promise<Resp<any>> => {
    console.log("called upload", id);
    const formData = new FormData();
    //this handles if the Image array is empty
    if (!imgList.length) return NotModified({});

    imgList.forEach((file) => {
      if (!("url" in file)) {
        formData.append("file", file.originFileObj as Blob);
      }
    });
    //this don't matter for single images
    removedImages.forEach((img) => {
      formData.append("removedImages", img.name);
    });

    //TODO if the image is not updated, dont call the image upload function
    if (formData.entries().next().done) {
      console.log("the image data is not updated");
      if (isUpdate) return NotModified(imgList[0]);
    }
    setLoading(true);
    let resp;
    if (isUpdate) {
      resp = makeReq(`${apiUrl}/${id}`, formData, MTD.PATCH, Headers.MULTI);
    } else {
      resp = makeReq(`${apiUrl}`, formData, MTD.POST, Headers.MULTI);
    }
    setLoading(false);
    return resp;
  };
  //========================================================================================================================================================================
  //========================================================================================================================================================================
  const resetData = () => {
    setImgList([]);
    setRemovedImages([]);
    setLoading(false);
  };
  useImperativeHandle(ref, () => ({
    uploadSingle: uploadImages,
    resetData,
  }));

  /**==================================================================
   * ==---------------->    states related to PREVIEW
   * ==========================================================
   */
  const [previewOpen, setPreviewOpen] = useState(false);
  const handleCancel = () => setPreviewOpen(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = async (file: UploadFile) => {
    console.log("--preview", file.url);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };
  // !----------  END OF STATES RELATED TO PREVIEW   ---------!
  //=============================================================
  //=============================================================

  return (
    <div className={"my-8"}>
      {/*   ================ ||    DISPLAY IMAGES ====================*/}
      <Upload
        beforeUpload={imgOnly ? beforeImageUpload : beforeUpload}
        listType={imgOnly ? "picture-card" : "picture-circle"}
        fileList={imgList}
        onPreview={handlePreview}
        maxCount={maxFileNo}
        onChange={onNewFileChange}
        onRemove={onOldRemove}
      >
        {/*{addedFileList.length + oldImgList.length < maxFileNo  && (*/}
        {imgList.length < maxFileNo && (
          <UploadButton isLoading={loading} txt="Add " />
        )}
      </Upload>

      {/* =======================  this is to display Removed images images*/}
      {removedImages.length > 0 && (
        <div className={"mt-6 border-t-4 text-red"}>
          Warning : These Uploaded files below are about to be deleted
        </div>
      )}
      <Upload
        beforeUpload={beforeUpload}
        listType={"picture"}
        fileList={removedImages}
        onPreview={handlePreview}
        onRemove={onReAdd}
        {...props}
      ></Upload>
      {/*====================================   Modal ============================*/}

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <Image
          alt={previewTitle}
          width={500}
          height={700}
          style={{ width: "100%" }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
});
const props: UploadProps = {
  showUploadList: {
    showRemoveIcon: true,
    removeIcon: (
      <RotateCcw size={20} strokeWidth={1.75}>
        restore
      </RotateCcw>
    ),
  },
};
