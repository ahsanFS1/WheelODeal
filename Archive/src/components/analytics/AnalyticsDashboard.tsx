import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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
  const [metrics, setMetrics] = useState({
    visitors: 0,
    spins: 0,
    conversions: 0,
    conversionRate: 0,
    history: {
      labels: [],
      visitors: [],
      spins: [],
      conversions: [],
    },
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  useEffect(() => {
    // Load and configure Google Analytics
    const initializeGtag = (measurementId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(
          `script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`
        );

        if (existingScript) {
          console.warn('Google Analytics script is already loaded.');
          resolve(); // Resolve if the script is already present
          return;
        }

        console.log('Loading Google Analytics script...');
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        script.onload = () => {
          console.log('Google Analytics script loaded successfully.');

          // Initialize the dataLayer and gtag
          window.dataLayer = window.dataLayer || [];
          window.gtag = (...args: any[]) => {
            window.dataLayer!.push(args);
          };

          // Configure Google Analytics with debug mode
          window.gtag('js', new Date());
          window.gtag('config', measurementId, {
            debug_mode: true, // Enable debug mode
          });

          console.log('Google Analytics initialized.');
          resolve();
        };

        script.onerror = () => {
          console.error('Failed to load Google Analytics script.');
          reject();
        };
      });
    };

    const measurementId = 'G-28B7K98MKT';

    // Initialize Google Analytics and ensure `gtag` is ready
    initializeGtag(measurementId)
      .then(() => {
        // Track the current pageview
        if (window.gtag) {
          window.gtag('config', measurementId, {
            page_path: `/wheel/${pageId}`,
            debug_mode: true,
          });
          console.log(`Pageview tracked for: /wheel/${pageId}`);
        } else {
          console.warn('gtag is not defined. Ensure Google Analytics is initialized.');
        }

        // Send a test event for debugging
        if (window.gtag) {
          window.gtag('event', 'test_event', {
            event_category: 'Debugging',
            event_label: 'Test Event for Debugging',
            value: 123,
          });
          console.log('Test event sent to Google Analytics.');
        } else {
          console.warn('gtag is not defined. Cannot send test event.');
        }
      })
      .catch(() => {
        console.error('Google Analytics initialization failed.');
      });

    // Fetch metrics for the current page
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `/api/analytics?pageId=${pageId}&startDate=${dateRange.startDate.toISOString().split('T')[0]}&endDate=${dateRange.endDate.toISOString().split('T')[0]}`
        );

        const result = await response.json();
        console.log(result.data);
        if (result.success) {
          setMetrics({
            ...metrics,
            ...result.data,
            history: result.data.history || {
              labels: [],
              visitors: [],
              spins: [],
              conversions: [],
            },
          });
        } else {
          console.error('Error fetching metrics:', result.message);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, [pageId, dateRange]);

  const chartData = {
    labels: metrics.history.labels || [],
    datasets: [
      {
        label: 'Visitors',
        data: metrics.history.visitors || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Spins',
        data: metrics.history.spins || [],
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
      },
      {
        label: 'Conversions',
        data: metrics.history.conversions || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="startDate" className="text-sm font-medium text-gray-400">
            Start Date:
          </label>
          <input
            id="startDate"
            type="date"
            value={dateRange.startDate.toISOString().split('T')[0]}
            onChange={(e) =>
              setDateRange({
                ...dateRange,
                startDate: new Date(e.target.value),
              })
            }
            className="ml-2 bg-gray-800 text-white p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="text-sm font-medium text-gray-400">
            End Date:
          </label>
          <input
            id="endDate"
            type="date"
            value={dateRange.endDate.toISOString().split('T')[0]}
            onChange={(e) =>
              setDateRange({
                ...dateRange,
                endDate: new Date(e.target.value),
              })
            }
            className="ml-2 bg-gray-800 text-white p-2 rounded"
          />
        </div>
      </div>
      <div className="bg-[#1B1B21] p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-[#D3D3DF] mb-4">Performance Over Time</h3>
        <div className="h-[400px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(195, 58, 255, 0.1)' },
                },
                x: {
                  grid: { color: 'rgba(195, 58, 255, 0.1)' },
                },
              },
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#D3D3DF' },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
