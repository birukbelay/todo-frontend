export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

//
export const DisplayErrors = (obj: Record<string, any>) => {
  const data = Object.entries(obj).map(
    ([key, val]) => `${key}: ${val.message}`
  );
  return data.map((item, idx) => (
    <li key={idx} className="text-red">
      {item}
    </li>
  ));
};
