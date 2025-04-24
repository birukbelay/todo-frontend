
export const getQueryFromUrl = (queries: object) => {
  const defaultQuery = {
    page: 1,
    limit: 10,
    ...queries,
    // tags: ["a", "b", "c"],
  };
  const params = new URLSearchParams(window.location.search);
  const query: Record<string, any> = {};
  params.forEach((value, key) => {
    if (key in query) {
      // Handle repeated keys as arrays
      query[key] = Array.isArray(query[key])
        ? [...query[key], value]
        : [query[key], value];
    } else {
      if (value) query[key] = value.includes(",") ? value.split(",") : value;
    }
  });
  Object.entries(defaultQuery).forEach(([key, value]) => {
    if (key in query) {
    } else {
      if (value) query[key] = value;
    }
  });
  return query;
};
type arrOrStr = string | string[]
export const setUrl = (newQuery: Record<string, arrOrStr>) => {
  const params = new URLSearchParams();
  Object.entries(newQuery).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length >= 1) params.set(key, value.join(",")); // Encode arrays as comma-separated values
    } else {
      if (value) params.set(key, value);
    }
  });
  window.history.replaceState(null, "", `?${params.toString()}`);
};
