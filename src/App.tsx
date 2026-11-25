import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { datacenterMockOnly } from "./modules/mock";
import { ROUTES } from "./Routes";
import { DatacenterDevicesPage } from "./pages/DatacenterDevicesPage";
import { DatacenterDeviceReelPage } from "./pages/DatacenterDeviceReelPage";
import { DatacenterEngineerSignInPage } from "./pages/DatacenterEngineerSignInPage/DatacenterEngineerSignInPage";
import { DatacenterDeviceDraftPage } from "./pages/DatacenterDeviceDraftPage/DatacenterDeviceDraftPage";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to={ROUTES.DATACENTER_DEVICES} />} />
          <Route path={ROUTES.DATACENTER_DEVICES} element={<DatacenterDevicesPage />} />
          <Route path={ROUTES.DATACENTER_DEVICE_DRAFT} element={<DatacenterDeviceDraftPage />} />
          <Route path={ROUTES.DATACENTER_ENGINEER_SIGN_IN} element={datacenterMockOnly
            ? <Navigate to={ROUTES.DATACENTER_DEVICES} replace />
            : <DatacenterEngineerSignInPage />}
          />
          <Route
            path={ROUTES.DATACENTER_DEVICE_REEL}
            element={<DatacenterDeviceReelPage />}
          />
          <Route
            path={`${ROUTES.DATACENTER_DEVICE_REEL}/:id`}
            element={<DatacenterDeviceReelPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
