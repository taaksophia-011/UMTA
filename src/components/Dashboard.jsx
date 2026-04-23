import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from 'recharts';
import { 
  LayoutDashboard, CheckCircle2, Clock, AlertCircle, ListTodo, 
  Search, Filter, Calendar, ChevronDown
} from 'lucide-react';
import { isPast, parseISO, format } from 'date-fns';
import { cn } from '../utils';
import assignmentsData from '../data/assignments.json';

const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];
const STATUS_COLORS = {
  'Completed': '#10b981',
  'In Progress': '#f59e0b',
  'Pending': '#64748b',
  'Overdue': '#ef4444'
};

const Dashboard = () => {
  const [filterAgency, setFilterAgency] = useState('All');
  
  const assignments = useMemo(() => assignmentsData, []);

  const stats = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'Completed').length;
    const inProgress = assignments.filter(a => a.status === 'In Progress').length;
    const pending = assignments.filter(a => a.status === 'Pending').length;
    const overdue = assignments.filter(a => 
      a.status === 'Pending' && isPast(parseISO(a.completionDate))
    ).length;

    return { total, completed, inProgress, pending, overdue };
  }, [assignments]);

  const agencyData = useMemo(() => {
    const agencies = [...new Set(assignments.map(a => a.agency))];
    return agencies.map(agency => ({
      name: agency,
      count: assignments.filter(a => a.agency === agency).length
    })).sort((a, b) => b.count - a.count);
  }, [assignments]);

  const statusData = useMemo(() => {
    const completed = assignments.filter(a => a.status === 'Completed').length;
    const notCompleted = assignments.length - completed;
    return [
      { name: 'Completed', value: completed },
      { name: 'Pending/In Progress', value: notCompleted }
    ];
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    if (filterAgency === 'All') return assignments;
    return assignments.filter(a => a.agency === filterAgency);
  }, [assignments, filterAgency]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-executive-slate flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-executive-blue" />
            UMTA Executive Pendency Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Real-time tracking of agency-wise work assignments and pendencies.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">{format(new Date(), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard 
          title="Total Assignments" 
          value={stats.total} 
          icon={<ListTodo className="w-6 h-6" />}
          className="bg-blue-50 border-blue-200 text-blue-700"
        />
        <KpiCard 
          title="Completed" 
          value={stats.completed} 
          icon={<CheckCircle2 className="w-6 h-6" />}
          className="bg-emerald-50 border-emerald-200 text-emerald-700"
        />
        <KpiCard 
          title="In Progress" 
          value={stats.inProgress} 
          icon={<Clock className="w-6 h-6" />}
          className="bg-amber-50 border-amber-200 text-amber-700"
        />
        <KpiCard 
          title="Pending" 
          value={stats.pending} 
          icon={<AlertCircle className="w-6 h-6" />}
          className="bg-slate-50 border-slate-200 text-slate-700"
        />
        <KpiCard 
          title="Overdue" 
          value={stats.overdue} 
          icon={<AlertCircle className="w-6 h-6 text-red-500" />}
          className="bg-red-50 border-red-200 text-red-700"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agency Comparison */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Workload Distribution by Agency</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agencyData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#1e3a8a" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Overall Status Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#cbd5e1" />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Drill-down Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Detailed Work Tracker</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={filterAgency}
                onChange={(e) => setFilterAgency(e.target.value)}
              >
                <option value="All">All Agencies</option>
                {agencyData.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Sr No</th>
                <th className="px-6 py-4 font-semibold">Agency</th>
                <th className="px-6 py-4 font-semibold">Work Description</th>
                <th className="px-6 py-4 font-semibold">Completion Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.map((assignment, index) => {
                const isOverdue = assignment.status === 'Pending' && isPast(parseISO(assignment.completionDate));
                return (
                  <tr key={assignment.id} className={cn(
                    "hover:bg-slate-50 transition-colors",
                    isOverdue && "bg-red-50/50 hover:bg-red-50"
                  )}>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">
                        {assignment.agency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 leading-relaxed max-w-md">
                      {assignment.work}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {format(parseISO(assignment.completionDate), 'MMM d, yyyy')}
                        {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={assignment.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon, className }) => (
  <div className={cn("p-4 rounded-xl border shadow-sm flex items-start justify-between", className)}>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
    <div className="opacity-80">
      {icon}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Completed': 'bg-emerald-100 text-emerald-700',
    'In Progress': 'bg-amber-100 text-amber-700',
    'Pending': 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
      styles[status] || 'bg-slate-100 text-slate-700'
    )}>
      {status}
    </span>
  );
};

export default Dashboard;
