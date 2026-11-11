import "./TabBar.css";
import type { FC } from "react";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import axios from "axios";
import { DATACENTER_TOKEN_KEY, datacenterEngineerAuthorization } from "../../api";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  failDatacenterEngineerRequest, signOutDatacenterEngineer, startDatacenterEngineerRequest,
} from "../../slices/datacenterEngineerSlice";

export const TabBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const engineer = useAppSelector((state) => state.datacenterEngineer);
  const loading = useAppSelector((state) => state.datacenterDevices.loading) || engineer.loading;

  const handleSignOut = async () => {
    dispatch(startDatacenterEngineerRequest());
    try {
      await axios.post("/api/datacenter-engineers/sign-out", null, {
        headers: datacenterEngineerAuthorization(1),
      });
      localStorage.removeItem(DATACENTER_TOKEN_KEY);
      dispatch(signOutDatacenterEngineer());
      navigate(ROUTES.DATACENTER_DEVICES);
    } catch {
      dispatch(failDatacenterEngineerRequest("Не удалось выйти из системы"));
    }
  };

  const isReel = location.pathname.startsWith(ROUTES.DATACENTER_DEVICE_REEL);
  const isDevices = location.pathname === ROUTES.DATACENTER_DEVICES;

  return (
    <Nav className="datacenter-tabbar">
      <Nav.Link disabled={loading} active={isReel}
        onClick={() => navigate(ROUTES.DATACENTER_DEVICE_REEL)}>
        <span className="icon">▶</span>
        {ROUTE_LABELS.DATACENTER_DEVICE_REEL}
      </Nav.Link>
      <Nav.Link disabled={loading || !engineer.isAuthenticated}
        active={location.pathname === ROUTES.DATACENTER_DEVICE_DRAFT}
        onClick={() => navigate(ROUTES.DATACENTER_DEVICE_DRAFT)}>
        <span className="icon">+</span>
        {ROUTE_LABELS.DATACENTER_DEVICE_DRAFT}
      </Nav.Link>
      <Nav.Link disabled={loading} active={isDevices}
        onClick={() => navigate(ROUTES.DATACENTER_DEVICES)}>
        <span className="icon">▦</span>
        {ROUTE_LABELS.DATACENTER_DEVICES}
      </Nav.Link>
      <Nav.Link disabled={loading}
        active={location.pathname === ROUTES.DATACENTER_ENGINEER_SIGN_IN}
        onClick={() => engineer.isAuthenticated
          ? handleSignOut()
          : navigate(ROUTES.DATACENTER_ENGINEER_SIGN_IN)}>
        <span className="icon">⇥</span>
        {engineer.isAuthenticated ? "Выход" : ROUTE_LABELS.DATACENTER_ENGINEER_SIGN_IN}
      </Nav.Link>
    </Nav>
  );
};
