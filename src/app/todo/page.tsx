"use client";

import { TodoItem } from "@/app/todo/todo-item";
import { MockTags, TagColors, TodoModal } from "@/app/todo/todo-modal";
import { SearchInput } from "@/components/form-input";
import { TodoFilter } from "@/components/todo-filter";
import { TodoHeader } from "@/components/todo-header";
import { MTD } from "@/lib/constants";
import { useMakeReq } from "@/lib/state/hooks/useMutation";
import { useFetch } from "@/lib/state/hooks/useQuery";
import { useQueryClient } from "@tanstack/react-query";
import { Pagination, message } from "antd";
import { CheckCircle, Circle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {useAuth} from "@/lib/state/context/jotai-auth";
import { useRouter } from 'next/navigation';
function NoTodo() {
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-sm">
      <div className="text-gray-400 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">No todos found</h3>
      <p className="text-gray-500">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );
}

export default function TodosPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDonePage, setCurrentDonePage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const {loggedIn}= useAuth()
  const router = useRouter();
  useEffect(() => {
    if (!loggedIn) {
      router.push('/login'); // Redirect to the login page
    }
  }, [loggedIn, router]);

  const makeReq = useMakeReq();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const handleErr = (message: string) => {
    messageApi.error(`${message}: `);
  };
  const handleToggle = async (todo: TodoItem) => {
    const resp = await makeReq(
      `todo/${todo._id}`,
      { status: todo.status == "done" ? "todo" : "done" },
      MTD.PATCH
    );
    if (!resp.ok) return handleErr(resp.message);
    queryClient.invalidateQueries({ queryKey: ["todo"] });
  };
  // Handle deleting a todo
  const deleteTodo = async (id?: string) => {
    const resp = await makeReq(`todo/${id}`, {}, MTD.DELETE);
    if (!resp.ok) {
      messageApi.error(`${resp.message}: `);
    } else {
      messageApi.success(`${resp.message}: `);
    }
    queryClient.invalidateQueries({ queryKey: ["todo"] });
  };

  //  ======================      Unused State======
  //  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const setActiveFilters = (tags: string[]) => {
    setQuery({ ...query, tags });
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filtering
    setCurrentDonePage(1); // Reset to first page when filtering
  }, []);

  //==============  State That Will Remain =========

  const [query, setQuery] = useState<Record<string, any>>({limit: 5});
  const setPage = (page: number) => {
    setCurrentPage(page);
  };
  const setDonePage = (page: number) => {
    setCurrentDonePage(page);
  };
  const { isLoading: todoLoading, data: todoLists } = useFetch(
    ["todo", JSON.stringify(query), "todo", `${currentPage}`],
    `todo`,
    { ...query, status: "todo", page: currentPage }
  );
  const todoItems = todoLists?.body || [];
  const { isLoading: doneLoading, data: doneTodoList } = useFetch(
    ["todo", JSON.stringify(query), "done", `${currentDonePage}`],
    `todo`,
    { ...query, status: "done", page: currentDonePage }
  );
  const doneItems = doneTodoList?.body || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {contextHolder}
      {/* Header Component */}
      <TodoHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Controls and filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-64">
              <SearchInput
                placeholder="Search todos..."
                value={query?.q}
                onChange={(e) => setQuery({ ...query, q: e.target.value })}
              />
            </div>

            {/* Filter Component */}
            <TodoFilter
              availableTags={MockTags}
              activeFilters={query?.tags || []}
              tagColors={TagColors}
              onFilterChange={setActiveFilters}
            />
          </div>

          <button
            onClick={() => setModalVisible(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Todo</span>
          </button>
        </div>

        {/* =========================Todo list - Two column layout */}
        {/* =========================  ==================================================*/}
        {todoItems.length === 0 && doneItems.lenght === 0 ? (
          <NoTodo />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ====================    Todo Items Column  ============ */}
            {/* =====================    =================================*/}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <Circle className="mr-2 h-5 w-5 text-gray-400" />
                To Do
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {todoItems.length}
                </span>
              </h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {todoLoading ? (
                  <div className="p-6 text-center text-gray-500">Loading</div>
                ) : todoItems.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No pending tasks
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {todoItems.map((todo: TodoItem) => (
                      <TodoItem
                        key={todo._id}
                        todo={todo}
                        tagColors={TagColors}
                        onToggle={handleToggle}
                        onDelete={deleteTodo}
                      />
                    ))}
                  </ul>
                )}
              </div>
              {/* Unfinished TODO LISTS*/}
              {todoLists?.count > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                        current={currentPage}
                        onChange={setPage}
                        total={todoLists?.count||0}
                        pageSize={5}
                        showSizeChanger={false}
                    />
                  </div>
              )}
            </div>

            {/* =====================    Completed Items Column */}
            {/* =====================    =================================*/}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Completed
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({doneTodoList?.count})
                </span>
              </h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {doneLoading ? (
                  <div className="p-6 text-center text-gray-500">Loading</div>
                ) : doneItems.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No completed tasks
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {doneItems.map((todo: TodoItem) => (
                      <TodoItem
                        key={todo._id}
                        todo={todo}
                        tagColors={TagColors}
                        onToggle={handleToggle}
                        onDelete={deleteTodo}
                      />
                    ))}
                  </ul>
                )}
              </div>
              {/* Pagination For Done */}
              {doneTodoList?.count > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                        current={currentDonePage}
                        onChange={setDonePage}
                        total={doneTodoList?.count ||0}
                        pageSize={5}
                        showSizeChanger={false}
                    />
                  </div>
              )}
            </div>
          </div>
        )}


      </div>

      {/* Todo Modal Component */}
      <TodoModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        isUpdate={false}
        editingData={null}
      />
    </div>
  );
}
