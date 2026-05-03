import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../api/axios';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const RecruiterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/analytics/recruiter');
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading dashboard...</div>;
  if (!data) return null;

  const { overview, statusBreakdown, topJobs, dailyApplications, avgDaysToHire } = data;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Recruiter Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Jobs',       value: overview.total_jobs },
          { label: 'Open Jobs',        value: overview.open_jobs },
          { label: 'Total Applicants', value: overview.total_applications },
          { label: 'Avg Days to Hire', value: avgDaysToHire ?? '—' },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Applications — Last 30 Days</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dailyApplications}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day"
              tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              tick={{ fontSize: 11 }} interval={4} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip labelFormatter={(d) => new Date(d).toLocaleDateString()} formatter={(v) => [v, 'Applications']} />
            <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Applications by Status</h2>
          {statusBreakdown.length === 0 ? (
            <p className="text-sm text-gray-400">No applications yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="count" nameKey="status"
                  cx="50%" cy="50%" outerRadius={80}
                  label={({ status }) => status.replace('_', ' ')}>
                  {statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Top Jobs by Applications</h2>
          {topJobs.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {topJobs.map((job, i) => (
                <div key={job.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs w-4">{i + 1}</span>
                    <span className="text-gray-700 font-medium truncate max-w-[180px]">{job.title}</span>
                  </div>
                  <span className="text-blue-600 font-semibold">{job.application_count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
