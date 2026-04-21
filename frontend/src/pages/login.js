import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

function Login(){
  const [data,setData] = useState({email:"",password:""});
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError("");

    
    if(data.password.length < 6){
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try{
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    }catch(err){
      setError("Invalid email or password");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>LOGIN </h2>

        <form onSubmit={handleSubmit}>
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

          
          {error && <p style={{color:"red", marginTop:"5px"}}>{error}</p>}

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