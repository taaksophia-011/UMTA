import React from 'react';
import { Layout, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const KpiCards = ({ data }) => {
  const today = new Date();
  
  const total = data.length;
  const completed = data.filter(item => item.status === 'Completed').length;
  const inProgress = data.filter(item => item.status === 'In-Progress').length;
  const overdue = data.filter(item => {
    const isPending = item.status === 'Pending';
    const isPastDate = new Date(item.completion_date) < today;
    return isPending && isPastDate;
  }).length;

  const cards = [
    { title: 'Total Assignments', value: total, icon: Layout, color: 'bg-blue-500' },
    { title: 'Completed', value: completed, icon: CheckCircle, color: 'bg-green-500' },
    { title: 'In-Progress', value: inProgress, icon: Clock, color: 'bg-yellow-500' },
    { title: 'Overdue', value: overdue, icon: AlertTriangle, color: 'bg-red-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border border-gray-100">
          <div className={`${card.color} p-3 rounded-lg`}>
            <card.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
