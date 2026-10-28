import "./DatacenterTopbar.css";
import type { FC } from "react";

interface Props {
  title: string;
}

export const DatacenterTopbar: FC<Props> = ({ title }) => (
  <header className="datacenter-topbar">
    <span>ЦОД · {title}</span>
  </header>
);
