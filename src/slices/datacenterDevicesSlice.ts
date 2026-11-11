import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { datacenterPowerApi, datacenterEngineerAuthorization } from "../api/index.ts";
import type { DsDatacenterDevicePublishRequest } from "../api/DatacenterPowerApi.ts";
import type { DatacenterDevice, DatacenterDeviceReel } from "../modules/datacenterDevicesApi.ts";
import { DATACENTER_DEVICES_MOCK } from "../modules/mock.ts";
import type { RootState } from "../store.ts";
import { signInDatacenterEngineer, signOutDatacenterEngineer } from "./datacenterEngineerSlice.ts";

interface DatacenterDevicesState {
  powerW: number;
  devices: DatacenterDevice[];
  reel: DatacenterDeviceReel | null;
  draft: DatacenterDevice | null;
  loading: boolean;
  error: string | null;
}

const initialState: DatacenterDevicesState = {
  powerW: 0,
  devices: [],
  reel: null,
  draft: null,
  loading: false,
  error: null,
};

const datacenterThunk = createAsyncThunk.withTypes<{
  state: RootState;
  rejectValue: string;
}>();

const canUseDatacenterMock = (error: unknown, isAuthenticated: 0 | 1) =>
  !isAuthenticated && axios.isAxiosError(error) &&
  (!error.response || error.response.status >= 500);

export const getDatacenterDevices = datacenterThunk(
  "datacenterDevices/getDatacenterDevices",
  async (_: void, { getState, rejectWithValue }) => {
    const { datacenterDevices, datacenterEngineer } = getState();
    const powerW = datacenterDevices.powerW;
    try {
      const response = await datacenterPowerApi.datacenterDevices.datacenterDevicesList(
        { power: powerW },
        { headers: datacenterEngineerAuthorization(datacenterEngineer.isAuthenticated) },
      );
      return response.data as DatacenterDevice[];
    } catch (error) {
      if (canUseDatacenterMock(error, datacenterEngineer.isAuthenticated)) {
        return DATACENTER_DEVICES_MOCK.filter(
          (device) => (device.power_consumption_w ?? 0) >= powerW,
        );
      }
      return rejectWithValue("Не удалось загрузить оборудование");
    }
  },
);

export const getDatacenterDeviceReel = datacenterThunk(
  "datacenterDevices/getDatacenterDeviceReel",
  async ({ id, next = false }: { id?: string; next?: boolean }, { getState, rejectWithValue }) => {
    const { isAuthenticated } = getState().datacenterEngineer;
    const params = { headers: datacenterEngineerAuthorization(isAuthenticated) };
    try {
      const response = id
        ? await datacenterPowerApi.datacenterDevices.datacenterReelDetail(
          Number(id), { next: String(next) }, params,
        )
        : await datacenterPowerApi.datacenterDevices.datacenterReelList(params);
      return response.data as DatacenterDeviceReel;
    } catch (error) {
      if (canUseDatacenterMock(error, isAuthenticated)) {
        const index = id
          ? DATACENTER_DEVICES_MOCK.findIndex((device) => String(device.id) === id)
          : 0;
        if (index >= 0) {
          return DATACENTER_DEVICES_MOCK[
            next ? (index + 1) % DATACENTER_DEVICES_MOCK.length : index
          ];
        }
      }
      return rejectWithValue("Не удалось загрузить устройство");
    }
  },
);

export const getDatacenterDeviceDraft = datacenterThunk(
  "datacenterDevices/getDatacenterDeviceDraft",
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const response = await datacenterPowerApi.datacenterDevices.datacenterDraftList({
        headers: datacenterEngineerAuthorization(getState().datacenterEngineer.isAuthenticated),
      });
      return response.data as DatacenterDevice;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      return rejectWithValue("Не удалось загрузить черновик оборудования");
    }
  },
);

