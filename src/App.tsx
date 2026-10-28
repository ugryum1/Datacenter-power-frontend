import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { ROUTES } from "./Routes";
import { DatacenterDevicesPage } from "./pages/DatacenterDevicesPage";
import { DatacenterDeviceReelPage } from "./pages/DatacenterDeviceReelPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to={ROUTES.DATACENTER_DEVICES} />} />
          <Route path={ROUTES.DATACENTER_DEVICES} element={<DatacenterDevicesPage />} />
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
