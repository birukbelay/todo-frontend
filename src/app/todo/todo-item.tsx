"use client";

import {Avatar, Checkbox, Popconfirm, Tag, Tooltip} from "antd";
import {
  Calendar,
  Download,
  Edit2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { TodoModal } from "./todo-modal";
// import Image from "next/image"
export interface TodoItem {
  _id?: string;
  title: string;
  body?: string;
  completed?: boolean;
  tags?: string[];
  createdAt?: string;
  imgUrl?: string;
  imgId?: string;
  fileUrl?: string;
  fileId?: string;
  status?: string;
}

interface TodoItemProps {
  todo: TodoItem;
  tagColors: Record<string, string>;
  onToggle: (todo: TodoItem) => void;
  onDelete: (id?: string) => void;
}

export function TodoItem({
  todo,
  tagColors,
  onToggle,
  onDelete,
}: TodoItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  //   const [loading, setLoading] = useState(false);

  // Format date
  const formatDate = (dateString?: string) => {
    const date = new Date(dateString as string);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleToggle = async (e:any) => {
    setIsAnimating(true);
    onToggle(todo);
    console.log('checked = ', e.target.checked);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  // Get file extension for icon display
  const getFileExtension = (fileName: string = "") => {
    return fileName.split(".").pop()?.toLowerCase() || "";
  };

  // Get file icon based on extension
  const getFileIcon = (fileName: string = "") => {
    const extension = getFileExtension(fileName);

    // You could expand this with more file type icons
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "zip":
      case "rar":
        return "🗜️";
      default:
        return "📎";
    }
  };

  return (
    <li
      className={`p-4 border-b border-gray-200 last:border-b-0 transition-all duration-300 ${
        isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
      } ${todo.status === "done" ? "bg-gray-50" : ""}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox checked={todo.status === "done"} onChange={handleToggle}>
          {/*{label}*/}
        </Checkbox>
        {/*<button*/}
        {/*  onClick={handleToggle}*/}
        {/*  className="mt-1 flex-shrink-0 focus:outline-none"*/}
        {/*>*/}
        {/*  {todo.status === "done" ? (*/}
        {/*    <CheckCircle className="h-5 w-5 text-green-500" />*/}
        {/*  ) : (*/}
        {/*    <Circle className="h-5 w-5 text-gray-300" />*/}
        {/*  )}*/}
        {/*</button>*/}
        <div className="mb-3 ">
          <Avatar
            src={todo.imgUrl || "/placeholder.png"}
            alt={`Thumbnail for ${todo.title}`}
            // fill={true}
            style={{ objectFit: "cover" }}
            className="hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="flex-grow min-w-0">
          <div
            className={`flex items-center justify-between mb-1 ${
              todo.status === "done" ? "opacity-60" : ""
            }`}
          >
            <h3
              className={`text-lg font-medium ${
                todo.status === "done"
                  ? "line-through text-gray-500"
                  : "text-gray-800"
              }`}
            >
              {todo.title}
            </h3>
          </div>

          <p
            className={`text-sm mb-3 ${
              todo.status === "done"
                ? "line-through text-gray-400"
                : "text-gray-600"
            }`}
          >
            {todo?.body?.length as number > 120
              ? `${todo?.body?.substring(0, 120)}...`
              : todo.body}
          </p>

          {/* File attachment */}
          {/* {todo.fileUrl && ( */}
          {todo.fileUrl&&<div className="mb-3">
            <a
                href={todo.fileUrl}
                download={todo.fileUrl || "attachment"}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 py-2 px-3 rounded-md transition-colors w-fit"
            >
              {/* icon */}
              <span className="text-lg">{getFileIcon(todo?.fileUrl)}</span>
              <span className="truncate max-w-[150px]">
                {todo?.fileUrl || "Download attachment"}
              </span>
              <Download className="h-4 w-4"/>
            </a>
          </div>}
          {/* )} */}

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1 max-w-[200px]">
              {todo.tags?.map((tag) => (
                <Tag key={tag} color={tagColors[tag]} className="text-xs">
                  {tag}
                </Tag>
              ))}
            </div>
            <Tooltip title={formatDate(todo?.createdAt as string)}>
              <div className="text-xs text-gray-500 flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(todo?.createdAt as string)}
              </div>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <Tooltip title="Edit">
            <button
              onClick={() => setEditOpen(true)}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </Tooltip>
          <Popconfirm
            title="Delete this todo?"
            description="Are you sure you want to delete this todo?"
            onConfirm={() => onDelete(todo._id)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </Popconfirm>
        </div>
      </div>
      <TodoModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        isUpdate={true}
        editingData={todo}
      />
    </li>
  );
}
