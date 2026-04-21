import {BrowserRouter, Routes, Route} from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;