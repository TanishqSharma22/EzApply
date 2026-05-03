import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const statusColors = {
  open:   'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
};

const JobsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    company: searchParams.get('company') || '',
    location: searchParams.get('location') || '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const params = new URLSearchParams(filters);
        const res = await api.get(`/jobs?${params}`);
        setJobs(res.data.data.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filters]);

  const applyFilter = (e) => {
    e.preventDefault();
    const newFilters = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v.trim()) newFilters[k] = v.trim();
    });
    setSearchParams(newFilters);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading jobs...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Find Jobs</h1>
        <Link to="/seeker/dashboard"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
          My Dashboard
        </Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <form onSubmit={applyFilter} className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Company name" value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Location" value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit"
            className="sm:w-auto w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Search
          </button>
        </form>
      </div>
      {jobs.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          {Object.values(filters).some((v) => v.trim()) 
            ? 'No jobs found matching your search. Try different filters.'
            : 'No jobs posted yet.'}
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link to={`/seeker/jobs/${job.id}`} className="font-semibold text-gray-800 hover:text-blue-600">
                    {job.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{job.company} · {job.location || 'Remote'}</p>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-3">{job.description}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border font-medium mt-1 ml-4 ${statusColors[job.status]}`}>
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsList;