export const publishDatacenterDevice = datacenterThunk(
  "datacenterDevices/publishDatacenterDevice",
  async (data: {
    fields: DsDatacenterDevicePublishRequest;
    image: File | null;
    video: File | null;
  }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const params = {
      headers: datacenterEngineerAuthorization(state.datacenterEngineer.isAuthenticated),
    };
    try {
      let draft = state.datacenterDevices.draft;
      if (!draft) {
        if (!data.image || !data.video) return rejectWithValue("Выберите фото и видео оборудования");
        const response = await datacenterPowerApi.datacenterDevices.datacenterDevicesCreate({
          name: data.fields.name, image: data.image, video: data.video,
        }, params);
        draft = response.data as DatacenterDevice;
        dispatch(setDatacenterDeviceDraft(draft));
      }
      const response = await datacenterPowerApi.datacenterDevices.datacenterPublishUpdate(
        draft.id, data.fields, params,
      );
      return response.data as DatacenterDevice;
    } catch {
      return rejectWithValue("Не удалось опубликовать оборудование");
    }
  },
);

export const deleteDatacenterDevice = datacenterThunk(
  "datacenterDevices/deleteDatacenterDevice",
  async (id: number, { getState, rejectWithValue }) => {
    try {
      await datacenterPowerApi.datacenterDevices.datacenterDevicesDelete(id, {
        headers: datacenterEngineerAuthorization(getState().datacenterEngineer.isAuthenticated),
      });
      return id;
    } catch {
      return rejectWithValue("Не удалось удалить оборудование");
    }
  },
);

export const likeDatacenterDevice = datacenterThunk(
  "datacenterDevices/likeDatacenterDevice",
  async ({ id, like }: { id: number; like: 0 | 1 }, { getState, rejectWithValue }) => {
    try {
      const response = await datacenterPowerApi.datacenterDevices.datacenterLikeCreate(
        id, { like }, {
          headers: datacenterEngineerAuthorization(getState().datacenterEngineer.isAuthenticated),
        },
      );
      return { device: response.data as DatacenterDevice, like };
    } catch {
      return rejectWithValue("Не удалось изменить лайк");
    }
  },
);

const datacenterDevicesSlice = createSlice({
  name: "datacenterDevices",
  initialState,
  reducers: {
    setPowerW(state, action: PayloadAction<number>) {
      state.powerW = action.payload;
    },
    setDatacenterDeviceDraft(state, action: PayloadAction<DatacenterDevice>) {
      state.draft = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signOutDatacenterEngineer, () => initialState)
      .addCase(signInDatacenterEngineer, (state) => {
        state.loading = false;
        state.devices = [];
        state.reel = null;
        state.draft = null;
        state.error = null;
      })
      .addCase(getDatacenterDevices.pending, (state) => { state.devices = []; })
      .addCase(getDatacenterDeviceReel.pending, (state) => { state.reel = null; })
      .addCase(getDatacenterDevices.fulfilled, (state, action) => {
        state.devices = action.payload;
      })
      .addCase(getDatacenterDeviceReel.fulfilled, (state, action) => {
        state.reel = action.payload;
      })
      .addCase(getDatacenterDeviceDraft.fulfilled, (state, action) => {
        state.draft = action.payload;
      })
      .addCase(publishDatacenterDevice.fulfilled, (state) => {
        state.draft = null;
      })
      .addCase(deleteDatacenterDevice.fulfilled, (state, action) => {
        state.devices = state.devices.filter((device) => device.id !== action.payload);
      })
      .addCase(likeDatacenterDevice.fulfilled, (state, action) => {
        const { device, like } = action.payload;
        if (state.reel?.id === device.id) {
          state.reel = { ...state.reel, likes_count: device.likes_count, is_liked: like };
        }
      });
    for (const thunk of [
      getDatacenterDevices, getDatacenterDeviceReel, getDatacenterDeviceDraft,
      publishDatacenterDevice, deleteDatacenterDevice, likeDatacenterDevice,
    ]) {
      builder
        .addMatcher(thunk.pending.match, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addMatcher(thunk.fulfilled.match, (state) => {
          state.loading = false;
        })
        .addMatcher(thunk.rejected.match, (state, action) => {
          state.loading = false;
          state.error = action.payload ?? "Ошибка запроса оборудования";
        });
    }
  },
});

export const { setPowerW, setDatacenterDeviceDraft } = datacenterDevicesSlice.actions;
export default datacenterDevicesSlice.reducer;
