import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import { ArcElement, BarElement, CategoryScale, LinearScale, BarController, DoughnutController } from 'chart.js';

import api from '../../api/api';

// Register the elements and scales
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, BarController, DoughnutController);

const StatsCharts = ({ employerId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get(`/employer/${employerId}/stats`)
      .then(res => setStats(res.data))
      .catch(console.error);
  }, [employerId]);

  if (!stats) return null;

  const applicationStatusData = {
    labels: ['Accepted', 'Shortlisted', 'Rejected'],
    datasets: [
      {
        data: [stats.acceptedApplications, stats.shortlistedApplications, stats.rejectedApplications],
        backgroundColor: ['green', 'orange', 'red']
      }
    ]
  };

  const jobAndApplicationData = {
    labels: ['Jobs Posted', 'Applications'],
    datasets: [
      {
        data: [stats.jobsPosted, stats.applications],
        backgroundColor: ['blue', 'purple']
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.formattedValue}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '400px', margin: '0 10px' }}>
        <Doughnut data={applicationStatusData} options={chartOptions} />
      </div>
      <div style={{ width: '400px', margin: '0 10px' }}>
        <Bar data={jobAndApplicationData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StatsCharts;