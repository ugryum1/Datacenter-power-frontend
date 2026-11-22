import "./DatacenterDeviceReelPage.css";
import { type FC, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getDatacenterDeviceReel, likeDatacenterDevice } from "../../slices/datacenterDevicesSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { datacenterMediaURL } from "../../api";
import { DatacenterTopbar } from "../../components/DatacenterTopbar";
import { ROUTES } from "../../Routes";

const defaultDeviceImage = "/default-device.jpg";
const defaultDeviceVideo = "/default-device.webm";

export const DatacenterDeviceReelPage: FC = () => {
  const { reel: device, loading, error } = useAppSelector((state) => state.datacenterDevices);
  const isAuthenticated = useAppSelector((state) => state.datacenterEngineer.isAuthenticated);
  const dispatch = useAppDispatch();
  const [aboutOpen, setAboutOpen] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDatacenterDeviceReel({ id, next }));
  }, [dispatch, id, next, isAuthenticated]);

  const handleNext = () => {
    if (device) {
      setAboutOpen(false);
      navigate(`${ROUTES.DATACENTER_DEVICE_REEL}/${device.id}?next=true`);
    }
  };

  return (
    <>
      <DatacenterTopbar title="Лента оборудования" />
      {!loading && !device && !error && <p className="datacenter-empty">Оборудование не найдено</p>}
      {!loading && device && (
        <div className="reel-stage">
          <video
            key={device.id}
            src={datacenterMediaURL(device.video_url) || defaultDeviceVideo}
            poster={defaultDeviceImage}
            autoPlay
            loop
            muted
            playsInline
          />

          <aside className="reel-side">
            <Button
              className={`reel-action reel-action--like ${device.is_liked ? "is-liked" : ""}`}
              variant="link"
              disabled={!isAuthenticated}
              aria-label={device.is_liked ? "Убрать лайк" : "Поставить лайк"}
              onClick={() => dispatch(likeDatacenterDevice({
                id: device.id, like: device.is_liked ? 0 : 1,
              }))}
            >
              <span className="reel-action__circle">
                <span className="heart">❤</span>
              </span>
              <span className="reel-action__label">{device.likes_count}</span>
            </Button>

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
