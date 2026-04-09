import { type SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { loginApi } from "../../api/authApi";
import { useAuth } from "../../auth/useAuth";

interface LoginErrorResponse {
  message?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginApi({ email, password });
      login(response.token);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as LoginErrorResponse | undefined)?.message
          : undefined;

      setError(message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
