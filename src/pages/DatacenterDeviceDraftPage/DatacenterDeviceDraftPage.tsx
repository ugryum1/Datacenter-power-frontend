import { useEffect, useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { DatacenterTopbar } from "../../components/DatacenterTopbar";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getDatacenterDeviceDraft, publishDatacenterDevice } from "../../slices/datacenterDevicesSlice";
import { ROUTES } from "../../Routes";

export const DatacenterDeviceDraftPage = () => {
  const isAuthenticated = useAppSelector((state) => state.datacenterEngineer.isAuthenticated);
  const draft = useAppSelector((state) => state.datacenterDevices.draft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [powerW, setPowerW] = useState<string | null>(null);
  const [heatBTU, setHeatBTU] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  useEffect(() => {
    if (isAuthenticated) dispatch(getDatacenterDeviceDraft());
  }, [dispatch, isAuthenticated]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(publishDatacenterDevice({
      fields: {
        name: name ?? draft?.name ?? "",
        short_description: description ?? draft?.short_description ?? "",
        power_consumption_w: Number(powerW ?? draft?.power_consumption_w), heat_dissipation_btu: Number(heatBTU ?? draft?.heat_dissipation_btu),
      },
      image, video,
    }));
    if (publishDatacenterDevice.fulfilled.match(result)) {
      navigate(`${ROUTES.DATACENTER_DEVICE_REEL}/${result.payload.id}`);
    }
  };

  if (!isAuthenticated) return <Navigate to={ROUTES.DATACENTER_ENGINEER_SIGN_IN} replace />;

  return (
    <>
      <DatacenterTopbar title="Добавление оборудования" />
      <Form className="datacenter-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="datacenter-device-name">
          <Form.Label>Название</Form.Label>
          <Form.Control required value={name ?? draft?.name ?? ""} onChange={(event) => setName(event.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="datacenter-device-description">
          <Form.Label>Описание</Form.Label>
          <Form.Control as="textarea" rows={3} required value={description ?? draft?.short_description ?? ""}
            onChange={(event) => setDescription(event.target.value)} />
        </Form.Group>
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
        {!draft && (
          <>
            <Form.Group className="mb-3" controlId="datacenter-device-image">
              <Form.Label>Фото оборудования</Form.Label>
              <Form.Control type="file" accept="image/jpeg,image/png,image/webp" required
                onChange={(event) => setImage((event.target as HTMLInputElement).files?.[0] ?? null)} />
            </Form.Group>
            <Form.Group className="mb-4" controlId="datacenter-device-video">
              <Form.Label>Видео оборудования</Form.Label>
              <Form.Control type="file" accept="video/webm,video/mp4" required
                onChange={(event) => setVideo((event.target as HTMLInputElement).files?.[0] ?? null)} />
            </Form.Group>
          </>
        )}
        {draft && <p>Фото и видео черновика уже загружены.</p>}
        <Button type="submit">Опубликовать</Button>
      </Form>
    </>
  );
};
