import "./TabBar.css";
import type { FC } from "react";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../../Routes";

export const TabBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isReel = location.pathname.startsWith(ROUTES.DATACENTER_DEVICE_REEL);
  const isDevices = location.pathname === ROUTES.DATACENTER_DEVICES;

  return (
    <Nav className="datacenter-tabbar">
      <Nav.Link active={isReel} onClick={() => navigate(ROUTES.DATACENTER_DEVICE_REEL)}>
        <span className="icon">▶</span>
        {ROUTE_LABELS.DATACENTER_DEVICE_REEL}
      </Nav.Link>
      <Nav.Link disabled>
        <span className="icon">+</span>
        {ROUTE_LABELS.DATACENTER_DEVICE_DRAFT}
      </Nav.Link>
      <Nav.Link active={isDevices} onClick={() => navigate(ROUTES.DATACENTER_DEVICES)}>
        <span className="icon">▦</span>
        {ROUTE_LABELS.DATACENTER_DEVICES}
      </Nav.Link>
      <Nav.Link disabled>
        <span className="icon">⇥</span>
        {ROUTE_LABELS.DATACENTER_ENGINEER_SIGN_IN}
      </Nav.Link>
    </Nav>
  );
};
