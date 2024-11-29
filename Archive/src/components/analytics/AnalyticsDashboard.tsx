import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { analytics } from '../../lib/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  pageId: string;
}

export const AnalyticsDashboard: React.FC<Props> = ({ pageId }) => {
  const [metrics, setMetrics] = React.useState({
    visitors: 0,
    spins: 0,
    conversions: 0,
    conversionRate: 0,
    history: {
      labels: [],
      visitors: [],
      spins: [],
      conversions: []
    }
  });

  React.useEffect(() => {
    const fetchMetrics = async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const data = await analytics.getPageMetrics(pageId, startDate, endDate);
      setMetrics(data);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [pageId]);

  const chartData = {
    labels: metrics.history.labels,
    datasets: [
      {
        label: 'Visitors',
        data: metrics.history.visitors,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Spins',
        data: metrics.history.spins,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      },
      {
        label: 'Conversions',
        data: metrics.history.conversions,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1B1B21] p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-[#D3D3DF] mb-2">Total Visitors</h3>
          <p className="text-3xl font-bold text-[#C33AFF]">{metrics.visitors}</p>
        </div>
        <div className="bg-[#1B1B21] p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-[#D3D3DF] mb-2">Total Spins</h3>
          <p className="text-3xl font-bold text-[#C33AFF]">{metrics.spins}</p>
        </div>
        <div className="bg-[#1B1B21] p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-[#D3D3DF] mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-[#C33AFF]">{metrics.conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-[#1B1B21] p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-[#D3D3DF] mb-4">Performance Over Time</h3>
        <div className="h-[400px]">
          <Line data={chartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(195, 58, 255, 0.1)'
                }
              },
              x: {
                grid: {
                  color: 'rgba(195, 58, 255, 0.1)'
                }
              }
            },
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  color: '#D3D3DF'
                }
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};