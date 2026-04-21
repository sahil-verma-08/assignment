import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";

function Dashboard(){
  const navigate = useNavigate();

  const [user, setUser] = useState({name:"", email:""});
  const [edit, setEdit] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(!token){
      return navigate("/login");
    }

    // 🔥 fetch user data
    axios.get("http://localhost:5000/api/auth/me",{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setUser(res.data))
    .catch(()=> navigate("/login"));

  },[]);

  // 🔥 update profile
  const handleUpdate = async ()=>{
    try{
      await axios.put(
        "http://localhost:5000/api/auth/update",
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
  }

  // 🔥 logout
  const handleLogout = ()=>{
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="dash-container">

      {/* Navbar */}
      <div className="dash-navbar">
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Content */}
      <div className="dash-content">

        {/* 🔥 Dynamic Name */}
        <h1>Welcome {user.name} </h1>
        <p>You are successfully logged in </p>

        {/* Cards */}
        <div className="card-container">

          {/* Name Card */}
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

          {/* Email Card */}
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

          {/* Status */}
          <div className="card">
            <h3>Status</h3>
            <p>Active </p>
          </div>

        </div>

        {/* Buttons */}
        <div style={{marginTop:"20px"}}>
          {edit ? (
            <button onClick={handleUpdate}>Save</button>
          ) : (
            <button onClick={()=>setEdit(true)}>Edit Profile</button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard;