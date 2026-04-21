import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";


const BASE_URL = "https://assignment-1-0a3e.onrender.com";

function Dashboard(){
  const navigate = useNavigate();

  const [user, setUser] = useState({name:"", email:""});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(!token){
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try{
        const res = await axios.get(`${BASE_URL}/api/auth/me`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });

        setUser(res.data);
      }catch{
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }finally{
        setLoading(false);
      }
    };

    fetchUser();

  },[navigate, token]); 

  
  const handleUpdate = async ()=>{
    try{
      await axios.put(
        `${BASE_URL}/api/auth/update`,
        user,
        {
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      );
      setEdit(false);
    }catch{
      alert("Update failed");
    }
  };


  const handleLogout = ()=>{
    localStorage.removeItem("token");
    navigate("/login");
  };

  if(loading){
    return (
      <h2 style={{textAlign:"center", marginTop:"50px"}}>
        Loading...
      </h2>
    );
  }

  return (
    <div className="dash-container">

     
      <div className="dash-navbar">
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      
      <div className="dash-content">

        <h1>Welcome {user.name} </h1>
        <p>You are successfully logged in </p>

        {error && <p style={{color:"red"}}>{error}</p>}

        <div className="card-container">

          <div className="card">
            <h3>Name</h3>
            {edit ? (
              <input
                value={user.name}
                onChange={e=>setUser({...user, name:e.target.value})}
              />
            ) : (
              <p>{user.name}</p>
            )}
          </div>

          <div className="card">
            <h3>Email</h3>
            {edit ? (
              <input
                value={user.email}
                onChange={e=>setUser({...user, email:e.target.value})}
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>

          <div className="card">
            <h3>Status</h3>
            <p>Active </p>
          </div>

        </div>

        <div style={{marginTop:"20px"}}>
          {edit ? (
            <button onClick={handleUpdate}>Save</button>
          ) : (
            <button onClick={()=>setEdit(true)}>Edit Profile</button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;