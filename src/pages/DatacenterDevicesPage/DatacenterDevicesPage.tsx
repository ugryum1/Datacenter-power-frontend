import "./DatacenterDevicesPage.css";
import { type FC, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { type DatacenterDevice, getDatacenterDevices } from "../../modules/datacenterDevicesApi";
import { DatacenterTopbar } from "../../components/DatacenterTopbar";
import { PowerFilter } from "../../components/PowerFilter";
import { DatacenterDeviceCard } from "../../components/DatacenterDeviceCard";
import { ROUTES } from "../../Routes";

export const DatacenterDevicesPage: FC = () => {
  const [powerW, setPowerW] = useState(0);
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<DatacenterDevice[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDatacenterDevices().then(setDevices);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    getDatacenterDevices(powerW).then((response) => {
      setDevices(response);
      setLoading(false);
    });
  };

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.DATACENTER_DEVICE_REEL}/${id}`);
  };

  return (
    <>
      <DatacenterTopbar title="Плитка оборудования" />
      <PowerFilter
        powerW={powerW}
        setPowerW={setPowerW}
        loading={loading}
        onSubmit={handleSearch}
      />
      {loading && (
        <div className="datacenter-loader">
          <Spinner animation="border" />
        </div>
      )}
      {!loading &&
        (!devices.length ? (
          <p className="datacenter-empty">Оборудование не найдено</p>
        ) : (
          <div className="equipment-grid">
            {devices.map((device) => (
              <DatacenterDeviceCard
                key={device.id}
                onClick={() => handleCardClick(device.id)}
                {...device}
              />
            ))}
          </div>
        ))}
    </>
  );
};
