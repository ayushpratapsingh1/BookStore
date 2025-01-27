import { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle, Users, Loader as LoaderIcon } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex justify-between">
      <div>
        <p className="text-gray-600 mb-1">{title}</p>
        <h3 className="text-3xl font-bold" style={{ color }}>{value}</h3>
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  </div>
);

const Statistics = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    pendingApprovals: 0,
    booksByGenre: {},
    recentUploads: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const generateChartData = (data) => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = [
      '#FF9F1C',
      '#FFBF69',
      '#CB997E',
      '#DDB892',
      '#B7B7A4',
      '#A5A58D',
    ];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(color => `${color}dd`),
          borderWidth: 1,
        },
      ],
    };
  };

  const generateMonthlyData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Downloads',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: '#FF9F1C',
      },
      {
        label: 'Uploads',
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: '#FFBF69',
      },
    ],
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <LoaderIcon className="animate-spin" size={24} />
          <span>Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#121212]">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your library's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Books" 
          value={stats.totalBooks} 
          icon={BookOpen} 
          color="#FF9F1C"
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingApprovals} 
          icon={Clock} 
          color="#FFBF69"
        />
        <StatCard 
          title="Approved Books" 
          value={stats.totalBooks - stats.pendingApprovals} 
          icon={CheckCircle} 
          color="#4CAF50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Books by Genre</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut 
              data={generateChartData(stats.booksByGenre)} 
              options={chartOptions}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Monthly Activity</h3>
          <div className="h-[300px]">
            <Bar 
              data={generateMonthlyData()} 
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6">Genre Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(stats.booksByGenre).map(([genre, count]) => (
            <div key={genre} className="bg-[#FFE8D6] rounded-lg p-4 hover:shadow-md transition-all">
              <p className="text-[#121212] capitalize mb-2">{genre}</p>
              <p className="text-2xl font-bold text-[#FF9F1C]">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
