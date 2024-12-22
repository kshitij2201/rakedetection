import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "../Styles/UpdateTable.css";

export default function UpdateTable() {
  const [selectedWT, setSelectedWT] = useState("wt1");
  const [rakeNo, setRakeNo] = useState("");
  const [progressData, setProgressData] = useState([]);
  const [assignedWagons, setAssignedWagons] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [editingHour, setEditingHour] = useState(null);

  const reasonsList = [
    "Receipt of wet coal.",
    "Receipt of Lumpy Coal.",
    "Receipt of stones.",
    "Removal of foreign material from wagon tippler grills.",
    "Frequent grilling.",
    "Multiple tippling of wagons.",
    "Simultaneous racking of each and every wagon.",
    "Ply patching work",
    "Gearbox work.",
    "Scoop coupling work.",
    "Oil Top up work.",
    "BCN Motor work.",
    "Crusher work.",
    "Wobbler work",
    "Electrical connection work.",
    "Shear Pin failure.",
    "Crusher chokeup removal work.",
    "Roller fitting work.",
    "Head Pulley work.",
    "Pulley jamming removal work.",
    "Chute choke up removal work.",
    "Bunker tripper chokeup removal work.",
    "Delay in TTR trolley movement.",
    "Wagon lot changeover.",
    "Pull cord operated.",
    "Oil temperature checking work.",
    "Running out removal work",
    "Complete belt replacement work.",
    "Heavy cold spillage from conveyor belt Joint work",
    "Alternate Tippling between two tipplers.",
    "Reference given to unload previous rake.",
    "Delay In rake placement at tippler for unloading.",
    "Non availability of operator.",
    "Availability of single stream for unloading.",
    "Unloading hampered to empty wagons at outhaul.",
    "Apron feeder overload removal work.",
    "Apron feeder Pan work.",
    "Wagon lot shifting work.",
    "Hydraulic issues at tippler",
    "Clamping issues.",
    "Overlap joint work.",
    "Unloading delayed due to non-removal of trampoline from wagons.",
    "Conveyor getting slip from pulley.",
    "Unloading getting delayed due to delay in wagon shifting due to non-availability of line.",
    "Zss work.",
    "HMS cleaning work.",
    "Pulley checking work.",
    "Wagon couple problem inform to Railway hence unloading delayed.",
    "PCS Malfunctioning.",
    "PCS Operated by bunker operator.",
    "Heavy dust at bunker level hence pcs operated.",
    "Ply cutting work",
    "Unloading very slow due to Loco pushing.",
    "Side arm charger issues.",
    "Agency operator not available at site.",
    "Issues at stacker reclaimer.",
    "Side arm charger command problem.",
    "Auxiliary not taking command.",
    "Housekeeping work.",
    "Chute chokeup removal work.",
    "PCS operated by stone picker.",
    "Electrical Supply issues.",
    "Over size wagon removal from lot.",
    "Unable to unload sick wagon.",
    "Conveyor belt snapped.",
    "Crusher not available.",
    "Bunker grills chokeup.",
    "Delay due to tarpaulin removal work.",
    "Overload removal work.",
    "Flap gate change over work.",
    "System not taking weighment at wagon tippler.",
    "Locomotive failure.",
    "Wagon tippler table setting disturb.",
    "PCS checking work.",
    "Damage roller replacement work.",
    "Housekeeping and cleaning work.",
    "Wagon lot Sent to old plant.",
    "Multiple tippling of wagons at wagon tippler.",
    "Inspection of leftover coal by railway authorities hence delay in rake release.",
    "Welding work.",
    "Overweight wagons.",
    "Photo cell problems.",
    "Hydraulic Pump issues.",
    "Hydraulic motor issues.",
    "Issues in hydraulic system.",
    "Auxiliary having vibration.",
    "Scoop issues.",
    "Apron feeder horizontal beam issues.",
    "Pulley jamming removal work."
  ];

  const handleWTChange = (e) => {
    setSelectedWT(e.target.value);
  };

  const handleRakeNoChange = (e) => {
    setRakeNo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProgressData();
  };

  const fetchProgressData = async () => {
    try {
      const response = await fetch(
        `https://rakedetection.vercel.app/api/v3/wagon/getProgress/${rakeNo}`
      );
      const data = await response.json();
      if (data.success) {
        const selectedWTData = data.assignment[selectedWT];
        console.log(selectedWTData.progress)
        setProgressData(selectedWTData.progress);
        setAssignedWagons(selectedWTData.assignedWagons);
        setEditedData({});
        setEditingHour(null);
      } else {
        setProgressData([]);
        setAssignedWagons(0);
        setEditedData({});
        setEditingHour(null);
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);
      setProgressData([]);
      setAssignedWagons(0);
      setEditedData({});
      setEditingHour(null);
    }
  };

  const handleEdit = (index) => {
    setEditMode(true);
    setEditingHour(index);
    setEditedData({ ...progressData[index] });
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleSave = async () => {
    if (editingHour === null) return;

    const totalCompletedWagons = progressData.reduce(
      (total, progress, index) => {
        if (index === editingHour) {
          return total + parseInt(editedData.completedWagons || 0);
        }
        return total + progress.completedWagons;
      },
      0
    );

    if (totalCompletedWagons > assignedWagons) {
      alert(
        `Total completed wagons (${totalCompletedWagons}) exceed assigned wagons (${assignedWagons}) for WT${selectedWT.charAt(
          2
        )}`
      );
      return;
    }

    try {
      const payload = {
        rakeNo,
        wt: selectedWT.charAt(2),
        hour: editedData.hour,
        completedWagons: parseInt(editedData.completedWagons),
        detectTime: editedData.detectTime || null,
        systemStartTime: editedData.systemStartTime || null,
        reasons: editedData.reasons || "",
      };

      console.log("Payload:", payload);

      const response = await fetch(
        "https://rakedetection.vercel.app/api/v3/wagon/updateHourlyProgress",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("Response:", result);
      if (result.success) {
        alert("Progress updated successfully!");
        setEditMode(false);
        fetchProgressData();
      } else {
        alert("Error updating progress: " + result.message);
      }
    } catch (error) {
      console.error("Error saving progress data:", error);
    }
  };

  useEffect(() => {
    if (rakeNo) {
      fetchProgressData();
    }
  }, [selectedWT, rakeNo]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formattedDate;
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      progressData.map((item) => ({
        'UNLOADING HRS': item.hour,
        'WT1': item.completedWagons,
        'REASON FOR DELAY/LESS UNLOADING': item.reasons,
        'DETECT TIME': formatDateTime(item.detectTime),
        'SYSTEM START TIME': formatDateTime(item.systemStartTime),
        'TOTAL TIME': item.timeDifference
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Progress Data');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'progress_data.xlsx');
  };

  return (
    <>
      <div className="but">
        <form onSubmit={handleSubmit}>
          <label htmlFor="rakeNo">Enter Rake No:</label>
          <input
            type="text"
            id="rakeNo"
            value={rakeNo}
            onChange={handleRakeNoChange}
            required
          />
          <label htmlFor="wt">Choose a Wagon Tipler:</label>
          <select
            name="wt"
            id="wt"
            value={selectedWT}
            onChange={handleWTChange}
          >
            <option value="wt1">WT1</option>
            <option value="wt2">WT2</option>
            <option value="wt3">WT3</option>
            <option value="wt4">WT4</option>
          </select>
          <input type="submit" value="Clear" />
          <button className="btn-excel" type="button" onClick={exportToExcel}>
            Export to Excel
          </button>
        </form>
      </div>

      <div className="update-table">
        <table>
          <thead>
            <tr>
              <th rowSpan={2}>UNLOADING HRS</th>
              <th rowSpan={2}>{selectedWT}</th>
              <th rowSpan={2}>REASON FOR DELAY/LESS UNLOADING</th>
              <th colSpan={3}>DOWNTIME ANALYSIS</th>
              <th rowSpan={2}>ACTION</th>
            </tr>
            <tr>
              <th>DETECT TIME</th>
              <th>SYSTEM START TIME</th>
              <th>TOTAL TIME</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>Assign Wagons:{assignedWagons}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {progressData.map((item, index) => (
              <tr key={index}>
                <td>{item.hour} Hr</td>
                <td>
                  {editMode && editingHour === index ? (
                    <input
                      type="number"
                      value={editedData.completedWagons || ""}
                      onChange={(e) =>
                        handleInputChange("completedWagons", e.target.value)
                      }
                    />
                  ) : (
                    item.completedWagons
                  )}
                </td>
                <td>
                  {editMode && editingHour === index ? (
                    <select
                      value={editedData.reasons || ""}
                      onChange={(e) =>
                        handleInputChange("reasons", e.target.value)
                      }
                    >
                      <option value="">Select Reason</option>
                      {reasonsList.map((reason, idx) => (
                        <option key={idx} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.reasons
                  )}
                </td>
                <td>
                  {editMode && editingHour === index ? (
                    <input
                      type="datetime-local"
                      value={editedData.detectTime || ""}
                      onChange={(e) =>
                        handleInputChange("detectTime", e.target.value)
                      }
                    />
                  ) : (
                    formatDateTime(item.detectTime)
                  )}
                </td>
                <td>
                  {editMode && editingHour === index ? (
                    <input
                      type="datetime-local"
                      value={editedData.systemStartTime || ""}
                      onChange={(e) =>
                        handleInputChange("systemStartTime", e.target.value)
                      }
                    />
                  ) : (
                    formatDateTime(item.systemStartTime)
                  )}
                </td>
                <td>{item.timeDifference}</td>
                <td>
                  {editMode && editingHour === index ? (
                    <button onClick={handleSave}>Save</button>
                  ) : (
                    <button onClick={() => handleEdit(index)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
