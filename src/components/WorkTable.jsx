import React, { useState } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';

const WorkTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('All');
  const today = new Date();

  const agencies = ['All', ...new Set(data.map(item => item.agency))];

  const filteredData = data.filter(item => {
    const matchesSearch = item.work.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgency = selectedAgency === 'All' || item.agency === selectedAgency;
    return matchesSearch && matchesAgency;
  });

  const isOverdue = (item) => {
    return item.status === 'Pending' && new Date(item.completion_date) < today;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Detailed Work Tracker</h3>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search work..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
            >
              {agencies.map(agency => (
                <option key={agency} value={agency}>{agency}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Sr No</th>
              <th className="px-6 py-4">Agency</th>
              <th className="px-6 py-4">Work Description</th>
              <th className="px-6 py-4">Completion Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredData.map((item, index) => (
              <tr 
                key={item.id} 
                className={`${isOverdue(item) ? 'bg-red-50' : 'hover:bg-gray-50'} transition-colors`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.agency}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-md truncate md:whitespace-normal">
                  {item.work}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>{item.completion_date}</span>
                    {isOverdue(item) && (
                      <AlertCircle className="w-4 h-4 text-red-500" title="Overdue" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    item.status === 'In-Progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredData.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          No assignments found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default WorkTable;
