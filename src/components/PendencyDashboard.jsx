import React from 'react';

const PendencyDashboard = ({ data }) => {
  const { date, summary } = data;

  const getStatusInfo = (count) => {
    if (count >= 11) return { label: 'Critical', color: 'bg-red-500', dot: 'bg-red-500', bar: 'bg-red-400', text: 'text-red-600' };
    if (count >= 8) return { label: 'High', color: 'bg-orange-500', dot: 'bg-orange-500', bar: 'bg-orange-400', text: 'text-orange-600' };
    if (count >= 4) return { label: 'Moderate', color: 'bg-yellow-500', dot: 'bg-yellow-500', bar: 'bg-yellow-400', text: 'text-yellow-600' };
    return { label: 'Low', color: 'bg-green-500', dot: 'bg-green-500', bar: 'bg-green-400', text: 'text-green-600' };
  };

  const maxCount = summary.length > 0 ? Math.max(...summary.map(s => s.count)) : 100;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-5xl mx-auto border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Work Pendency Dashboard</h1>
          <p className="text-gray-500 mt-1 text-lg font-medium">Ludhiana District - Agency Status</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-lg text-gray-500 font-semibold text-sm shadow-sm">
          {date || '27-Apr-2026'}
        </div>
      </div>

      {/* Legend & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-gray-50 pb-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-bold text-gray-600">Critical (&gt;=11)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm font-bold text-gray-600">High (8-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm font-bold text-gray-600">Moderate (4-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-bold text-gray-600">Low (&lt;4)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-5 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100 cursor-pointer">
            Executive
          </div>
          <div className="px-5 py-1.5 rounded-lg bg-purple-50 text-purple-600 font-bold text-sm border border-purple-100 cursor-pointer opacity-70">
            Operations
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {summary.map((item, index) => {
          const status = getStatusInfo(item.count);
          const barWidth = `${(item.count / maxCount) * 100}%`;

          return (
            <div key={index} className="flex items-center gap-6 group">
              <div className="w-8 text-xl font-bold text-gray-300 group-hover:text-gray-400 transition-colors">
                {index + 1}
              </div>

              <div className="flex-1 flex items-center justify-between gap-8">
                <div className="w-48">
                  <h3 className="font-extrabold text-gray-800 text-lg leading-tight truncate" title={item.name}>
                    {item.name.split(' (')[0]}
                  </h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-0.5">
                    {item.name.includes('(') ? item.name.split('(')[1].replace(')', '') : 'District'}
                  </p>
                </div>

                <div className="w-32">
                  <span className={`px-4 py-1 rounded-lg ${index % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'} font-bold text-xs border ${index % 2 === 0 ? 'border-blue-100' : 'border-purple-100'}`}>
                    Agency
                  </span>
                </div>

                <div className="flex-1 h-10 bg-gray-100 rounded-xl overflow-hidden relative">
                  <div
                    className={`h-full ${status.bar} rounded-xl transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: barWidth }}
                  ></div>
                </div>

                <div className="flex items-center gap-6 w-24 justify-end">
                  <div className={`w-2.5 h-2.5 rounded-full ${status.dot} shadow-sm`}></div>
                  <div className="text-2xl font-black text-gray-800 w-10 text-right">
                    {item.count}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Scale */}
      <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
        <div className="text-gray-400 text-sm font-bold">
          Scale: 0 &rarr; {maxCount} cases
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Low</span>
          <div className="flex gap-1.5">
            <div className="w-8 h-2.5 rounded-sm bg-green-500"></div>
            <div className="w-8 h-2.5 rounded-sm bg-yellow-500"></div>
            <div className="w-8 h-2.5 rounded-sm bg-orange-500"></div>
            <div className="w-8 h-2.5 rounded-sm bg-red-500"></div>
          </div>
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Critical</span>
        </div>
      </div>
    </div>
  );
};

export default PendencyDashboard;
