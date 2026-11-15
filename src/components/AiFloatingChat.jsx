
import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AiFloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Ayubowan! Welcome to XplorSL. How can I help you explore Sri Lanka?',
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
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const quickPrompts = [
    'Train from Kandy to Ella?',
    'Best season for Sigiriya?',
    '5-Day Sri Lanka Itinerary',
    'Tell me about local guides'
  ];

  const fetchAiResponse = async (userPrompt, history) => {
    // Check whether the user is logged in
    const { data: { session }, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error('Please sign in to use the XplorSL Travel Assistant.');
    }

    // Call the authenticated Supabase Edge Function
    const { data, error } = await supabase.functions.invoke(
      'travel-ai',
      {
       body: {
  message: userPrompt,
  history: history
}
      }
    );

    if (error) {
      throw new Error('The AI service is unavailable. Please try again.');
    }

    if (!data?.reply || typeof data.reply !== 'string') {
      throw new Error(data?.error || 'No response received from the AI.');
    }

    return data.reply;
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend ?? input).trim();

    if (!text || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text, time: 'Just now' }
    ]);

    setInput('');
    setIsTyping(true);

    try {
      const history = messages
  .slice(1)
  .slice(-8)
  .filter((msg) => msg.sender === 'user' || msg.sender === 'ai')
  .map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    text: msg.text
  }));

const reply = await fetchAiResponse(text, history);

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: reply, time: 'Just now' }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: error.message || 'Sorry, something went wrong. Please try again.',
          time: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">

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
                  XplorSL Travel Assistant
                  <Sparkles size={14} className="text-emerald-400" />
                </h4>

                <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" />
                  For signed-in users
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
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

                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-2xl border border-gray-200 w-fit">
                <Bot size={16} className="text-ceylon-accent animate-spin" />
                XplorSL AI is processing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="p-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="whitespace-nowrap text-[11px] font-semibold bg-gray-100 hover:bg-ceylon-primary hover:text-white text-gray-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Sri Lanka travel..."
              maxLength={1500}
              disabled={isTyping}
              className="flex-1 bg-gray-100 border border-gray-200 rounded-full px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-ceylon-accent"
            />

            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="bg-ceylon-primary hover:bg-ceylon-accent text-white p-2.5 rounded-full transition-colors shadow-md cursor-pointer disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
