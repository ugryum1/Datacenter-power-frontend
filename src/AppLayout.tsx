import "./AppLayout.css";
import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { TabBar } from "./components/TabBar";
import { Alert, Spinner } from "react-bootstrap";
import { useAppSelector } from "./hooks";

export const AppLayout: FC = () => {
  const devices = useAppSelector((state) => state.datacenterDevices);
  const engineer = useAppSelector((state) => state.datacenterEngineer);
  const loading = devices.loading || engineer.loading;
  return (
    <div className="datacenter-screen">
      <main className="datacenter-screen-body" inert={loading}>
        {(devices.error || engineer.error) && (
          <Alert variant="danger" className="datacenter-request-error">
            {engineer.error || devices.error}
          </Alert>
        )}
        <Outlet />
      </main>
      <TabBar />
      {loading && (
        <div className="datacenter-busy" role="status" aria-label="Загрузка">
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
};
