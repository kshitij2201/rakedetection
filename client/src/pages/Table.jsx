import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Table.css";

export default function Table() {
  const [rakes, setRakes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRake, setSelectedRake] = useState(null);
  const [wt1, setWt1] = useState(0);
  const [wt2, setWt2] = useState(0);
  const [wt3, setWt3] = useState(0);
  const [wt4, setWt4] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://rake-detection.onrender.com/api/v2/rake/getAllRakes");
        if (response.data.success) {
          setRakes(response.data.rakes);
        }
      } catch (error) {
        console.error("Error fetching the rakes data", error);
      }
    };

    fetchData();
  }, []);

  // Handle modal open
  const handleOpenModal = (rake) => {
    setSelectedRake(rake);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRake(null);
  };

  let rakeNoExisting = selectedRake?.rakeNo;
  console.log(rakeNoExisting)


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      rakeNo: rakeNoExisting,
      wt1: parseInt(wt1, 10),
      wt2: parseInt(wt2, 10),
      wt3: parseInt(wt3, 10),
      wt4: parseInt(wt4, 10),
    };
  
    console.log("Payload:", payload);
  
    try {
      const response = await axios.post("https://rake-detection.onrender.com/api/v3/wagon/assignWagons", payload);
  
      if (response.data.success) {
        alert("Wagons assigned successfully!");
        handleCloseModal();
      } else {
        alert("Error assigning wagons: " + response.data.message);
      }
    } catch (error) {
      console.error("Error assigning wagons:", error);
      alert("Error assigning wagons");
    }
  };
  
  

  return (
    <>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Rake No.</th>
              <th>Rake Arrival Time</th>
              <th>Wagons</th>
              <th>Company Name</th>
              <th>Arrival Date</th>
              <th>Siding</th>
              <th>Placement Date/Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rakes.map((rake) => (
              <tr key={rake._id}>
                <td>{rake.rakeNo}</td>
                <td>{rake.rakeArrivalTime}</td>
                <td>{rake.wagons}</td>
                <td>{rake.companyName}</td>
                <td>{new Date(rake.arrivalDate).toLocaleDateString()}</td>
                <td>{rake.siding}</td>
                <td>{new Date(rake.placementDateTime).toLocaleString()}</td>
                <td>
                  <button style={{cursor:'pointer'}}  onClick={() => handleOpenModal(rake)}>Action</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div className={`modal ${isModalOpen ? "open" : ""}`}>
        <div className="modal-content">
          <span className="close" onClick={handleCloseModal}>&times;</span>
          <h2>Assign Wagons to {selectedRake?.rakeNo}</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="wt1">WT1:</label>
            <input
              type="number"
              id="wt1"
              value={wt1}
              onChange={(e) => setWt1(e.target.value)}
              min="0"
            />
            <label htmlFor="wt2">WT2:</label>
            <input
              type="number"
              id="wt2"
              value={wt2}
              onChange={(e) => setWt2(e.target.value)}
              min="0"
            />
            <label htmlFor="wt3">WT3:</label>
            <input
              type="number"
              id="wt3"
              value={wt3}
              onChange={(e) => setWt3(e.target.value)}
              min="0"
            />
            <label htmlFor="wt4">WT4:</label>
            <input
              type="number"
              id="wt4"
              value={wt4}
              onChange={(e) => setWt4(e.target.value)}
              min="0"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
