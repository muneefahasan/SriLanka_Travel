import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, ChevronDown } from 'lucide-react';

export default function AiFloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Ayubowan! 🙏 I am your Ceylon AI Travel Assistant. How can I help plan your Sri Lanka trip today?',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "Train from Kandy to Ella?",
    "Best season for Sigiriya?",
    "5-Day Sri Lanka Itinerary",
    "Tourist Police Helpline?"
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: text, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Simulated Response Logic
    setTimeout(() => {
      let aiText = "I'd love to help with that! You can explore our interactive destinations map or check out live train timetables.";
      const lower = text.toLowerCase();

      if (lower.includes('train') || lower.includes('ella') || lower.includes('kandy')) {
        aiText = "🚆 The Kandy to Ella express train runs daily! Podi Menike leaves at 5:55 AM, and Ella Odyssey leaves at 7:00 AM. 1st & 2nd class tickets must be reserved 30 days in advance.";
      } else if (lower.includes('sigiriya') || lower.includes('weather') || lower.includes('season')) {
        aiText = "🌤️ Best time to climb Sigiriya Fortress is between November & April during early morning (6:30 AM) before the midday heat.";
      } else if (lower.includes('itinerary') || lower.includes('day') || lower.includes('plan')) {
        aiText = "🗺️ For a 5-day trip, we recommend: Day 1 Sigiriya & Safari, Day 2 Kandy Temple, Day 3 Scenic Train to Ella, Day 4 Nine Arches Bridge, Day 5 Galle Dutch Fort!";
      } else if (lower.includes('police') || lower.includes('helpline') || lower.includes('emergency')) {
        aiText = "🚨 Official SLTDA Tourist Police Helpline is 1912 (24/7). Suwa Seriya Free Ambulance is 1990.";
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiText, time: 'Just now' }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      
      {/* Floating Trigger Avatar Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-ceylon-primary hover:bg-ceylon-accent text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-emerald-400 cursor-pointer"
        >
          <div className="relative">
            <Bot size={28} className="text-emerald-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-ceylon-primary animate-ping" />
          </div>
          <span className="font-extrabold text-sm pr-2 hidden sm:inline-block">
            Plan with AI
          </span>
        </button>
      )}

      {/* Floating Chat Box Window (Aliexpress Eva Widget Style) */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-[90vw] sm:w-[380px] h-[520px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-ceylon-slate text-white p-4 flex items-center justify-between border-b border-ceylon-primary">
            <div className="flex items-center gap-3">
              <div className="bg-ceylon-accent p-2 rounded-full text-white border border-emerald-400">
                <Bot size={22} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                  Ceylon AI Agent <Sparkles size={14} className="text-emerald-400" />
                </h4>
                <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block"></span> Online & Ready to help
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Scrollable Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-ceylon-primary text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-2xl border border-gray-200 w-fit">
                <Bot size={16} className="text-ceylon-accent animate-spin" /> Ceylon AI is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-[11px] font-semibold bg-gray-100 hover:bg-ceylon-primary hover:text-white text-gray-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI anything about Sri Lanka..."
              className="flex-1 bg-gray-100 border border-gray-200 rounded-full px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-ceylon-accent"
            />
            <button
              type="submit"
              className="bg-ceylon-primary hover:bg-ceylon-accent text-white p-2.5 rounded-full transition-colors shadow-md cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
