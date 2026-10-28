import "./DatacenterDeviceReelPage.css";
import { type FC, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  type DatacenterDeviceReel,
  getDatacenterDeviceReel,
} from "../../modules/datacenterDevicesApi";
import { DatacenterTopbar } from "../../components/DatacenterTopbar";
import { ROUTES } from "../../Routes";

const defaultDeviceImage = "/default-device.jpg";
const defaultDeviceVideo = "/default-device.webm";

export const DatacenterDeviceReelPage: FC = () => {
  const [device, setDevice] = useState<DatacenterDeviceReel>();
  const [loading, setLoading] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    getDatacenterDeviceReel(id, next).then((response) => {
      setDevice(response);
      setLoading(false);
    });
  }, [id, next]);

  const handleNext = () => {
    if (device) {
      setLoading(true);
      setAboutOpen(false);
      navigate(`${ROUTES.DATACENTER_DEVICE_REEL}/${device.id}?next=true`);
    }
  };

  return (
    <>
      <DatacenterTopbar title="Лента оборудования" />
      {loading && (
        <div className="datacenter-loader">
          <Spinner animation="border" />
        </div>
      )}
      {!loading && !device && <p className="datacenter-empty">Устройство не найдено</p>}
      {!loading && device && (
        <div className="reel-stage">
          <video
            key={device.id}
            src={device.video_url || defaultDeviceVideo}
            poster={defaultDeviceImage}
            autoPlay
            loop
            muted
            playsInline
          />

          <aside className="reel-side">
            <div className="reel-action reel-action--like">
              <span className="reel-action__circle">
                <span className="heart">❤</span>
              </span>
              <span className="reel-action__label">{device.likes_count}</span>
            </div>

            <div className="reel-specs">
              <div className="reel-spec">
                <span className="reel-spec__label">Мощность</span>
                <span className="reel-spec__value">{device.power_consumption_w} Вт</span>
              </div>
              <div className="reel-spec">
                <span className="reel-spec__label">Тепло&shy;выделение</span>
                <span className="reel-spec__value">{device.heat_dissipation_btu} БТЕ/ч</span>
              </div>
            </div>

            <Button className="reel-action reel-action--next" variant="link" onClick={handleNext}>
              <span className="reel-action__circle">
                <span className="arrow">▼</span>
              </span>
              <span className="reel-action__label">Дальше</span>
            </Button>
          </aside>

          <div className="reel-caption">
            <h1>{device.name}</h1>
            <span className={`reel-about__text ${aboutOpen ? "reel-about__text--open" : ""}`}>
              {device.short_description}
            </span>
            <Button
              className="reel-about__toggle"
              variant="link"
              onClick={() => setAboutOpen((open) => !open)}
            >
              {aboutOpen ? "Свернуть" : "Ещё"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
