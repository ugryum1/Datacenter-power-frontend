import "./PowerFilter.css";
import type { FC } from "react";
import { Button, Form } from "react-bootstrap";

interface Props {
  powerW: number;
  setPowerW: (powerW: number) => void;
  onSubmit: () => void;
  loading?: boolean;
  powerLimitW?: number;
  powerStepW?: number;
}

export const PowerFilter: FC<Props> = ({
  powerW,
  setPowerW,
  onSubmit,
  loading,
  powerLimitW = 2000,
  powerStepW = 50,
}) => (
  <Form
    className="power-filter"
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <div className="power-filter__head">
      <span>Мощность от</span>
      <b>{powerW} Вт</b>
    </div>
    <Form.Range
      min={0}
      max={powerLimitW}
      step={powerStepW}
      value={powerW}
      onChange={(event) => setPowerW(Number(event.target.value))}
    />
    <div className="power-filter__scale">
      <span>0 Вт</span>
      <span>{powerLimitW} Вт</span>
    </div>
    <Button type="submit" disabled={loading}>
      Показать
    </Button>
  </Form>
);
