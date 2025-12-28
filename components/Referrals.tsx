import React, { useState } from 'react';
import { Referral, ReferralStatus, CommissionStatus } from '../types';
import { 
  Search, Filter, Phone, Check, ChevronDown, X, Calendar, Hash, DollarSign, 
  CreditCard, User, Clock, ChevronRight, Plus, Upload, FileSpreadsheet, Download, 
  Building2, Gauge, FileText, BadgeCheck, Banknote 
} from 'lucide-react';

interface ReferralsProps {
  referrals: Referral[];
  onAddReferral: (newReferrals: Referral[]) => void;
}

const Referrals: React.FC<ReferralsProps> = ({ referrals, onAddReferral }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoanType, setSelectedLoanType] = useState<string>('All');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // Form States
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadMobile, setNewLeadMobile] = useState('');
  const [newLeadType, setNewLeadType] = useState('Personal Loan');
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const statusSteps = [
    ReferralStatus.REGISTERED,
    ReferralStatus.APPLIED,
    ReferralStatus.APPROVED,
    ReferralStatus.DISBURSED
  ];

  // Extract unique loan types
  const loanTypes = ['All', ...Array.from(new Set(referrals.map(r => r.loanType).filter(Boolean)))];

  // Filter logic
  const filteredReferrals = referrals.filter(r => {
    const matchesSearch = r.leadName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.maskedMobile.includes(searchTerm);
    const matchesType = selectedLoanType === 'All' || r.loanType === selectedLoanType;
    
    return matchesSearch && matchesType;
  });

  const getStepIndex = (status: ReferralStatus) => {
    return statusSteps.indexOf(status);
  };

  // --- Handlers ---
  
  const handleAddSingleLead = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newLeadMobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const newReferral: Referral = {
      id: `ref_${Date.now()}`,
      leadName: newLeadName,
      maskedMobile: newLeadMobile, 
      date: new Date().toISOString(),
      status: ReferralStatus.REGISTERED,
      commissionStatus: CommissionStatus.PENDING,
      loanType: newLeadType
    };

    onAddReferral([newReferral]);
    
    // Reset & Close
    setNewLeadName('');
    setNewLeadMobile('');
    setNewLeadType('Personal Loan');
    setShowAddModal(false);
  };

  const handleBulkUpload = () => {
    if (!bulkFile) return;
    
    setUploading(true);
    
    // Simulate API upload delay
    setTimeout(() => {
      // Mock data parsing from "CSV"
      const mockBulkLeads: Referral[] = [
        {
          id: `ref_bulk_${Date.now()}_1`,
          leadName: 'Rohan Mehta',
          maskedMobile: '9988776655',
          date: new Date().toISOString(),
          status: ReferralStatus.REGISTERED,
          commissionStatus: CommissionStatus.PENDING,
          loanType: 'Business Loan'
        },
        {
          id: `ref_bulk_${Date.now()}_2`,
          leadName: 'Priya Sharma',
          maskedMobile: '9123456789',
          date: new Date().toISOString(),
          status: ReferralStatus.REGISTERED,
          commissionStatus: CommissionStatus.PENDING,
          loanType: 'Home Loan'
        }
      ];

      onAddReferral(mockBulkLeads);
      setUploading(false);
      setBulkFile(null);
      setShowBulkModal(false);
    }, 1500);
  };

  // --- Helpers ---

  const ReferralStepper = ({ status, compact = false }: { status: ReferralStatus, compact?: boolean }) => {
    const currentIdx = getStepIndex(status);
    
    const steps = [
        { label: 'Registered', full: ReferralStatus.REGISTERED, icon: User },
        { label: 'Applied', full: ReferralStatus.APPLIED, icon: FileText },
        { label: 'Approved', full: ReferralStatus.APPROVED, icon: BadgeCheck },
        { label: 'Disbursed', full: ReferralStatus.DISBURSED, icon: Banknote },
    ];

    if (compact) {
        // Mobile View: simplified status
        return (
            <div className="mt-4 pt-3 border-t border-slate-50">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Stage</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                        status === ReferralStatus.DISBURSED ? 'bg-emerald-100 text-emerald-700' :
                        status === ReferralStatus.APPROVED ? 'bg-indigo-100 text-indigo-700' :
                        status === ReferralStatus.APPLIED ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                        {status === ReferralStatus.DISBURSED && <Banknote size={12} />}
                        {status === ReferralStatus.APPROVED && <BadgeCheck size={12} />}
                        {status === ReferralStatus.APPLIED && <FileText size={12} />}
                        {status === ReferralStatus.REGISTERED && <User size={12} />}
                        {status}
                    </span>
                </div>
                {/* Mini Stepper for Mobile */}
                <div className="flex items-center gap-1">
                    {steps.map((step, idx) => (
                        <div key={idx} className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${idx <= currentIdx ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    ))}
                </div>
            </div>
        );
    }

    // Desktop View: Enhanced Stepper with Icons
    return (
        <div className="w-full min-w-[320px] px-2">
            <div className="relative flex items-center justify-between">
                {/* Background Track */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full -z-10" />
                
                {/* Active Progress Track */}
                <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full -z-10 transition-all duration-500 ease-out"
                    style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => {
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    const StepIcon = step.icon;
                    
                    return (
                        <div key={step.full} className="relative flex flex-col items-center group">
                            {/* Step Circle */}
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-white
                                ${isCompleted 
                                    ? 'border-emerald-500 text-emerald-600 shadow-sm' 
                                    : 'border-slate-300 text-slate-300'
                                }
                                ${isCurrent ? 'ring-4 ring-emerald-100 scale-110 border-emerald-600 bg-emerald-600 text-white shadow-md' : ''}
                                ${isCompleted && !isCurrent ? 'bg-emerald-50' : ''}
                            `}>
                                <StepIcon size={14} strokeWidth={isCurrent ? 2.5 : 2} />
                            </div>
                            
                            {/* Pulse effect for current step */}
                            {isCurrent && (
                                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-ping -z-0"></span>
                            )}
                            
                            {/* Label */}
                            <span className={`
                                absolute -bottom-6 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300
                                ${isCurrent ? 'text-emerald-700 scale-105 font-extrabold translate-y-0.5' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}
                            `}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Spacer for labels */}
            <div className="h-6" />
        </div>
    );
  };

  const getTimelineDate = (baseDate: string, offsetDays: number, currentStatus: ReferralStatus, stepStatus: ReferralStatus) => {
    const currentIndex = getStepIndex(currentStatus);
    const stepIndex = getStepIndex(stepStatus);

    if (stepIndex > currentIndex) return null; // Not reached yet

    const date = new Date(baseDate);
    date.setDate(date.getDate() + offsetDays);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (score >= 650) return 'text-amber-700 bg-amber-50 border-amber-100';
    return 'text-red-700 bg-red-50 border-red-100';
  };

  return (
    <div className="space-y-4 md:space-y-6 relative">
      
      {/* Header with Title and Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Referrals</h1>
          <p className="text-slate-500">Track the status of your leads from registration to disbursal.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-3">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Lead</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button 
              onClick={() => setShowBulkModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium whitespace-nowrap"
            >
              <FileSpreadsheet size={18} />
              <span className="hidden sm:inline">Bulk Upload</span>
              <span className="sm:hidden">Bulk</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 xl:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-slate-400" />
             </div>
             <select
                value={selectedLoanType}
                onChange={(e) => setSelectedLoanType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer w-full sm:w-auto shadow-sm"
             >
                {loanTypes.map(type => (
                   <option key={type} value={type as string}>{type}</option>
                ))}
             </select>
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown size={14} className="text-slate-400" />
             </div>
          </div>
        </div>
      </div>

      {/* MOBILE: Card View */}
      <div className="block md:hidden space-y-3">
        {filteredReferrals.map((referral) => (
          <div 
            key={referral.id}
            onClick={() => setSelectedReferral(referral)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900">{referral.leadName}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                    {referral.loanType || 'Loan'}
                  </span>
                  <span>•</span>
                  <span>{new Date(referral.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                </div>
              </div>
            </div>
            
            <ReferralStepper status={referral.status} compact={true} />

            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Loan Amount</p>
                <p className="text-lg font-bold text-slate-800">
                  {referral.loanAmount ? `₹${referral.loanAmount.toLocaleString('en-IN')}` : '-'}
                </p>
              </div>
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                Details <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
        {filteredReferrals.length === 0 && (
          <div className="text-center py-10 text-slate-400">No referrals found.</div>
        )}
      </div>

      {/* DESKTOP: Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[40%]">Status Progress</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Disbursal</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Comm.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReferrals.map((referral) => (
                <tr 
                  key={referral.id} 
                  onClick={() => setSelectedReferral(referral)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">{referral.leadName}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Phone size={12} />
                      {referral.maskedMobile}
                    </div>
                    {referral.loanType && (
                      <div className="mt-1 inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-medium rounded-full border border-indigo-100">
                        {referral.loanType}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(referral.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <ReferralStepper status={referral.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {referral.loanAmount ? (
                      <span className="font-medium text-slate-900">₹{referral.loanAmount.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                       referral.commissionStatus === CommissionStatus.PAID ? 'text-emerald-700 bg-emerald-50' : 
                       referral.commissionStatus === CommissionStatus.PENDING ? 'text-amber-700 bg-amber-50' :
                       'text-slate-400 bg-slate-50'
                     }`}>
                      {referral.commissionStatus}
                     </span>
                  </td>
                </tr>
              ))}
              
              {filteredReferrals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No referrals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD LEAD MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl shadow-2xl p-6 animate-slide-up md:animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-slate-900">Add New Lead</h2>
                 <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleAddSingleLead} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lead Name *</label>
                    <input 
                      type="text" 
                      required
                      value={newLeadName}
                      onChange={(e) => setNewLeadName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+91</span>
                      <input 
                        type="tel" 
                        required
                        maxLength={10}
                        pattern="[0-9]{10}"
                        value={newLeadMobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setNewLeadMobile(val);
                        }}
                        placeholder="00000 00000"
                        className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Loan Type</label>
                    <select
                      value={newLeadType}
                      onChange={(e) => setNewLeadType(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                       <option value="Personal Loan">Personal Loan</option>
                       <option value="Business Loan">Business Loan</option>
                       <option value="Home Loan">Home Loan</option>
                       <option value="Vehicle Loan">Vehicle Loan</option>
                    </select>
                 </div>

                 <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                    >
                       Submit Lead
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* --- BULK UPLOAD MODAL --- */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl p-6 animate-slide-up md:animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-xl font-bold text-slate-900">Bulk Upload Leads</h2>
                   <p className="text-sm text-slate-500">Upload CSV to add multiple leads at once.</p>
                 </div>
                 <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                 </button>
              </div>

              <div className="space-y-6">
                 {/* Dropzone Area */}
                 <div className={`
                    border-2 border-dashed rounded-xl p-8 text-center transition-colors
                    ${bulkFile ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 bg-slate-50'}
                 `}>
                    <input 
                      type="file" 
                      id="fileInput"
                      accept=".csv, .xlsx"
                      className="hidden"
                      onChange={(e) => e.target.files && setBulkFile(e.target.files[0])}
                    />
                    
                    {!bulkFile ? (
                      <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 mb-3">
                           <Upload size={24} />
                        </div>
                        <p className="font-medium text-slate-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">CSV or Excel (Max 5MB)</p>
                      </label>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-emerald-600 mb-3">
                           <FileSpreadsheet size={24} />
                        </div>
                        <p className="font-medium text-slate-900">{bulkFile.name}</p>
                        <button 
                          onClick={() => setBulkFile(null)} 
                          className="text-xs text-red-500 font-medium mt-2 hover:underline"
                        >
                          Remove file
                        </button>
                      </div>
                    )}
                 </div>

                 <div className="flex justify-between items-center text-sm">
                    <a href="#" className="text-emerald-600 font-medium hover:underline flex items-center gap-1">
                       <Download size={14} /> Download Sample CSV
                    </a>
                 </div>

                 <div className="pt-2">
                    <button 
                      onClick={handleBulkUpload}
                      disabled={!bulkFile || uploading}
                      className={`w-full py-3 font-bold rounded-lg transition-colors shadow-md flex items-center justify-center gap-2
                        ${!bulkFile || uploading ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'}
                      `}
                    >
                       {uploading ? (
                         <>Processing...</>
                       ) : (
                         <>Upload and Process</>
                       )}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- LEAD DETAILS MODAL (Existing) --- */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full md:max-w-2xl rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden animate-slide-up md:animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-start sticky top-0 z-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedReferral.leadName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 text-slate-700 uppercase tracking-wide`}>
                      {selectedReferral.status}
                    </span>
                    <span className="text-slate-400 text-sm">•</span>
                    <span className="text-slate-500 text-sm">{selectedReferral.loanType || 'General Loan'}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReferral(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-slate-400 text-xs uppercase font-bold mb-1 flex items-center gap-1">
                    <Hash size={12} /> Referral ID
                  </div>
                  <div className="text-slate-900 font-mono text-sm">{selectedReferral.id}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="text-slate-400 text-xs uppercase font-bold mb-1 flex items-center gap-1">
                    <Phone size={12} /> Contact
                  </div>
                  <div className="text-slate-900 text-sm font-medium">{selectedReferral.maskedMobile}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="text-slate-400 text-xs uppercase font-bold mb-1 flex items-center gap-1">
                    <Calendar size={12} /> Registered
                  </div>
                  <div className="text-slate-900 text-sm">{new Date(selectedReferral.date).toLocaleDateString('en-IN')}</div>
                </div>
                <div className={`p-3 rounded-lg border ${selectedReferral.commissionStatus === CommissionStatus.PAID ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                   <div className={`text-xs uppercase font-bold mb-1 flex items-center gap-1 ${selectedReferral.commissionStatus === CommissionStatus.PAID ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <DollarSign size={12} /> Commission
                  </div>
                  <div className={`text-sm font-bold ${selectedReferral.commissionStatus === CommissionStatus.PAID ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {selectedReferral.commissionStatus}
                  </div>
                </div>
              </div>
              
              {/* Loan Assessment (Credit Score & Lender) */}
              {(selectedReferral.creditScore || selectedReferral.assignedLender) && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Loan Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedReferral.assignedLender && (
                      <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
                         <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                           <Building2 size={20} />
                         </div>
                         <div>
                            <p className="text-xs text-slate-500 font-medium uppercase">Assigned Lender</p>
                            <p className="text-lg font-bold text-slate-800">{selectedReferral.assignedLender}</p>
                         </div>
                      </div>
                    )}
                    
                    {selectedReferral.creditScore && (
                      <div className={`p-4 border rounded-xl flex items-center gap-3 ${getCreditScoreColor(selectedReferral.creditScore)}`}>
                         <div className="p-2 bg-white/50 rounded-lg">
                           <Gauge size={20} />
                         </div>
                         <div>
                            <p className="text-xs font-medium uppercase opacity-80">Credit Score</p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-bold">{selectedReferral.creditScore}</p>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/50 border border-current">
                                  {selectedReferral.creditScore >= 750 ? 'Excellent' : selectedReferral.creditScore >= 650 ? 'Good' : 'Needs Improvement'}
                                </span>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Financials Section */}
              {selectedReferral.loanAmount && (
                <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                        <CreditCard size={24} />
                     </div>
                     <div>
                        <p className="text-sm text-emerald-800 font-medium">Disbursed Amount</p>
                        <p className="text-2xl font-bold text-emerald-900">₹{selectedReferral.loanAmount.toLocaleString('en-IN')}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-xs text-emerald-700 font-medium uppercase">Est. Earn</p>
                     <p className="text-lg font-bold text-emerald-800">₹{(selectedReferral.loanAmount * 0.015).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Application Timeline</h3>
                <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
                  {statusSteps.map((step, idx) => {
                    const isActive = getStepIndex(selectedReferral.status) >= idx;
                    const offset = idx === 0 ? 0 : idx === 1 ? 2 : idx === 2 ? 7 : 10;
                    const dateStr = getTimelineDate(selectedReferral.date, offset, selectedReferral.status, step);

                    return (
                      <div key={step} className="relative">
                        <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 ${isActive ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}></div>
                        <div className="flex justify-between items-start -mt-1">
                          <div>
                            <p className={`font-semibold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step}</p>
                            <p className="text-xs text-slate-500">
                                {step === ReferralStatus.REGISTERED ? 'Lead captured' : 
                                 step === ReferralStatus.APPLIED ? 'Documents submitted' : 
                                 step === ReferralStatus.APPROVED ? 'Lender approved' : 
                                 'Funds transferred'}
                            </p>
                          </div>
                          <div className="text-right">
                             {dateStr ? (
                               <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                 <Clock size={12} /> {dateStr}
                               </div>
                             ) : (
                               <span className="text-xs text-slate-300 font-medium italic">Pending</span>
                             )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setSelectedReferral(null)}
                className="w-full md:w-auto px-4 py-3 md:py-2 bg-white border border-slate-300 rounded-xl md:rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;