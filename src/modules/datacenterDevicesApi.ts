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
