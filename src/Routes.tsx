export const ROUTES = {
  DATACENTER_DEVICE_REEL: "/datacenter-devices/reel",
  DATACENTER_DEVICE_DRAFT: "/datacenter-devices/draft",
  DATACENTER_DEVICES: "/datacenter-devices",
  DATACENTER_ENGINEER_SIGN_IN: "/datacenter-engineers/sign-in",
};
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  DATACENTER_DEVICE_REEL: "Лента",
  DATACENTER_DEVICE_DRAFT: "Добавление",
  DATACENTER_DEVICES: "Плитка",
  DATACENTER_ENGINEER_SIGN_IN: "Вход",
};
