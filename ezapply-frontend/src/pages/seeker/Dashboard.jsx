import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axios';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const SeekerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/analytics/seeker');
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

  const { overview, statusBreakdown, recentActivity } = data;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">My Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Applied',  value: overview.total_applied },
          { label: 'Shortlisted',    value: overview.total_shortlisted },
          { label: 'Hired',          value: overview.total_hired },
          { label: 'Success Rate',   value: `${overview.success_rate_pct || 0}%` },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Applications by Status</h2>
          {statusBreakdown.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="count" nameKey="status"
                  cx="50%" cy="50%" outerRadius={80}
                  label={({ status }) => status.replace('_', ' ')}>
                  {statusBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-gray-700 font-medium">{activity.job_title}</p>
                    <p className="text-gray-400 text-xs">
                      {activity.company} · Status changed to{' '}
                      <span className="font-medium">{activity.new_status.replace('_', ' ')}</span>
                    </p>
                    <p className="text-gray-400 text-xs">{new Date(activity.changed_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
