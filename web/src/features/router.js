import {
  useSearchParams as useRouterSearchParams,
  createSearchParams as createRouterSearchParams,
} from "react-router-dom";

export const useSearchParams = () => {
  const [params, push] = useRouterSearchParams();
  return [
    Object.fromEntries(params),
    (p) =>
      push(Object.fromEntries(Object.entries(p)?.filter(([, value]) => value))),
  ];
};

export const createSearchParams = (params) =>
  createRouterSearchParams(
    Object.fromEntries(Object.entries(params)?.filter(([, value]) => value))
  );
