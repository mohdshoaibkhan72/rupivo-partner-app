import React, { useState } from 'react';
import { UserProfile, BannerIdea } from '../types';
import { generateMarketingMessage, generateBannerIdeas } from '../services/geminiService';
import { Copy, Share2, Wand2, Check, Download, Image as ImageIcon, Lightbulb } from 'lucide-react';

interface MarketingProps {
  user: UserProfile;
}

const Marketing: React.FC<MarketingProps> = ({ user }) => {
  const referralLink = `https://rupivo.com/apply?ref=${user.referralCode}`;
  
  const [copied, setCopied] = useState(false);
  const [aiTone, setAiTone] = useState<'professional' | 'casual' | 'urgent'>('casual');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Banner Ideas State
  const [targetAudience, setTargetAudience] = useState('');
  const [bannerIdeas, setBannerIdeas] = useState<BannerIdea[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateMessage = async () => {
    setIsGenerating(true);
    const msg = await generateMarketingMessage(aiTone, referralLink);
    setGeneratedMessage(msg);
    setIsGenerating(false);
  };

  const handleGenerateIdeas = async () => {
    if (!targetAudience.trim()) return;
    setIsGeneratingIdeas(true);
    // Pass referralLink to the service
    const ideas = await generateBannerIdeas(targetAudience, referralLink);
    setBannerIdeas(ideas);
    setIsGeneratingIdeas(false);
  };

  const handleWhatsAppShare = (msg: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Marketing Tools</h1>
        <p className="text-slate-500">Everything you need to grow your referral network.</p>
      </div>

      {/* Unique Link Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Unique Referral Link</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-mono text-slate-600 break-all text-center md:text-left">
            {referralLink}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap w-full sm:w-auto"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button 
               onClick={() => handleWhatsAppShare(`Apply for a loan with Rupivo! ${referralLink}`)}
               className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all active:scale-95 whitespace-nowrap w-full sm:w-auto"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* AI Message Generator */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-4 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Wand2 size={120} className="text-indigo-600" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
               <Wand2 size={20} />
            </div>
            <h2 className="text-lg font-semibold text-indigo-900">AI Message Generator</h2>
          </div>
          <p className="text-indigo-700 mb-6 max-w-2xl text-sm md:text-base">
            Struggling with what to say? Let our AI generate a perfect WhatsApp message for you. 
            Select a tone and click generate.
          </p>

          <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
            {(['professional', 'casual', 'urgent'] as const).map((tone) => (
              <button
                key={tone}
                onClick={() => setAiTone(tone)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-medium transition-all text-center ${
                  aiTone === tone 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50'
                }`}
              >
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateMessage}
            disabled={isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={18} />
                Generate Message
              </>
            )}
          </button>

          {generatedMessage && (
            <div className="mt-6 bg-white rounded-lg p-4 border border-indigo-100 shadow-sm animate-fade-in">
              <textarea 
                readOnly
                className="w-full resize-none text-slate-700 focus:outline-none bg-transparent text-sm md:text-base"
                rows={4}
                value={generatedMessage}
              />
              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-100">
                 <button 
                  onClick={() => {
                      navigator.clipboard.writeText(generatedMessage);
                  }}
                  className="px-3 py-1.5 rounded bg-slate-50 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-indigo-600 flex items-center gap-1 border border-slate-200"
                >
                  <Copy size={14} /> Copy
                </button>
                <button 
                  onClick={() => handleWhatsAppShare(generatedMessage)}
                  className="px-3 py-1.5 rounded bg-emerald-50 text-xs font-medium text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 border border-emerald-100"
                >
                  <Share2 size={14} /> WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Banner Idea Generator */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
           <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
             <Lightbulb size={20} />
           </div>
           <h2 className="text-lg font-semibold text-slate-900">AI Banner Idea Generator</h2>
        </div>
        <p className="text-slate-500 mb-4 text-sm md:text-base">
          Need inspiration for your marketing visuals? Tell us your target audience, and we'll suggest some creative concepts.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input 
            type="text" 
            placeholder="Target Audience (e.g., Shop Owners)"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
          <button 
            onClick={handleGenerateIdeas}
            disabled={isGeneratingIdeas || !targetAudience}
            className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingIdeas ? 'Thinking...' : 'Get Ideas'}
          </button>
        </div>

        {bannerIdeas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bannerIdeas.map((idea, idx) => (
              <div key={idx} className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                 <h3 className="text-sm font-bold text-amber-800 mb-2 uppercase tracking-wide">Concept {idx + 1}</h3>
                 <p className="text-slate-700 text-sm mb-3">{idea.concept}</p>
                 <div className="pt-3 border-t border-amber-200/50">
                   <p className="text-xs text-slate-500 uppercase font-semibold">Tagline</p>
                   <p className="text-lg font-serif italic text-amber-900">"{idea.tagline}"</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Creatives Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Ready-to-use Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all">
                    <div className="aspect-[1.91/1] overflow-hidden bg-slate-100 relative">
                        <img 
                            src={`https://picsum.photos/600/314?random=${i}`} 
                            alt={`Banner ${i}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <button className="p-2 bg-white rounded-full text-slate-900 hover:bg-slate-100">
                                <Download size={20} />
                             </button>
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <ImageIcon size={18} />
                            <span>Banner 1080x1080</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Marketing;