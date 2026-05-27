import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import api from "../../services/api/api";

import "./login.css";

function Login() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const email = e.target[0].value;
    const passWord = e.target[1].value;

    if (!email || !passWord) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const response = await api.post("/user/login", {
        email,
        passWord,
      });

      if (!response) {
        toast.error("internal server error");
        return;
      }

      const { tooken } = response.data;

      localStorage.setItem("tooken", tooken);

      toast.success("Usuario logado!");
      navigate('/');
    } catch {
      toast.error("Email ou senha invalidos");
      return;
    }
    
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="login-container-inputs">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" />
      </div>

      <div className="login-container-inputs">
        <label htmlFor="password">Senha</label>
        <input type="password" id="password" />
      </div>

      <button type="submit" className="default-button">
        Entrar
      </button>
    </form>
  );
}

export default Login;
