import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

const BASE_URL = "https://assignment-1-0a3e.onrender.com";

function Login(){
  const [data,setData] = useState({email:"",password:""});
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError("");

    setLoading(true);

    try{
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        data
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);

      navigate("/dashboard");
    }catch(err){
      setError(err.response?.data?.message || "Login failed");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email"
            required
            value={data.email}
            onChange={e=>setData({...data,email:e.target.value})}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={data.password}
            onChange={e=>setData({...data,password:e.target.value})}
          />

          {error && (
            <p style={{color:"red", marginTop:"5px"}}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don’t have an account? 
          <Link to="/"> Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login;