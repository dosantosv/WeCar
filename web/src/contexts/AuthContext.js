import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getToken, createToken, removeToken } from "~/utils/auth";
import retry from "retry";

import api from "~/services/api";
import WebRepository from "~/services/WebRepository";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (token) {
      userProfile();
    }
  }, []);

  const operation = retry.operation({
    retries: 5,
    factor: 3,
    minTimeout: 1 * 1000,
    maxTimeout: 60 * 1000,
    randomize: true,
  });

  async function handleSubmit() {
    if (email && password) {
      setLoading(true);

      try {
        const { data } = await api.post("/api/auth/login", { email, password });
        const { token, refreshToken, error, message } = data;

        if (token) {
          setEmail("");
          setPassword("");
          setLoading(false);

          createToken(token, refreshToken);

          api.defaults.headers["Authorization"] = `Bearer ${token}`;

          navigate("/admin/");
          //window.location.replace("/admin/");
        } else {
          if (message) {
            toast.success(message);
          } else {
            toast.error(error);
            setLoading(false);
            setPassword("");
          }
        }
      } catch (ex) {
        toast.error("Houve um problema com o servidor!");
        setLoading(false);
      }
    } else {
      toast.error("Preencha email e senha para continuar!");
    }
  }

  const userProfile = async () => {
    if (window.location.pathname == "/admin/login") {
      return navigate("/admin");
    }

    operation.attempt(async (currentAttempt) => {
      console.log(`sending request: ${currentAttempt} attempt`);
      try {
        const data = await WebRepository.getProfile();

        setUser(data);
      } catch (ex) {
        console.error("Não foi possivel encontrar o perfil!");
        if (operation.retry(ex)) {
          return;
        }
      }
    });
  };

  function logout() {
    removeToken();
    setUser(null);

    window.location.replace("/admin/login");
  }

  const value = {
    handleSubmit,
    email,
    password,
    user,
    authenticated: !!user,
    setEmail,
    setPassword,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
