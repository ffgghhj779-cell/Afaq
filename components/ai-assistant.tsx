'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Zap, Bot, User, Loader } from "lucide-react";
import { useLanguage } from "./language-provider";
import { sendChatMessage } from "@/lib/ai-api";
import { ApiError } from "@/lib/api-client";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = {
  ar: [
    'كيف يعمل نظام الفوترة مع زاتكا؟',
    'ما هي باقة الأعمال المناسبة لي؟',
    'كيف أبدأ تسجيل متجري؟',
  ],
  en: [
    'How does ZATCA billing integration work?',
    'Which pricing plan fits my business?',
    'How do I register my store?',
  ],
  ur: [
    'ZATCA بلنگ انٹیگریشن کیسے کام کرتی ہے؟',
    'میرے کاروبار کے لیے کون سا پلان مناسب ہے؟',
    'میں اپنا اسٹور کیسے رجسٹر کروں؟',
  ],
};

interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
}

export function AIAssistant({ open, onClose }: AIAssistantProps) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await sendChatMessage(trimmed, language, sessionId);
      setSessionId(result.sessionId);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response,
      }]);
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : t(
            'عذراً، حدث خطأ ما. يرجى المحاولة مجدداً.',
            'Sorry, something went wrong. Please try again.',
            'معذرت، کچھ غلط ہوا۔ دوبارہ کوشش کریں۔'
          );
      setMessages(prev => [...prev, { role: 'assistant', content: message }]);
    } finally {
      setLoading(false);
    }
  };

  const prompts = SUGGESTED_PROMPTS[language] ?? SUGGESTED_PROMPTS.ar;
  const isEmpty = messages.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 rtl:left-6 ltr:right-6 w-[calc(100vw-48px)] max-w-[420px] z-[70] flex flex-col"
            style={{ maxHeight: 'calc(100vh - 48px)' }}
          >
            <div className="flex flex-col bg-[#0a0a0a] border border-white/10 shadow-[0_40px_80px_-10px_rgba(0,0,0,0.9),0_0_0_1px_rgba(22,93,255,0.15)] overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 48px)' }}>

              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-gradient-to-r from-[#165DFF]/5 to-transparent shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#165DFF]/10 border border-[#165DFF]/30 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-[#165DFF]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t('المساعدة الذكية', 'AI Assistant', 'AI معاون')}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      <span className="text-[10px] text-[#10B981] tracking-wide uppercase">{t('متصل', 'Online', 'آن لائن')}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center text-[#666] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px] max-h-[50vh]">
                {isEmpty ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center pt-6 gap-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#165DFF]/10 border border-[#165DFF]/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[#165DFF]" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">{t('مرحباً بك في أفق', 'Welcome to AFAQ', 'AFAQ میں خوش آمدید')}</p>
                      <p className="text-[#666] text-xs leading-relaxed">
                        {t('أنا هنا للإجابة على جميع استفساراتك.', 'I\'m here to answer all your questions.', 'میں آپ کے تمام سوالات کا جواب دینے کے لیے یہاں ہوں۔')}
                      </p>
                    </div>

                    <div className="w-full space-y-2 mt-2">
                      {prompts.map((prompt, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * i }}
                          onClick={() => sendMessage(prompt)}
                          className="w-full text-right rtl:text-right ltr:text-left text-xs text-[#888] bg-white/[0.03] border border-white/8 hover:border-[#165DFF]/40 hover:text-white hover:bg-[#165DFF]/5 transition-all duration-200 px-4 py-3"
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-white/10 border border-white/15'
                          : 'bg-[#165DFF]/10 border border-[#165DFF]/25'
                      }`}>
                        {msg.role === 'user'
                          ? <User className="w-3 h-3 text-white/70" />
                          : <Bot className="w-3 h-3 text-[#165DFF]" />
                        }
                      </div>
                      <div className={`max-w-[80%] text-sm leading-relaxed px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-[#165DFF]/15 border border-[#165DFF]/20 text-white'
                          : 'bg-white/[0.04] border border-white/8 text-[#d0d0d0]'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))
                )}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#165DFF]/10 border border-[#165DFF]/25 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-[#165DFF]" />
                    </div>
                    <div className="bg-white/[0.04] border border-white/8 px-4 py-3 flex items-center gap-2">
                      <Loader className="w-3 h-3 text-[#165DFF] animate-spin" />
                      <span className="text-xs text-[#666]">{t('يكتب...', 'Typing...', 'لکھ رہا ہے...')}</span>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="shrink-0 p-4 border-t border-white/5 bg-[#080808]">
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                  className="flex items-center gap-3"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('اكتب رسالتك...', 'Type your message...', 'اپنا پیغام لکھیں...')}
                    className="flex-1 bg-white/[0.04] border border-white/10 focus:border-[#165DFF]/50 text-white placeholder-[#555] text-sm px-4 py-3 outline-none transition-colors duration-200"
                    disabled={loading}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 flex items-center justify-center bg-[#165DFF] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shrink-0 hover:bg-[#1a6bff] hover:shadow-[0_0_20px_rgba(22,93,255,0.5)]"
                  >
                    <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                  </motion.button>
                </form>
                <p className="text-[10px] text-[#444] mt-2 text-center">
                  {t('مدعوم بذكاء اصطناعي متعدد الوكلاء', 'Powered by multi-agent AI', 'ملٹی ایجنٹ AI سے چلتا ہے')}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
