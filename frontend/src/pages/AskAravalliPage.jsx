import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Shield,
  Bot,
  User,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import { askAravalli } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SUGGESTED_PROMPTS = [
  'Why is Bandhwari Hill Ridge at Critical Risk?',
  'What did the Supreme Court order regarding Aravalli mining?',
  'Explain how the 5-factor Risk Engine calculates scores.',
  'What legal protection does Mangar Bani sacred grove have?',
  'How do citizen reports contribute to the risk score?',
];

export function AskAravalliPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello! I am **Ask Aravalli**, the specialized ecological and regulatory intelligence assistant for ARAVALLI SENTINEL.

I can explain:
- **Risk scores and factor breakdowns** across all 8 monitored Aravalli sectors.
- **Indian environmental law** (Supreme Court mining bans, PLPA, Eco-Sensitive Zones).
- **Satellite telemetry indicators** (NDVI vegetation anomalies, groundwater table drawdown).

How can I assist your ecological investigation today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryToSend) => {
    const text = queryToSend || inputQuery;
    if (!text || text.trim().length === 0 || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await askAravalli(text.trim());
      if (res.success && res.answer) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: res.answer,
            source: res.source,
            isSimulated: res.isSimulated,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text: `⚠️ I was unable to complete the query. ${res.error || 'Please try again.'}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ Network error: ${err.message}. Please verify the backend server is running.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
              GROUNDED CONVERSATIONAL ASSISTANT
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Grounded in Live Telemetry & Environmental Law
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>Ask Aravalli</span>
          </h1>
        </div>

        <div className="text-right text-[11px] font-mono text-slate-400 hidden sm:block">
          <div>Privacy Safe: Citizen identities redacted</div>
          <div className="text-emerald-400">Knowledge: Aravalli Eco-System Grid</div>
        </div>
      </div>

      {/* Suggested Prompts Bar */}
      <div className="flex-shrink-0 space-y-1.5">
        <span className="text-[10px] font-mono uppercase text-slate-400 block">Suggested Inquiries:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-xs text-slate-300 hover:text-white whitespace-nowrap transition-colors flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md ${
                msg.sender === 'user'
                  ? 'bg-emerald-600'
                  : 'bg-gradient-to-br from-cyan-600 to-slate-800'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-200" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
              <div
                className={`text-[10px] font-mono flex items-center justify-between pt-1 border-t ${
                  msg.sender === 'user' ? 'border-emerald-500/50 text-emerald-200' : 'border-slate-800 text-slate-400'
                }`}
              >
                <span>{msg.sender === 'user' ? user?.name || 'Citizen' : 'Ask Aravalli Engine'}</span>
                <span>{msg.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-600/30 text-cyan-400 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Grounding response in active Aravalli telemetry & environmental laws...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex-shrink-0 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ask about risk factors, Supreme Court bans, eco-sensitive zones, or threat reporting..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-xl"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-lg shadow-cyan-600/20 transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default AskAravalliPage;
