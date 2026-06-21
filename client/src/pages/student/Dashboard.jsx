//import React from 'react'
import { items } from "../../assets/assets"
import { Link } from "react-router-dom"


const StudentDashboard = () => {
  return (
    <div className="p-5 flex flex-col">
      <div className="flex flex-row gap-6 pb-5 items-center justify-between sm:flex-row">
        <div>
          <h1 className="text-lg font-bold">Good morning, Amina 👋</h1>
          <p className="text-gray-400 text-sm ">Here's an overview of your consultations.</p>
        </div>

        <div>
          <button className="inline-flex items-center justify-center rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            + Book Consultation
          </button>
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50">
              <img src={item.image} alt={item.name} className="h-8 w-8 " />
            </div>
            <div>
              <p className="  uppercase  ">{item.name}</p>
              <p className="mt-2 text-lg font-bold ">{item.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-10">
        <div className="w-3/4 border border-white bg-white  ">
          <div className="flex justify-between p-5">
            <h1>Recent Appointments</h1>
            <Link to = 'Myappointments' className="">view all </Link>
          </div>
          
        </div>






      </div>





    </div>
  )
}

export default StudentDashboard