import "./DatacenterDeviceCard.css";
import type { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { datacenterMediaURL } from "../../api";

const defaultDeviceImage = "/default-device.jpg";

interface Props {
  name: string;
  image_url: string | null;
  power_consumption_w: number | null;
  likes_count: number;
  onClick: () => void;
  onDelete?: () => void;
}

export const DatacenterDeviceCard: FC<Props> = ({
  name,
  image_url,
  power_consumption_w,
  likes_count,
  onClick,
  onDelete,
}) => (
  <Card className="equipment-card" onClick={onClick}>
    <Card.Img
      className="equipment-card__media"
      variant="top"
      src={datacenterMediaURL(image_url) || defaultDeviceImage}
      alt={name}
    />
    <Card.Body className="info">
      <Card.Title className="name">{name}</Card.Title>
      <div className="meta">
        <span>❤ {likes_count}</span>
        <span className="power">{power_consumption_w} Вт</span>
      </div>
      {onDelete && (
        <Button variant="outline-danger" size="sm" className="equipment-delete" onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}>
          Удалить
        </Button>
      )}
    </Card.Body>
  </Card>
);
