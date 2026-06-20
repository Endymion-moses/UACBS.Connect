//import React from 'react'
import { useNavigate } from "react-router-dom";
import {assets} from "../../assets/assets.js"
import {useState} from "react"

const Login = () => {
    const navigate = useNavigate();
    const[role, setRole] = useState("student");
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    

     const handleSubmit = (e) => {
    e.preventDefault(); // stops the page from refreshing
      if (role === "student") navigate("/student");
      if (role === "lecturer") navigate("/lecturer");
      if (role === "admin") navigate("/admin");
       };

  return (
    <div className="flex md:flex-row min-h-screen">
        <div className = "hidden md:flex w-full md:w-1/2 bg-blue-900 flex flex-col   mx-auto px-10">
            
                <div className="flex gap-2 p-5">
                    <img src={assets.cap_icon} alt="" className="w-15 h-15" />
                    <div className="flex flex-col">
                        <h5 className="text-white  font-bold">UACBS</h5>
                        <p className="text-gray-400 text-sm ">University Academic Consultation Booking System</p>
                    </div>
                </div>
                <div className="pt-10" >
                        <p className="text-white text-5xl p-4">Book Consultations with 
                            your lecturers - online, 
                            anytime</p>

                    <p className="text-gray-400 text-lg p-5">no more wondering office to office.Find available slots,
                        submit your request,and get notified instantly
                    </p>
                </div>

                <div className="flex gap-5 p-5 ">
                    <div className="flex flex-col ">
                        <h1 className="text-2xl font-bold text-white">1,240+</h1>
                        <p className="text-gray-400 text-sm">Consultations booked</p>
                    </div>
                    <div className="flex flex-col pl-6">
                        <h1 className="text-2xl font-bold text-white">48</h1>
                        <p className="text-gray-400 text-sm">lecturers available</p>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white">3 min</h1>
                        <p className="text-gray-400 text-sm">Average booking time</p>
                    </div>
                </div>
                <p className="text-gray-400 pt-15 text-sm p-5">©2026 University Academic Consultation Booking System</p>
            
        </div>

        <div className = "w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-100">
            <div>

                <div>
                    <div className="flex gap-3">
                         <img src={assets.cap_icon} alt="" className="w-15 h-15 md:hidden" />
                        <div className="flex flex-col">
                             <h2 className="text-4xl font-bold text-black-800">Welcome back</h2>
                            <p className="text-gray-600 text-lg">Sign in to your account to continue</p>
                        </div>
                    </div> 

                    <div className = "flex gap-4 pt-5 pb-5">
                       {["student", "lecturer", "admin"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`w-1/3 py-2 text-sm font-medium ${
                            role === r
                                ? "rounded-xl border border-white bg-white"
                                : "text-gray-500"
                            }`}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                        ))}

                    </div> 
                </div>
             
                <form onSubmit={handleSubmit}>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Email Address</label>
                    <input 
                    type="email" 
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow appearance-none border border-white rounded-xl w-full py-2 px-3 text-gray-700 
                    leading-tight focus:outline-none focus:shadow-outline bg-white" />

                    <label className="block text-gray-700 text-lg font-bold mb-2">Password</label>
                    <input
                    type="password" 
                    placeholder="............"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border border-white rounded-xl w-full py-2 px-3 text-gray-700 
                    leading-tight focus:outline-none focus:shadow-outline bg-white" />

                    <div className= "flex justify-between items-center ">
                        <div className="flex items-center gap-2">
                            <input className=" border rounded p-2 text-gray-700 " type="checkbox" /> 
                            <label className=" text-gray-500 text-lg  mb-2">Remember me</label>
                        </div>

                        <button className="text-blue-500 hover:text-blue-800">Forgot Password?</button>
                    </div>
                    
                    <button 
                    type="submit" 
                    className="bg-blue-900 w-full rounded-xl p-3 ">Sign in</button>

                    <div className="flex gap-1 p-5 items-center">
                        <p className="text-gray-700 text-sm">Dont have an account?</p>
                        <button className="text-blue-500 hover:text-blue-800">Create account</button>
                    </div>
                </form>
            </div>
        </div>
              
    </div>
  )
}

export default Login