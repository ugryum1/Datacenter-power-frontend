import { useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DatacenterTopbar } from "../../components/DatacenterTopbar";
import { useAppDispatch } from "../../hooks";
import { DATACENTER_TOKEN_KEY } from "../../api";
import {
  failDatacenterEngineerRequest, signInDatacenterEngineer, startDatacenterEngineerRequest,
} from "../../slices/datacenterEngineerSlice";
import { ROUTES } from "../../Routes";

export const DatacenterEngineerSignInPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(startDatacenterEngineerRequest());
    try {
      const response = await axios.post<{ access_token: string }>(
        "/api/datacenter-engineers/sign-in", { login, password },
      );
      localStorage.setItem(DATACENTER_TOKEN_KEY, response.data.access_token);
      dispatch(signInDatacenterEngineer(login));
      navigate(ROUTES.DATACENTER_DEVICES);
    } catch {
      dispatch(failDatacenterEngineerRequest("Не удалось войти. Проверьте логин и пароль"));
    }
  };

  return (
    <>
      <DatacenterTopbar title="Вход инженера" />
      <Form className="datacenter-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="datacenter-engineer-login">
          <Form.Label>Логин</Form.Label>
          <Form.Control autoComplete="username" required value={login}
            onChange={(event) => setLogin(event.target.value)} />
        </Form.Group>
        <Form.Group className="mb-4" controlId="datacenter-engineer-password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control type="password" autoComplete="current-password" required value={password}
            onChange={(event) => setPassword(event.target.value)} />
        </Form.Group>
        <Button type="submit">Войти</Button>
      </Form>
    </>
  );
};
