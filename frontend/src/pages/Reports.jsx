import React from 'react';
import ReportForm from '../components/ReportForm';
import ReportList from '../components/ReportList';

const Reports = () => {
  return (
    <div>
      <h1>Submit a New Report</h1>
      <ReportForm />
      <h1>Report List</h1>
      <ReportList />
    </div>
  );
};

export default Reports;
