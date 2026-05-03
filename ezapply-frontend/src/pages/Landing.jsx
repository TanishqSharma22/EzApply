 import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EzApply
            </h1>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent leading-tight mb-6">
              One-click job<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">applications</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Track your job search, get analytics on your applications, and get hired faster with EzApply.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                Start Free
              </Link>
              <Link to="/login"
                className="border-2 border-gray-200 bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-300 transition">
                Login
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">500K+</div>
                <div className="text-sm text-gray-500">Applications tracked</div>
              </div>
              <div className="text-center p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                <div className="text-sm text-gray-500">User retention</div>
              </div>
              <div className="text-center p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">1.2K</div>
                <div className="text-sm text-gray-500">Companies</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-2xl p-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Applied</div>
                  <div className="text-2xl font-bold text-green-600">23</div>
                </div>
                <div className="bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl p-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Shortlisted</div>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-2xl p-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Success Rate</div>
                  <div className="text-2xl font-bold text-yellow-600">13%</div>
                </div>
                <div className="bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-2xl p-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Avg Response</div>
                  <div className="text-2xl font-bold text-purple-600">4 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why recruiters love EzApply</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamlined hiring, quality candidates, and complete visibility into your hiring pipeline.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Quality Candidates',  desc: 'Pre-vetted applicants with cover letters', icon: '👥' },
              { title: 'Fast Hiring',        desc: 'Complete your hiring 3x faster', icon: '⚡' },
              { title: 'Full Analytics',     desc: 'Track applications and hiring velocity', icon: '📊' },
              { title: 'Easy Management',    desc: 'One-click status updates', icon: '✨' },
              { title: 'Team Collaboration', desc: 'Share candidates with your team', icon: '👨‍👩‍👧‍👦' },
              { title: 'Mobile Ready',       desc: 'Review anywhere, anytime', icon: '📱' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-8 rounded-2xl hover:bg-gray-50 transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
