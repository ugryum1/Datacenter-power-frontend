import "./AppLayout.css";
import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { TabBar } from "./components/TabBar";

export const AppLayout: FC = () => {
  return (
    <div className="datacenter-screen">
      <main className="datacenter-screen-body">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
};
