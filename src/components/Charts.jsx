import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from 'recharts';

const Charts = ({ data }) => {
  // Bar Chart Data: Assignments per Agency
  const agencyCounts = data.reduce((acc, item) => {
    acc[item.agency] = (acc[item.agency] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(agencyCounts).map(agency => ({
    name: agency,
    workload: agencyCounts[agency]
  }));

  // Donut Chart Data: Status Breakdown
  const statusCounts = data.reduce((acc, item) => {
    const status = item.status === 'Completed' ? 'Completed' : 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'Completed', value: statusCounts['Completed'] || 0, color: '#22c55e' },
    { name: 'Pending', value: statusCounts['Pending'] || 0, color: '#ef4444' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">Workload Distribution by Agency</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="workload" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">Overall Status Breakdown</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
