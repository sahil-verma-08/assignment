import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

function Signup(){
  const [data,setData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  });

  const [error,setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError("");

    
    if(data.password.length < 6){
      setError("Password must be at least 6 characters");
      return;
    }

    if(data.password !== data.confirmPassword){
      setError("Passwords do not match");
      return;
    }

    try{
      await axios.post("http://localhost:5000/api/auth/signup",{
        name: data.name,
        email: data.email,
        password: data.password
      });

      navigate("/login");
    }catch(err){
      setError("Signup failed");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={data.name}
            onChange={e=>setData({...data,name:e.target.value})}
          />

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
            minLength="6"
            value={data.password}
            onChange={e=>setData({...data,password:e.target.value})}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={data.confirmPassword}
            onChange={e=>setData({...data,confirmPassword:e.target.value})}
          />

          {/* Error */}
          {error && <p style={{color:"red"}}>{error}</p>}

          <button type="submit">Sign Up</button>
        </form>

        <p>
          Already have an account? 
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup;