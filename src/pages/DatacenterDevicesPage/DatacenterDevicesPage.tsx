import "./DatacenterDevicesPage.css";
import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDatacenterDevices, setPowerW, deleteDatacenterDevice,
} from "../../slices/datacenterDevicesSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { DatacenterTopbar } from "../../components/DatacenterTopbar";
import { PowerFilter } from "../../components/PowerFilter";
import { DatacenterDeviceCard } from "../../components/DatacenterDeviceCard";
import { ROUTES } from "../../Routes";

export const DatacenterDevicesPage: FC = () => {
  const { powerW, loading, devices, error } = useAppSelector((state) => state.datacenterDevices);
  const isAuthenticated = useAppSelector((state) => state.datacenterEngineer.isAuthenticated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDatacenterDevices());
  }, [dispatch, isAuthenticated]);

  const handleSearch = () => {
    dispatch(getDatacenterDevices());
  };

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.DATACENTER_DEVICE_REEL}/${id}`);
  };

  return (
    <>
      <DatacenterTopbar title="Плитка оборудования" />
      <PowerFilter
        powerW={powerW}
        setPowerW={(value) => dispatch(setPowerW(value))}
        loading={loading}
        onSubmit={handleSearch}
      />
      {!loading && !error &&
        (!devices.length ? (
          <p className="datacenter-empty">Оборудование не найдено</p>
        ) : (
          <div className="equipment-grid">
            {devices.map((device) => (
              <DatacenterDeviceCard
                key={device.id}
                onClick={() => handleCardClick(device.id)}
                onDelete={isAuthenticated && device.is_creator === 1
                  ? () => dispatch(deleteDatacenterDevice(device.id))
                  : undefined}
                {...device}
              />
            ))}
          </div>
        ))}
    </>
  );
};
