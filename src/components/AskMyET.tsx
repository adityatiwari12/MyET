import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Sparkles, Bell, TrendingDown, TrendingUp, StopCircle, Volume2, Radio } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ApiService } from '../services/apiService';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { float32ToInt16, base64ToUint8Array, uint8ArrayToBase64 } from '../lib/audioUtils';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  audioUrl?: string;
  isLive?: boolean;
  insights?: string[];
  sources?: { title: string; url: string; source: string }[];
  suggestedFollowUps?: string[];
}

export function AskMyET() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: language === 'hi' 
        ? 'नमस्ते! मैं MyET हूँ। मैं आज आपकी भारतीय वित्त के बारे में कैसे सहायता कर सकता हूँ?' 
        : 'Hello! I am MyET. How can I assist you with Indian finance today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [sessionId, setSessionId] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Live API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const audioInputProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioOutputQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextPlayTimeRef = useRef(0);

  useEffect(() => {
    // Load chat history from backend
    const loadHistory = async () => {
      try {
        const data = await ApiService.getChatHistory();
        if (data && data.sessionId) {
          setSessionId(data.sessionId);
          
          if (data.messages && data.messages.length > 0) {
            const formattedMessages = data.messages.map((m: any) => ({
              role: m.role,
              text: m.text || m.content,
              timestamp: new Date(m.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            
            // If we have history, replace the default greeting with history, ensuring greeting is first if history is empty
            if (formattedMessages.length > 0) {
               setMessages(formattedMessages);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    loadHistory();

    return () => {
      stopLiveSession();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || !sessionId) return;

    const userMsg: Message = {
      role: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const prompt = language === 'hi' 
        ? `कृपया इस प्रश्न का हिंदी में उत्तर दें: ${messageText}`
        : messageText;
        
      const response = await ApiService.chat(prompt, sessionId);

      const aiMsg: Message = {
        role: 'ai',
        text: (response as any).reply || 'I am sorry, I could not process that request.',
        insights: (response as any).insights || [],
        sources: (response as any).sources || [],
        suggestedFollowUps: (response as any).suggestedFollowUps || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'My intelligence engine is loading. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          try {
            // Need to ensure ApiService has this method or just fallback if not.
            // But we already updated geminiService.ts to use ApiService under the hood! 
            // Wait, we can just use ApiService.transcribe (if we add it) or keep geminiService which we already proxied.
            // For consistency, let's use the proxied geminiService we already wrote:
            const transcription = await geminiService.transcribeAudio(base64Audio, 'audio/webm');
            if (transcription) {
              handleSend(transcription);
            }
          } catch (error) {
            console.error('Transcription error:', error);
          } finally {
            setIsLoading(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const playTTS = async (text: string, index: number) => {
    if (isSpeaking === index) {
      geminiService.stopSpeech();
      setIsSpeaking(null);
      return;
    }
    setIsSpeaking(index);
    try {
      const audioUrl = await geminiService.textToSpeech(text, language);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsSpeaking(null);
        audio.onerror = () => setIsSpeaking(null);
        audio.play();
      } else {
        // Web Speech API handled it — clear after estimated duration
        setTimeout(() => setIsSpeaking(null), text.length * 50);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(null);
    }
  };

  const startLiveSession = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      audioInputProcessorRef.current = processor;

      const sessionPromise = geminiService.connectLive({
        onopen: () => {
          console.log('Live session opened');
          setIsLiveMode(true);
          setMessages(prev => [...prev, {
            role: 'ai',
            text: t('ask.live.connected'),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isLive: true
          }]);
        },
        onmessage: async (message: any) => {
          if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
            const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
            const uint8 = base64ToUint8Array(base64Audio);
            const int16 = new Int16Array(uint8.buffer);
            const float32 = new Float32Array(int16.length);
            for (let i = 0; i < int16.length; i++) {
              float32[i] = int16[i] / 0x7fff;
            }
            audioOutputQueueRef.current.push(float32);
            playNextChunk();
          }

          if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
            const text = message.serverContent.modelTurn.parts[0].text;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'ai' && last.isLive) {
                return [...prev.slice(0, -1), { ...last, text: last.text + text }];
              }
              return prev;
            });
          }

          if (message.serverContent?.interrupted) {
            audioOutputQueueRef.current = [];
            isPlayingRef.current = false;
          }
        },
        onclose: () => {
          console.log('Live session closed');
          setIsLiveMode(false);
          stopLiveSession();
        },
        onerror: (err: any) => {
          console.error('Live session error:', err);
          setIsLiveMode(false);
          stopLiveSession();
        }
      });

      liveSessionRef.current = sessionPromise;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Data = float32ToInt16(inputData);
        const base64Data = uint8ArrayToBase64(new Uint8Array(int16Data.buffer));
        
        Promise.resolve(sessionPromise).then((session: any) => {
          if (session && session.sendRealtimeInput) {
            session.sendRealtimeInput({
              audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
            });
          }
        });
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

    } catch (error) {
      console.error('Error starting live session:', error);
    }
  };

  const playNextChunk = () => {
    if (!audioContextRef.current || audioOutputQueueRef.current.length === 0 || isPlayingRef.current) return;

    isPlayingRef.current = true;
    const chunk = audioOutputQueueRef.current.shift()!;
    const buffer = audioContextRef.current.createBuffer(1, chunk.length, 16000);
    buffer.getChannelData(0).set(chunk);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);

    const startTime = Math.max(audioContextRef.current.currentTime, nextPlayTimeRef.current);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + buffer.duration;

    source.onended = () => {
      isPlayingRef.current = false;
      playNextChunk();
    };
  };

  const stopLiveSession = () => {
    if (liveSessionRef.current) {
      Promise.resolve(liveSessionRef.current).then((s: any) => {
        if (s && s.close) s.close();
      });
      liveSessionRef.current = null;
    }
    if (audioInputProcessorRef.current) {
      audioInputProcessorRef.current.disconnect();
      audioInputProcessorRef.current = null;
    }
    setIsLiveMode(false);
    audioOutputQueueRef.current = [];
    isPlayingRef.current = false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-surface-container-low flex justify-between items-center px-6 h-16 w-full fixed top-0 z-40 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <span className="font-headline italic text-2xl tracking-tight text-primary">MyET</span>
        </div>
        <div className="flex items-center gap-6">
          <Bell className="w-5 h-5 text-on-surface-variant cursor-pointer" />
          <div className="h-8 w-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/20">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNXABWhgMgkmaiqoO58-aAe5D1ym1mZFDw1HRddpu6upJw7bXcXL0QP5oouZ7p9o0XaTLqd5NHChIwj81Xp6TT6Ts76Wg56Kaho9FpGs4fTl83HFmFt5CVfLcNtP-vrx57AommunqHvBEqwN7ZBxbTTAtKWBz55ahi7Tm64mZvWH2TLgXXoIYnneaqRFXK9KCRdWGGw2BotbOa5H_gG9fMjcPuUzt-F1Lpu7WxDhURTsO2sAsn3ihVIAl2FsqpIM4aZaOsAesrTA" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </nav>

      <main ref={scrollRef} className="flex-1 pt-20 pb-32 px-6 max-w-4xl mx-auto w-full overflow-y-auto no-scrollbar">
        <div className="mb-8 flex items-center gap-3">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant bg-surface-container-low px-3 py-1">
            {language === 'hi' ? 'संदर्भ विश्लेषण' : 'Context Analysis'}
          </span>
          <span className="text-xs text-on-surface-variant italic">
            {language === 'hi' ? 'आपकी हालिया गतिविधि के आधार पर' : 'Based on your recent activity'}
          </span>
        </div>

        <div className="space-y-12">
          {isLiveMode && (
            <div className="flex items-center gap-2 text-primary animate-pulse mb-4">
              <Radio className="w-4 h-4" />
              <span className="font-label text-[10px] uppercase tracking-widest">{t('ask.live.active')}</span>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? "flex flex-col items-end w-full" : "flex flex-col gap-8"}>
              {msg.role === 'user' ? (
                <>
                  <div className="max-w-[85%] bg-surface-container px-6 py-4 rounded-lg">
                    <p className="text-lg font-body leading-relaxed text-on-surface">{msg.text}</p>
                  </div>
                  <span className="font-label text-[10px] text-on-surface-variant mt-2 px-1">{msg.timestamp}</span>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-6 flex justify-between items-start">
                    <div>
                      <h2 className="font-headline text-3xl text-on-surface leading-tight">{t('ask.ledger')}</h2>
                    </div>
                    <button 
                      onClick={() => playTTS(msg.text, idx)}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        isSpeaking === idx ? "text-primary animate-pulse" : "text-on-surface-variant hover:text-primary"
                      )}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="bg-surface-container-low p-8 rounded-sm prose prose-invert max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>

                  {/* RAG Insights */}
                  {msg.insights && msg.insights.length > 0 && (
                    <div className="pl-6 space-y-2">
                      <p className="font-label text-[10px] uppercase tracking-widest text-primary">Key Takeaways</p>
                      <ul className="space-y-2">
                        {msg.insights.map((insight, i) => (
                          <li key={i} className="flex gap-3 text-sm text-on-surface-variant">
                            <span className="text-primary font-label text-xs shrink-0 mt-0.5">0{i + 1}</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* RAG Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pl-6 flex flex-wrap gap-2">
                      <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest w-full">Sources</span>
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full text-[10px] font-label text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <TrendingUp className="w-2.5 h-2.5" />
                          {src.source}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Suggested Follow-Ups */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pl-6 space-y-2">
                      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Ask Next</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedFollowUps.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => { setInput(q); }}
                            className="text-[11px] px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-primary/20 hover:text-primary transition-colors text-left font-body"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-primary animate-pulse">
              <SparklesIcon className="w-5 h-5" />
              <span className="font-label text-xs uppercase tracking-widest">{t('ask.analyzing')}</span>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-24 left-0 w-full px-6 z-40 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <div className={cn(
            "relative glass-panel rounded-full border flex items-center px-6 py-4 shadow-2xl transition-all",
            isRecording ? "border-error bg-error/10" : "border-primary/20"
          )}>
            <SparklesIcon className="w-6 h-6 text-primary mr-4" />
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant w-full font-body text-base" 
              placeholder={isRecording ? t('ask.listening') : t('ask.placeholder')}
              type="text"
              disabled={isRecording}
            />
            <div className="flex items-center gap-3 ml-4">
              <button 
                onClick={isLiveMode ? stopLiveSession : startLiveSession}
                className={cn(
                  "p-2 rounded-full transition-all",
                  isLiveMode ? "text-primary animate-pulse scale-110" : "text-on-surface-variant hover:text-primary"
                )}
                title={language === 'hi' ? 'लाइव वॉयस बातचीत' : 'Live Voice Conversation'}
              >
                <Radio className="w-6 h-6" />
              </button>
              {isRecording && (
                <div className="flex gap-1 items-center px-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [8, 16, 8],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-0.5 bg-error rounded-full"
                    />
                  ))}
                </div>
              )}
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "p-2 rounded-full transition-all",
                  isRecording ? "text-error scale-110" : "text-on-surface-variant hover:text-primary"
                )}
              >
                {isRecording ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => handleSend()}
                className="bg-primary hover:bg-primary-dim text-on-primary font-label text-[10px] font-bold uppercase tracking-tighter px-4 py-1.5 rounded-full transition-transform active:scale-95"
              >
                {t('ask.query')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ fill: 'currentColor' }}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}
