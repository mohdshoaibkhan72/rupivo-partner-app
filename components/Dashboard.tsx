import React from 'react';
import { Referral, ReferralStatus, Payout } from '../types';
import { 
  Users, 
  FileCheck, 
  BadgeCheck, 
  Banknote, 
  TrendingUp 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  referrals: Referral[];
  payouts: Payout[];
}

const Dashboard: React.FC<DashboardProps> = ({ referrals, payouts }) => {
  // Calculate KPIs
  const totalReferrals = referrals.length;
  const applied = referrals.filter(r => r.status === ReferralStatus.APPLIED || r.status === ReferralStatus.APPROVED || r.status === ReferralStatus.DISBURSED).length;
  const approved = referrals.filter(r => r.status === ReferralStatus.APPROVED || r.status === ReferralStatus.DISBURSED).length;
  const disbursed = referrals.filter(r => r.status === ReferralStatus.DISBURSED).length;
  
  const totalEarnings = payouts.reduce((sum, p) => sum + p.earnedAmount, 0);

  const kpiCards = [
    { title: 'Total Referrals', value: totalReferrals, icon: <Users className="text-blue-500" />, sub: 'All leads registered' },
    { title: 'Applied', value: applied, icon: <FileCheck className="text-indigo-500" />, sub: 'Applications submitted' },
    { title: 'Approved', value: approved, icon: <BadgeCheck className="text-purple-500" />, sub: 'Lender approved' },
    { title: 'Disbursed', value: disbursed, icon: <Banknote className="text-emerald-500" />, sub: 'Loans funded' },
  ];

  // Mock data for the chart
  const chartData = [
    { name: 'Mon', leads: 4 },
    { name: 'Tue', leads: 3 },
    { name: 'Wed', leads: 7 },
    { name: 'Thu', leads: 5 },
    { name: 'Fri', leads: 8 },
    { name: 'Sat', leads: 2 },
    { name: 'Sun', leads: 4 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back, Partner! Here's your performance overview.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                <TrendingUp size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-emerald-800">Total Earnings</p>
                <p className="text-2xl font-bold text-emerald-700">₹{totalEarnings.toLocaleString('en-IN')}</p>
            </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                {card.icon}
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                 Metric
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
              <p className="text-sm font-medium text-slate-600 mt-1">{card.title}</p>
              <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Weekly Lead Volume</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{fill: '#f1f5f9'}}
              />
              <Bar dataKey="leads" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 text-sm">
        <strong>Compliance Notice:</strong> Please remember to communicate that eligibility and final loan terms are determined solely by the lending partners. Do not guarantee approvals or specific interest rates.
      </div>
    </div>
  );
};

export default Dashboard;
