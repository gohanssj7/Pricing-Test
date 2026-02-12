import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PricingRequest } from '../types';

interface DashboardProps {
    requests: PricingRequest[];
}

const data = [
  { name: 'Jan', revenue: 4000, agreements: 24 },
  { name: 'Feb', revenue: 3000, agreements: 13 },
  { name: 'Mar', revenue: 2000, agreements: 58 },
  { name: 'Apr', revenue: 2780, agreements: 39 },
  { name: 'May', revenue: 1890, agreements: 48 },
  { name: 'Jun', revenue: 2390, agreements: 38 },
  { name: 'Jul', revenue: 3490, agreements: 43 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ElementType; color: string }> = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
      <span className={`text-xs font-medium px-2 py-1 rounded-full mt-3 inline-block ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {trend} vs last month
      </span>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ requests }) => {
  const pendingApprovals = requests.filter(r => r.status === 'Sales Review' || r.status === 'Pricing Review').length;
  const publishedCount = requests.filter(r => r.status === 'Published' || r.status === 'Approved').length;
  
  // Just for demo, we add a base number to make the dashboard look populated
  const totalPublished = 1240 + publishedCount; 

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Executive Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Real-time insights across global pricing segments.</p>
        </div>
        <div className="text-sm text-gray-500">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue (YTD)" value="$24.5M" trend="+12.5%" icon={TrendingUp} color="bg-[#4D148C]" />
        <StatCard title="Pending Approvals" value={pendingApprovals.toString()} trend="+4" icon={Clock} color="bg-[#FF6600]" />
        <StatCard title="Agreements Published" value={totalPublished.toLocaleString()} trend="+8.2%" icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Margin At Risk" value="$1.2M" trend="-2.4%" icon={AlertCircle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend Analysis</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4D148C" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4D148C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4D148C" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Urgent Actions</h3>
          <div className="space-y-4">
             {/* Filter for urgent items based on real state if we wanted, for now using mock placeholders */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="h-2 w-2 rounded-full bg-[#FF6600] mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Review Pricing for Acme Corp</h4>
                  <p className="text-xs text-gray-500 mt-1">Margin dropping below 12% threshold. Requires VP approval.</p>
                  <span className="text-xs text-gray-400 mt-2 block">2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-[#4D148C] font-medium border border-[#4D148C] rounded-lg hover:bg-purple-50 transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;