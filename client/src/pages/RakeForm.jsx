import { useState } from "react";
import axios from "axios";
import "../Styles/RakeForm.css";

export default function RakeForm() {
  const initialFormData = {
    rakeNo: "",
    rakeArrivalTime: "",
    wagons: "",
    companyName: "",
    arrivalDate: "",
    siding: "",
    placementDateTime: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://rakedetection.vercel.app//api/v2/rake/addRake", formData);
      console.log(response.data);
      alert("Success");
      setFormData(initialFormData); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="rake-form">
        <form className="rake-form-inputs" onSubmit={handleSubmit}>
          <div className="r-inputs">
            <div className="ri">
              <span>Rake No</span>
              <input
                type="text"
                name="rakeNo"
                value={formData.rakeNo}
                onChange={handleChange}
              />
            </div>
            <div className="ri">
              <span>Rake Arrival Time</span>
              <input
                type="text"
                name="rakeArrivalTime"
                value={formData.rakeArrivalTime}
                onChange={handleChange}
              />
            </div>
            <div className="ri">
              <span>No. of Wagons</span>
              <input
                type="text"
                name="wagons"
                value={formData.wagons}
                onChange={handleChange}
              />
            </div>
            <div className="ri">
              <span>Company Name</span>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="ri">
              <span>Arrival Date</span>
              <input
                type="date"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleChange}
              />
            </div>
            <div className="ri">
              <span>Siding</span>
              <input
                type="text"
                name="siding"
                value={formData.siding}
                onChange={handleChange}
              />
            </div>
            <div className="ri">
              <span>Placement Date/Time</span>
              <input
                type="datetime-local"
                name="placementDateTime"
                value={formData.placementDateTime}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="r-btn">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}
