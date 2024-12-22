import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/Report.css'; // Ensure you create a CSS file for styling
import toast from 'react-hot-toast';

const Report = () => {
  const [rakeNo, setRakeNo] = useState('');
  const [releaseTime, setReleaseTime] = useState('');
  const [railwayInputHours, setRailwayInputHours] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rakeNo || !releaseTime || !railwayInputHours) {
      setError('All fields are required');
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('https://rakedetection-bakckend.vercel.app/api/v3/wagon/report-1', {
        rakeNo,
        releaseTime,
        railwayInputHours,
      });

      if (response.data.success) {
        console.log(response.data)
        setReport(response.data.report);
        setError('');
        toast.success('Report generated successfully');
      } else {
        setError(response.data.message || 'Failed to generate report');
        toast.error(response.data.message || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Server error. Please try again later.');
      toast.error('Server error. Please try again later.');
    }
  };

  return (
    <div className="report-container">
      <h2>Generate Report</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="rakeNo">Rake No:</label>
          <input
            type="text"
            id="rakeNo"
            value={rakeNo}
            onChange={(e) => setRakeNo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="releaseTime">Release Time:</label>
          <input
            type="time"
            id="releaseTime"
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="railwayInputHours">Railway Input Hours:</label>
          <input
            type="number"
            id="railwayInputHours"
            value={railwayInputHours}
            onChange={(e) => setRailwayInputHours(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="generate-button">
          Generate Report
        </button>
      </form>

      {report && (
        <div className="report-result">
          <h3>Report:</h3>
          <p>Rake No: {report.rakeNo}</p>
          <p>Total Downtime: {report.totalDowntime}</p>
          <p>Detention Hours: {report.detentionHours}</p>
          <p>Demurrage Hours: {report.demurrageHours}</p>
        </div>
      )}
    </div>
  );
};

export default Report;
