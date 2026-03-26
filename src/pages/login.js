import { useState } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Box, Alert, Typography, Divider } from "@mui/material";

export default function Login() {

 const [form,setForm] = useState({
   username:"",
   password:"",
   role:""
 });

 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [isRegistering, setIsRegistering] = useState(false);

 const handleLogin = async ()=>{
   setError("");
   setSuccess("");
   
   if(!form.username || !form.password || !form.role){
     setError("Please fill in all fields");
     return;
   }

   try{
     const res = await axios.post(
       "http://localhost:5000/api/auth/login",
       form
     );

     localStorage.setItem("token",res.data.token);
     localStorage.setItem("user", JSON.stringify(res.data.user));
     
     // Redirect based on role
     const role = form.role.toLowerCase();
     if(role === "admin") window.location="/admin";
     else if(role === "doctor") window.location="/doctor";
     else if(role === "reception") window.location="/reception";
     else if(role === "nurse") window.location="/nurse";
     else window.location="/admin";
   }catch(err){
     setError(err.response?.data?.error || "Login failed");
   }
 };

 const handleRegister = async ()=>{
   setError("");
   setSuccess("");
   
   if(!form.username || !form.password || !form.role){
     setError("Please fill in all fields");
     return;
   }

   try{
     await axios.post(
       "http://localhost:5000/api/auth/register",
       form
     );
     setSuccess("Registration successful! Now you can login.");
     setForm({username:"", password:"", role:""});
     setIsRegistering(false);
   }catch(err){
     setError(err.response?.data?.error || "Registration failed");
   }
 };

 return (
  <Box sx={{width:350,mx:"auto",mt:5, p:2, border:"1px solid #ddd", borderRadius:2}}>
    <Typography variant="h5" sx={{mb:3, textAlign:"center"}}>
      CarePulse Login
    </Typography>

    {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}
    {success && <Alert severity="success" sx={{mb:2}}>{success}</Alert>}
    
    <TextField label="Username"
      fullWidth margin="normal"
      value={form.username}
      onChange={e=>setForm({...form,username:e.target.value})}
    />

    <TextField label="Password"
      type="password"
      fullWidth margin="normal"
      value={form.password}
      onChange={e=>setForm({...form,password:e.target.value})}
    />

    <TextField select label="Role"
      fullWidth margin="normal"
      value={form.role}
      onChange={e=>setForm({...form,role:e.target.value})}
    >
      <MenuItem value="admin">Admin</MenuItem>
      <MenuItem value="doctor">Doctor</MenuItem>
      <MenuItem value="nurse">Nurse</MenuItem>
      <MenuItem value="reception">Reception</MenuItem>
      <MenuItem value="supervisor">Supervisor</MenuItem>
    </TextField>

    <Button variant="contained" fullWidth onClick={handleLogin} sx={{mt:2}}>
      Login
    </Button>

    <Divider sx={{my:2}}>OR</Divider>

    <Button 
      variant="outlined" 
      fullWidth 
      onClick={()=> setIsRegistering(!isRegistering)}
    >
      {isRegistering ? "Back to Login" : "Register New Account"}
    </Button>

    {isRegistering && (
      <Button variant="contained" color="success" fullWidth onClick={handleRegister} sx={{mt:2}}>
        Create Account
      </Button>
    )}
  </Box>
 );
}
