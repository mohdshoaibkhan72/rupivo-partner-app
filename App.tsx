import React, { useState } from 'react';
import { 
  Referral, 
  ReferralStatus, 
  CommissionStatus, 
  Payout, 
  UserProfile, 
  ViewState 
} from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Referrals from './components/Referrals';
import { Earnings, Payouts } from './components/EarningsPayouts';
import Marketing from './components/Marketing';
import Profile from './components/Profile';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Wallet, 
  CreditCard,
  User
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_USER: UserProfile = {
  name: 'Rajesh Sharma',
  referralCode: 'RVP-8821',
  email: 'rajesh.s@example.com',
  phone: '+91 98765 43210',
  totalEarnings: 15400,
  bankDetails: {
    bankName: 'HDFC Bank',
    accountNumber: 'XXXXXXXX8821',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Rajesh Kumar Sharma'
  }
};

const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref_1',
    leadName: 'Amit Verma',
    maskedMobile: '9876599210',
    date: '2023-10-12T10:00:00Z',
    status: ReferralStatus.DISBURSED,
    loanAmount: 500000,
    commissionStatus: CommissionStatus.PAID,
    loanType: 'Personal Loan',
    creditScore: 780,
    assignedLender: 'HDFC Bank'
  },
  {
    id: 'ref_2',
    leadName: 'Sarah John',
    maskedMobile: '9988711223',
    date: '2023-10-15T14:30:00Z',
    status: ReferralStatus.APPROVED,
    commissionStatus: CommissionStatus.PENDING,
    loanType: 'Business Loan',
    creditScore: 745,
    assignedLender: 'Bajaj Finserv'
  },
  {
    id: 'ref_3',
    leadName: 'Vikram Singh',
    maskedMobile: '8877633445',
    date: '2023-10-18T09:15:00Z',
    status: ReferralStatus.APPLIED,
    commissionStatus: CommissionStatus.PENDING,
    loanType: 'Personal Loan',
    creditScore: 680,
    assignedLender: 'Pending Allocation'
  },
  {
    id: 'ref_4',
    leadName: 'Neha Gupta',
    maskedMobile: '7766577889',
    date: '2023-10-20T16:45:00Z',
    status: ReferralStatus.REGISTERED,
    commissionStatus: CommissionStatus.PENDING,
    loanType: 'Home Loan',
    // No credit score or lender yet
  },
  {
    id: 'ref_5',
    leadName: 'Arjun Das',
    maskedMobile: '9900155667',
    date: '2023-10-22T11:20:00Z',
    status: ReferralStatus.DISBURSED,
    loanAmount: 200000,
    commissionStatus: CommissionStatus.PENDING,
    loanType: 'Personal Loan',
    creditScore: 810,
    assignedLender: 'IDFC First Bank'
  }
];

const MOCK_PAYOUTS: Payout[] = [
  {
    id: 'pay_1',
    disbursedAmount: 500000,
    commissionRate: 0.015,
    earnedAmount: 7500,
    status: 'Paid',
    payoutDate: '2023-10-25T10:00:00Z',
    referralId: 'ref_1'
  },
  {
    id: 'pay_2',
    disbursedAmount: 200000,
    commissionRate: 0.015,
    earnedAmount: 3000,
    status: 'Pending',
    referralId: 'ref_5'
  }
];

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);

  const handleAddReferral = (newReferrals: Referral[]) => {
    setReferrals(prev => [...newReferrals, ...prev]);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard referrals={referrals} payouts={MOCK_PAYOUTS} />;
      case 'referrals':
        return <Referrals referrals={referrals} onAddReferral={handleAddReferral} />;
      case 'earnings':
        return <Earnings payouts={MOCK_PAYOUTS} />;
      case 'payouts':
        return <Payouts payouts={MOCK_PAYOUTS} />;
      case 'marketing':
        return <Marketing user={MOCK_USER} />;
      case 'profile':
        return <Profile user={MOCK_USER} />;
      default:
        return <Dashboard referrals={referrals} payouts={MOCK_PAYOUTS} />;
    }
  };

  const MobileNavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
        currentView === view ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:block h-screen sticky top-0">
        <Sidebar 
          currentView={currentView} 
          onChangeView={setCurrentView} 
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:hidden sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-lg">R</span>
             </div>
             <span className="font-bold text-lg text-slate-800 tracking-tight">Rupivo<span className="text-emerald-500">Partner</span></span>
          </div>
          <button onClick={() => setCurrentView('profile')} className="relative">
            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm border border-emerald-200">
              {MOCK_USER.name.charAt(0)}
            </div>
            {currentView === 'profile' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            )}
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar mb-20 lg:mb-0">
          <div className="max-w-6xl mx-auto">
             {renderContent()}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-around items-center h-16 px-2">
            <MobileNavItem view="dashboard" icon={LayoutDashboard} label="Home" />
            <MobileNavItem view="referrals" icon={Users} label="Leads" />
            <MobileNavItem view="marketing" icon={Megaphone} label="Tools" />
            <MobileNavItem view="earnings" icon={Wallet} label="Earnings" />
            <MobileNavItem view="payouts" icon={CreditCard} label="Payouts" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;