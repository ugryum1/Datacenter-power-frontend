import { DATACENTER_DEVICES_MOCK } from "./mock";

export interface DatacenterDevice {
  id: number;
  name: string;
  short_description: string | null;
  image_url: string | null;
  video_url: string | null;
  power_consumption_w: number | null;
  heat_dissipation_btu: number | null;
  likes_count: number;
  is_creator: number;
}

export interface DatacenterDeviceReel extends DatacenterDevice {
  is_liked: number;
}

export const getDatacenterDevices = async (
  powerW = 0
): Promise<DatacenterDevice[]> => {
  return DATACENTER_DEVICES_MOCK.filter(
    (device) => powerW <= 0 || (device.power_consumption_w ?? 0) >= powerW
  ).map(({ is_liked: _isLiked, ...device }) => device);
};

export const getDatacenterDeviceReel = async (
  id?: string,
  next = false
): Promise<DatacenterDeviceReel | undefined> => {
  if (!id) {
    return DATACENTER_DEVICES_MOCK[0];
  }
  const index = DATACENTER_DEVICES_MOCK.findIndex(
    (device) => String(device.id) === id
  );
  if (index === -1) {
    return undefined;
  }
  if (!next) {
    return DATACENTER_DEVICES_MOCK[index];
  }
  return DATACENTER_DEVICES_MOCK[(index + 1) % DATACENTER_DEVICES_MOCK.length];
};
