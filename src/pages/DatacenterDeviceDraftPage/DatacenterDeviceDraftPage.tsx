import "./DatacenterDeviceDraftPage.css";
import { useEffect, useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { DatacenterTopbar } from "../../components/DatacenterTopbar";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { datacenterMediaURL } from "../../api";
import { createDatacenterDeviceDraft, getDatacenterDeviceDraft, publishDatacenterDevice } from "../../slices/datacenterDevicesSlice";
import { ROUTES } from "../../Routes";

function useSelectedMedia() {
  const [media, setMedia] = useState<{ file: File; url: string } | null>(null);
  useEffect(() => () => {
    if (media) URL.revokeObjectURL(media.url);
  }, [media]);
  const select = (file?: File) => setMedia(file ? { file, url: URL.createObjectURL(file) } : null);
  return { media, select };
}

export const DatacenterDeviceDraftPage = () => {
  const isAuthenticated = useAppSelector((state) => state.datacenterEngineer.isAuthenticated);
  const draft = useAppSelector((state) => state.datacenterDevices.draft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [powerW, setPowerW] = useState<string | null>(null);
  const [heatBTU, setHeatBTU] = useState<string | null>(null);
  const image = useSelectedMedia();
  const video = useSelectedMedia();

  useEffect(() => {
    if (isAuthenticated) dispatch(getDatacenterDeviceDraft());
  }, [dispatch, isAuthenticated]);

  const imageURL = draft ? datacenterMediaURL(draft.image_url) : image.media?.url;
  const videoURL = draft ? datacenterMediaURL(draft.video_url) : video.media?.url;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) {
      if (name && image.media && video.media) {
        await dispatch(createDatacenterDeviceDraft({ name, image: image.media.file, video: video.media.file }));
      }
      return;
    }
    const result = await dispatch(publishDatacenterDevice({
      id: draft.id,
      fields: {
        name: draft.name,
        short_description: description ?? draft.short_description ?? "",
        power_consumption_w: Number(powerW ?? draft.power_consumption_w),
        heat_dissipation_btu: Number(heatBTU ?? draft.heat_dissipation_btu),
      },
    }));
    if (publishDatacenterDevice.fulfilled.match(result)) {
      navigate(`${ROUTES.DATACENTER_DEVICE_REEL}/${result.payload.id}`);
    }
  };

  if (!isAuthenticated) return <Navigate to={ROUTES.DATACENTER_ENGINEER_SIGN_IN} replace />;

  return (
    <>
      <DatacenterTopbar title="Добавление оборудования" />
      <Form className="datacenter-form datacenter-draft-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="datacenter-device-name">
          <Form.Label>Название</Form.Label>
          <Form.Control required readOnly={!!draft} value={draft?.name ?? name ?? ""} onChange={(event) => setName(event.target.value)} />
        </Form.Group>
        {!draft && (
          <div className="datacenter-draft-fields">
            <Form.Group className="mb-3" controlId="datacenter-device-image">
              <Form.Label>Фото оборудования</Form.Label>
              <Form.Control type="file" accept="image/jpeg,image/png,image/webp" required
                onChange={(event) => image.select((event.target as HTMLInputElement).files?.[0])} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="datacenter-device-video">
              <Form.Label>Видео оборудования</Form.Label>
              <Form.Control type="file" accept="video/webm,video/mp4" required
                onChange={(event) => video.select((event.target as HTMLInputElement).files?.[0])} />
            </Form.Group>
          </div>
        )}
        {(imageURL || videoURL) && (
          <div className="datacenter-media-preview">
            {imageURL && <img src={imageURL} alt="Фото оборудования" />}
            {videoURL && <video src={videoURL} controls playsInline preload="auto" aria-label="Видео оборудования" />}
          </div>
        )}
        {draft && (
          <>
            <Form.Group className="mb-3" controlId="datacenter-device-description">
              <Form.Label>Описание</Form.Label>
              <Form.Control as="textarea" rows={3} required value={description ?? draft?.short_description ?? ""}
                onChange={(event) => setDescription(event.target.value)} />
            </Form.Group>
            <div className="datacenter-draft-fields">
              <Form.Group className="mb-3" controlId="datacenter-device-power">
                <Form.Label>Потребляемая мощность, Вт</Form.Label>
                <Form.Control type="number" required value={powerW ?? draft?.power_consumption_w ?? ""}
                  onChange={(event) => setPowerW(event.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="datacenter-device-heat">
                <Form.Label>Тепловыделение, БТЕ/ч</Form.Label>
                <Form.Control type="number" required value={heatBTU ?? draft?.heat_dissipation_btu ?? ""}
                  onChange={(event) => setHeatBTU(event.target.value)} />
              </Form.Group>
            </div>
          </>
        )}
        <Button type="submit">{draft ? "Опубликовать" : "Далее"}</Button>
      </Form>
    </>
  );
};
