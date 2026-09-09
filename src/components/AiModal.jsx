import { X, ArrowRight, Bot } from 'lucide-react';

export default function AiModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-[#111111] w-full max-w-2xl rounded-3xl p-8 relative shadow-2xl border border-gray-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-ceylon-accent p-3 rounded-full text-white">
            <Bot size={28} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-wide">
            PLAN WITH AI <span className="bg-orange-500 text-xs font-bold px-2 py-1 rounded-md ml-2 align-middle">NEW</span>
          </h2>
        </div>

        {/* Search / Input Area */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Ask us anything (e.g., Train to Ella...)"
            className="w-full bg-[#222222] border border-gray-700 text-white placeholder-gray-500 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-ceylon-light focus:ring-1 focus:ring-ceylon-light text-lg"
            autoFocus
          />
          <button className="absolute right-2 top-2 bottom-2 bg-ceylon-accent hover:bg-ceylon-light text-white w-12 flex items-center justify-center rounded-full transition-colors cursor-pointer">
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Suggested Questions */}
        <div className="space-y-3">
          <button className="block w-full text-left px-5 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-[#222222] hover:text-white transition-colors cursor-pointer">
            How many days do I need to visit the main cultural attractions?
          </button>
          <button className="block w-full text-left px-5 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-[#222222] hover:text-white transition-colors cursor-pointer">
            Show me the best things to do in each season.
          </button>
          <button className="block w-full text-left px-5 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-[#222222] hover:text-white transition-colors cursor-pointer">
            What kind of local food and drinks should I definitely try?
          </button>
        </div>

      </div>
    </div>
  );
}