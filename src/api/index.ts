import { DatacenterPowerApi } from "./DatacenterPowerApi.ts";

export const DATACENTER_TOKEN_KEY = "datacenter-engineer-jwt";

export const datacenterPowerApi = new DatacenterPowerApi({
  baseURL: "/api",
});

export const datacenterEngineerAuthorization = (isAuthenticated: 0 | 1) => {
  const token = isAuthenticated
    ? localStorage.getItem(DATACENTER_TOKEN_KEY)
    : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const datacenterMediaURL = (url: string | null | undefined) => {
  if (!url) return undefined;
  const path = new URL(url, "http://localhost").pathname;
  return path.startsWith("/datacenter-media/") ? path : url;
};
