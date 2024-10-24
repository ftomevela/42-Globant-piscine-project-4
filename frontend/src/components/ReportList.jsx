// src/components/ReportList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReportList() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get('/api/reports.') // Asegúrate de que la URL de la API sea correcta
      .then(response => setReports(response.data))
      .catch(error => console.error('Error fetching reports:', error));
  }, []);

  return (
    <ul>
      {reports.map(report => (
        <li key={report.id}>{report.title}</li>
      ))}
    </ul>
  );
}

export default ReportList;
