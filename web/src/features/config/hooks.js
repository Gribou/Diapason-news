import api from "api";

export const { useConfigQuery } = api;

export const useLogo = () => {
  const { data } = useConfigQuery();
  return data?.logo;
};

export const useMenuItems = () => {
  const { data } = useConfigQuery();
  return data?.menu || [];
};

export function useSafety() {
  const { data } = useConfigQuery();
  return data?.safety || {};
}

export function useVersion() {
  const { data } = useConfigQuery();
  return data?.version;
}

export function useReferences() {
  const { data, isLoading } = useConfigQuery();
  return { data: data?.references, isLoading };
}

export function useConfig() {
  const { data } = useConfigQuery();
  return data || {};
}
