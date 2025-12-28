import React from 'react';
import { UserProfile } from '../types';
import { User, Mail, Phone, Shield, Hash, MessageSquarePlus, Landmark, QrCode, Download } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  // Generate QR URL pointing to the App Download link with referral code
  const appDownloadLink = `https://rupivo.com/install?ref=${user.referralCode}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appDownloadLink)}&color=0f172a&bgcolor=ffffff&margin=10`;

  const handleDownloadQr = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rupivo-partner-qr-${user.referralCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback for cross-origin issues or if fetch fails
      window.open(qrImageUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500">View your account details and partner information.</p>
        </div>
        <a 
          href="mailto:partner-feedback@rupivo.com?subject=Feedback for Rupivo Partner Portal"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium"
        >
          <MessageSquarePlus size={16} />
          Send Feedback
        </a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-slate-900 relative">
           <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                 <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-3xl font-bold">
                    {user.name.charAt(0)}
                 </div>
              </div>
           </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500">Authorized Referral Partner</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Referral Code (Immutable)</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-medium">
                        <Hash size={18} className="text-slate-400" />
                        {user.referralCode}
                    </div>
                </div>

                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Email Address</label>
                    <div className="flex items-center gap-3 p-3 bg-white border-b border-slate-200 text-slate-700">
                        <Mail size={18} className="text-slate-400" />
                        {user.email}
                    </div>
                </div>

                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Phone Number</label>
                    <div className="flex items-center gap-3 p-3 bg-white border-b border-slate-200 text-slate-700">
                        <Phone size={18} className="text-slate-400" />
                        {user.phone}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Account Status</label>
                    <div className="flex items-center gap-3 p-3 bg-white border-b border-slate-200 text-emerald-600 font-medium">
                        <Shield size={18} />
                        Active & Verified
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* QR Code Section for App Download */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 order-2 md:order-1">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <QrCode size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Partner QR Code</h2>
                        <p className="text-xs text-slate-500">Instant App Download for Customers</p>
                    </div>
                </div>
                
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Show this QR code to potential customers. When they scan it, it will directly open the 
                    <strong> Rupivo App Download</strong> page with your referral code 
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1 py-0.5 rounded mx-1">{user.referralCode}</span> 
                    automatically applied.
                </p>

                <button 
                    onClick={handleDownloadQr}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm text-sm font-medium active:scale-95 w-full md:w-auto justify-center"
                >
                    <Download size={18} />
                    Download QR Image
                </button>
            </div>

            <div className="order-1 md:order-2 flex-shrink-0">
                <div className="p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)]">
                    <img 
                      src={qrImageUrl} 
                      alt="Partner App QR Code" 
                      className="w-40 h-40 md:w-48 md:h-48 block mix-blend-multiply" 
                    />
                    <div className="mt-3 text-center border-t border-slate-100 pt-2">
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">SCAN TO DOWNLOAD</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Bank Details Section */}
      {user.bankDetails && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Landmark size={20} />
               </div>
               <div>
                   <h2 className="text-lg font-bold text-slate-900">Registered Payout Account</h2>
                   <p className="text-xs text-slate-500">Your commissions will be credited here.</p>
               </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Bank Name</label>
                  <p className="text-slate-900 font-medium">{user.bankDetails.bankName}</p>
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Account Number</label>
                  <p className="text-slate-900 font-mono font-medium tracking-wide">{user.bankDetails.accountNumber}</p>
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">IFSC Code</label>
                  <p className="text-slate-900 font-mono font-medium">{user.bankDetails.ifscCode}</p>
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Account Holder</label>
                  <p className="text-slate-900 font-medium">{user.bankDetails.accountHolderName}</p>
               </div>
            </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="text-blue-900 font-medium mb-2">Need to update your details?</h3>
          <p className="text-sm text-blue-800">
              To change your registered mobile number or bank details for payouts, please contact our partner support team directly at <a href="#" className="underline font-semibold">support@rupivo.com</a>. Security protocols prevent direct editing of critical info.
          </p>
      </div>
    </div>
  );
};

export default Profile;