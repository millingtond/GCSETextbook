import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function RagChart({ counts }) {
  const data = {
    labels: ['Confident', 'Needs Review', 'Not Confident'],
    datasets: [
      {
        label: '# of Topics',
        data: [counts.green, counts.amber, counts.red],
        backgroundColor: [
          'rgba(46, 204, 113, 0.7)',
          'rgba(243, 156, 18, 0.7)',
          'rgba(231, 76, 60, 0.7)',
        ],
        borderColor: [
          '#2ecc71',
          '#f39c12',
          '#e74c3c',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
        }
    }
  }

  return <div style={{height: '250px', position: 'relative'}}><Doughnut data={data} options={options} /></div>;
}

export default RagChart;
