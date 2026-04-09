import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/authApi";
import { AxiosError } from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  interface RegisterErrorResponse {
    message?: string;
  } 


  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerApi({ name, email, password });
      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: unknown) {
        const message = err instanceof AxiosError 
        ? (err.response?.data as RegisterErrorResponse | undefined)?.message 
        : undefined;
      setError(message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

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
        {success && <p>{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;