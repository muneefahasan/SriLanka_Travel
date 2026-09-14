import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

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

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GROQ_API_KEY || '';

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

  // Call Real Gemini API endpoint or Smart Fallback Engine
  const fetchAiResponse = async (userPrompt) => {
    const systemPrompt = `You are Serendib AI, an expert, warm, and highly knowledgeable official AI Travel Assistant for Sri Lanka ("VisitCeylon"). 
    Answer tourist questions with helpful, structured advice covering destinations (Sigiriya, Ella, Kandy, Galle, Yala, Mirissa), train bookings, local foods (Kottu Roti, Hoppers, Ceylon Tea), emergency numbers (1912 Tourist Police, 1990 Ambulance), weather, and travel tips. Keep answers concise, friendly, and well-formatted with emojis.`;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: systemPrompt },
                    { text: userPrompt }
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) return aiText;
        }
      } catch (err) {
        console.warn("Gemini API call error, falling back to local engine:", err);
      }
    }

    // Smart Conversational Knowledge Engine (Fallback when API key is not configured)
    const lower = userPrompt.toLowerCase();

    if (lower.includes('train') || lower.includes('ella') || lower.includes('kandy') || lower.includes('ticket')) {
      return "🚆 **Kandy to Ella Express Train Guide:**\n\n• **Podi Menike (#1005)**: Departs Kandy at 08:47 AM.\n• **Ella Odyssey (#1015)**: Special tourist express departing 07:00 AM with photography stops at Nine Arch Bridge and waterfalls.\n• **Tickets**: 1st Class AC & 2nd Class reserved seats open 30 days prior. Check our Transport section for live schedules!";
    }
    
    if (lower.includes('sigiriya') || lower.includes('weather') || lower.includes('season') || lower.includes('climb')) {
      return "🌤️ **Sigiriya Fortress & Climate Advice:**\n\n• **Best Season**: November to April (Dry season in Central Province).\n• **Best Climbing Hour**: 06:30 AM before midday heat.\n• **Ticket Fee**: $36 USD (Includes Water Gardens, Frescoes & Museum). Don't forget sunscreen and comfortable walking shoes!";
    }

    if (lower.includes('itinerary') || lower.includes('day') || lower.includes('plan') || lower.includes('route')) {
      return "🗺️ **Recommended 5-Day Sri Lanka Highlights:**\n\n• **Day 1**: Sigiriya Rock Fortress & Minneriya Elephant Safari.\n• **Day 2**: Dambulla Cave Temple ➔ Kandy Sacred Tooth Temple.\n• **Day 3**: Scenic Train Ride Kandy ➔ Ella (Nine Arch Bridge).\n• **Day 4**: Little Adam's Peak Sunrise ➔ Yala Leopard Safari.\n• **Day 5**: Galle Dutch Fort & Departure.";
    }

    if (lower.includes('police') || lower.includes('helpline') || lower.includes('emergency') || lower.includes('hospital')) {
      return "🚨 **Sri Lanka Emergency Contacts:**\n\n• **Tourist Police Hotline**: 1912 (24/7 Multilingual Support)\n• **Suwa Seriya Free Ambulance**: 1990\n• **General Police**: 119\n• **Air Force Emergency**: 116";
    }

    if (lower.includes('food') || lower.includes('eat') || lower.includes('curry') || lower.includes('kottu')) {
      return "🍲 **Must-Try Sri Lankan Delicacies:**\n\n1. **Kottu Roti**: Chopped flatbread wok-fried with spices, veggies & curry.\n2. **Egg Hoppers (Appa)**: Crispy bowl-shaped rice flour crepes with a soft egg center.\n3. **Seafood Rice & Curry**: Fresh tuna, dhal, coconut sambal & polos (jackfruit curry).\n4. **Authentic Ceylon Black Tea**: Freshly brewed in Nuwara Eliya!";
    }

    if (lower.includes('visa') || lower.includes('eta') || lower.includes('passport') || lower.includes('entry')) {
      return "📄 **Sri Lanka ETA Visa Info:**\n\n• **30-Day Tourist Visa**: Apply online via the official portal (`eta.gov.lk`) for $50 USD.\n• **Visa on Arrival**: Available at BIA Colombo Airport for $60 USD.\n• **Passport Validity**: Must have at least 6 months remaining from entry date.";
    }

    return `Ayubowan! 🌴 Regarding "${userPrompt}": Sri Lanka offers incredible experiences across heritage fortresses, tea hills, and tropical beaches. You can generate a tailored plan in our Trip Planner section or ask me about trains, safaris, weather, or local tour guides!`;
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text: text, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const reply = await fetchAiResponse(text);

    setMessages((prev) => [...prev, { sender: 'ai', text: reply, time: 'Just now' }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      
      {/* Floating Trigger Avatar Button */}
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

      {/* Floating Chat Box Window */}
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
                  <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block"></span> {apiKey ? 'Gemini AI Connected' : 'Online & Ready to help'}
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
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-line ${
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
                <Bot size={16} className="text-ceylon-accent animate-spin" /> Ceylon AI is processing...
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
