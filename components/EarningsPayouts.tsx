import React, { useState } from 'react';
import { Payout } from '../types';
import { 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Filter,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Earnings View ---
export const Earnings: React.FC<{ payouts: Payout[] }> = ({ payouts }) => {
  const totalEarned = payouts.reduce((sum, p) => sum + p.earnedAmount, 0);
  const paidAmount = payouts.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.earnedAmount, 0);
  const pendingAmount = payouts.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.earnedAmount, 0);

  // Mock monthly data for chart
  const data = [
    { name: 'Jan', earnings: 4000 },
    { name: 'Feb', earnings: 3000 },
    { name: 'Mar', earnings: 2000 },
    { name: 'Apr', earnings: 2780 },
    { name: 'May', earnings: 1890 },
    { name: 'Jun', earnings: 2390 },
    { name: 'Jul', earnings: 3490 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Earnings Overview</h1>
           <p className="text-slate-500">Analytics of your commissions over time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-emerald-600 rounded-xl p-6 text-white shadow-lg shadow-emerald-900/10">
          <p className="text-emerald-100 font-medium mb-1">Total Lifetime Earnings</p>
          <h2 className="text-4xl font-bold">₹{totalEarned.toLocaleString('en-IN')}</h2>
          <div className="mt-4 flex items-center text-sm text-emerald-100 bg-emerald-700/50 p-2 rounded-lg w-fit">
            <TrendingUp size={16} className="mr-2" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium mb-1">Paid Out</p>
          <h2 className="text-3xl font-bold text-slate-900">₹{paidAmount.toLocaleString('en-IN')}</h2>
          <div className="mt-4 flex items-center text-sm text-slate-500">
             <CheckCircle2 size={16} className="mr-2 text-emerald-500" />
             <span>Processed successfully</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium mb-1">Pending Clearance</p>
          <h2 className="text-3xl font-bold text-slate-900">₹{pendingAmount.toLocaleString('en-IN')}</h2>
           <div className="mt-4 flex items-center text-sm text-slate-500">
             <Clock size={16} className="mr-2 text-amber-500" />
             <span>Est. clear: 3-5 days</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Earnings Trend</h3>
        <div className="h-64 md:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
              <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
           <h3 className="text-lg font-bold text-slate-800">Commission Breakdown</h3>
           <p className="text-sm text-slate-500">How your earnings are calculated per disbursal.</p>
        </div>
        
        {/* Mobile List View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {payouts.map(p => (
            <div key={p.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{p.referralId}</span>
                <span className="text-emerald-600 font-bold">₹{p.earnedAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                 <span>On: ₹{p.disbursedAmount.toLocaleString('en-IN')}</span>
                 <span>Rate: {(p.commissionRate * 100).toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Referral ID</th>
                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Disbursed Amt.</th>
                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">x</th>
                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Rate</th>
                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">=</th>
                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Total Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{p.referralId}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 text-right font-medium">₹{p.disbursedAmount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 text-center">×</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-center">{(p.commissionRate * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 text-sm text-slate-400 text-center">=</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 font-bold text-right">₹{p.earnedAmount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Payouts View ---
type DateRangeOption = 'all' | '30days' | 'quarter' | 'custom';

export const Payouts: React.FC<{ payouts: Payout[] }> = ({ payouts }) => {
  const [rangeType, setRangeType] = useState<DateRangeOption>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter Logic
  const filteredPayouts = payouts.filter(p => {
    if (!p.payoutDate) return false;
    const pDate = new Date(p.payoutDate);
    const now = new Date();

    if (rangeType === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return pDate >= thirtyDaysAgo && pDate <= now;
    } 
    else if (rangeType === 'quarter') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(now.getDate() - 90);
      return pDate >= ninetyDaysAgo && pDate <= now;
    }
    else if (rangeType === 'custom' && startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      e.setHours(23, 59, 59); // include end of day
      return pDate >= s && pDate <= e;
    }
    return true; // 'all'
  });

  const handleExportCSV = () => {
    if (filteredPayouts.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = ["Referral ID", "Disbursed Amount", "Commission Rate", "Amount Earned", "Status", "Payout Date"];
    const rows = filteredPayouts.map(p => [
      p.referralId,
      p.disbursedAmount,
      `${(p.commissionRate * 100).toFixed(2)}%`,
      p.earnedAmount,
      p.status,
      p.payoutDate ? new Date(p.payoutDate).toLocaleDateString('en-IN') : '-'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payouts_history.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payout History</h1>
            <p className="text-slate-500">Detailed log of all commission payments.</p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="inline sm:hidden">CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
            <Filter size={16} />
            <span>Filter By Date:</span>
          </div>
          
          <select 
            value={rangeType} 
            onChange={(e) => setRangeType(e.target.value as DateRangeOption)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="all">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {rangeType === 'custom' && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-slate-400">-</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* MOBILE: Payout Cards */}
      <div className="block md:hidden space-y-3">
        {filteredPayouts.map((payout) => (
          <div key={payout.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-slate-500 font-mono mb-1">Ref: {payout.referralId}</p>
                <h3 className="text-xl font-bold text-emerald-600">₹{payout.earnedAmount.toLocaleString('en-IN')}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                payout.status === 'Paid' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {payout.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                {payout.status}
              </span>
            </div>
            
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm text-slate-600">
               <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Payout Date</span>
                  <span className="font-medium">{payout.payoutDate ? new Date(payout.payoutDate).toLocaleDateString('en-IN') : 'Pending'}</span>
               </div>
               <div className="text-right flex flex-col items-end">
                   <span className="text-xs text-slate-400">Commission</span>
                   <span className="font-medium">{(payout.commissionRate * 100).toFixed(1)}% of ₹{(payout.disbursedAmount/1000).toFixed(0)}k</span>
               </div>
            </div>
          </div>
        ))}
        {filteredPayouts.length === 0 && (
          <div className="text-center py-10 text-slate-400">No payouts found.</div>
        )}
      </div>

      {/* DESKTOP: Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Disbursed Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Commission %</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount Earned</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Payout Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    ₹{payout.disbursedAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {(payout.commissionRate * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">
                    ₹{payout.earnedAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      payout.status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {payout.status === 'Paid' ? <CheckCircle2 size={12} className="mr-1"/> : <Clock size={12} className="mr-1"/>}
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    {payout.payoutDate ? new Date(payout.payoutDate).toLocaleDateString('en-IN') : '-'}
                  </td>
                </tr>
              ))}
              {filteredPayouts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No payouts found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 mb-20 md:mb-0">
        <p className="flex items-start gap-2">
          <span className="font-bold text-slate-700">Note:</span> 
          <span>If you see a discrepancy in your payout status, please contact the admin support offline. Disputes cannot be raised through this portal.</span>
        </p>
      </div>
    </div>
  );
};
