import { HandleAxiosErr } from "@/lib/functions/axios.error";
import useAxiosAuth from "@/lib/state/hooks/useAxioxsAuth";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
const buildQuery = (params: Record<string, any>) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryParams.append(key, val));
    } else {
      queryParams.append(key, value);
    }
  });

  return queryParams.toString();
};

export const useFetch = (
  queryKey: string[],
  url: string,
  params = {},
  refetchInterval: number = 100000
) => {
  const axiosAuth = useAxiosAuth();
  const defaultParams = {
    limit: 10,
    ord: "updated_at",
    dir: "desc",
    ...params,
  };
  // console.log(url, "=====", params, defaultParams);
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const queryString = buildQuery(defaultParams);
        console.log(url, defaultParams, queryString);
        const response = await axiosAuth.get(`${url}?${queryString}`);
        // console.log("||useQuery.get", response.data);
        return response.data;
      } catch (e: any) {
        const Err = HandleAxiosErr(e);
        throw new Error(Err.Message);
        // return [];
      }
    },
    refetchInterval,
    placeholderData: keepPreviousData,
  });
};
