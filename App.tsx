
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Card, Player, GameSettings, FontSize, LanguageCode, GameHistoryEntry } from './types';
import { generateThemeImages } from './services/geminiService';
import CardComponent from './components/CardComponent';

const TRANSLATIONS: Record<LanguageCode, any> = {
  he: {
    title: 'לוטו זיכרון AI',
    pairs: 'מספר זוגות',
    players: 'מצב משחק',
    single: 'שחקן יחיד',
    multi: 'שני שחקנים',
    start: 'התחל משחק',
    theme: 'נושא',
    loading: 'Gemini יוצר עבורך עולמות...',
    mainMenu: 'תפריט ראשי',
    player1: 'שחקן 1',
    player2: 'שחקן 2',
    time: 'זמן',
    left: 'נותרו',
    winner: 'המנצח:',
    draw: 'תיקו!',
    playAgain: 'משחק חדש',
    bestTime: 'שיא אישי',
    newRecord: 'שיא חדש!',
    feedback: 'שלח משוב',
    custom: 'מותאם אישית...',
    music: 'מוזיקה',
    mute: 'השתק',
    unmute: 'הפעל סאונד',
    export: 'ייצא היסטוריה',
    clear: 'נקה',
    history: 'היסטוריית משחקים',
    noHistory: 'אין היסטוריה עדיין',
    clearHistory: 'מחק היסטוריה',
    score: 'ניקוד',
    activeTurn: 'תורך!',
    themes: { animals: 'חיות', space: 'חלל', food: 'אוכל', nature: 'טבע', robots: 'רובוטים' }
  },
  en: {
    title: 'AI Memory Master',
    pairs: 'Number of Pairs',
    players: 'Game Mode',
    single: 'Single Player',
    multi: 'Two Players',
    start: 'Start Game',
    theme: 'Theme',
    loading: 'Gemini is creating worlds for you...',
    mainMenu: 'Main Menu',
    player1: 'Player 1',
    player2: 'Player 2',
    time: 'Time',
    left: 'Pairs Left',
    winner: 'Winner:',
    draw: 'It\'s a Draw!',
    playAgain: 'Play Again',
    bestTime: 'Best Time',
    newRecord: 'New Record!',
    feedback: 'Feedback',
    custom: 'Custom...',
    music: 'Music',
    mute: 'Mute',
    unmute: 'Unmute',
    export: 'Export History',
    clear: 'Clear',
    history: 'Match History',
    noHistory: 'No history yet',
    clearHistory: 'Clear History',
    score: 'Score',
    activeTurn: 'Your Turn!',
    themes: { animals: 'Animals', space: 'Space', food: 'Food', nature: 'Nature', robots: 'Robots' }
  },
  zh: { title: 'AI 记忆大师', start: '开始游戏', theme: '主题', loading: '双子座正在为你创造世界...', bestTime: '最佳时间', newRecord: '新纪录！', music: '音乐', history: '比赛历史', activeTurn: '轮到你了！' },
  hi: { title: 'एआई मेमोरी मास्टर', start: 'खेल शुरू करें', theme: 'विषय', loading: 'मिथुन आपके लिए दुनिया बना रहा है...', bestTime: 'सर्वश्रेष्ठ समय', newRecord: 'नया रिकॉर्ड!', music: 'संगीत', history: 'मैच इतिहास', activeTurn: 'आपकी बारी!' },
  de: { title: 'KI Memory Meister', start: 'Spiel starten', theme: 'Thema', loading: 'Gemini erschafft Welten für dich...', bestTime: 'Bestzeit', newRecord: 'Neuer Rekord!', music: 'Musik', history: 'Spielverlauf', activeTurn: 'Du bist dran!' },
  es: { title: 'Maestro de Memoria IA', start: 'Empezar Juego', theme: 'Tema', loading: 'Gemini está creando mundos para ti...', bestTime: 'Mejor Tiempo', newRecord: '¡Nuevo Récord!', music: 'Música', history: 'Historial', activeTurn: '¡Tu turno!' },
  fr: { title: 'Maître de Mémoire IA', start: 'Démarrer', theme: 'Thème', loading: 'Gemini crée des mondes pour vous...', bestTime: 'Meilleur Temps', newRecord: 'Nouveau Record!', music: 'Musique', history: 'Historique', activeTurn: 'À toi !' }
};

const THEME_OPTIONS = ['animals', 'space', 'food', 'nature', 'robots'];

const App: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings>({
    pairsCount: 12,
    playersCount: 1,
    theme: 'animals',
    uiTheme: 'dark',
    fontSize: 'medium',
    lang: 'he'
  });
  
  const [status, setStatus] = useState<GameStatus>(GameStatus.SETUP);
  const [loadingText, setLoadingText] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [players, setPlayers] = useState<Player[]>([{ id: 0, name: '1', score: 0 }, { id: 1, name: '2', score: 0 }]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [customTheme, setCustomTheme] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Sound effects refs
  const flipSfx = useRef<HTMLAudioElement | null>(null);
  const matchSfx = useRef<HTMLAudioElement | null>(null);
  const mismatchSfx = useRef<HTMLAudioElement | null>(null);
  const winSfx = useRef<HTMLAudioElement | null>(null);

  const [bestTime, setBestTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('memory_game_best_time');
    return saved ? parseInt(saved, 10) : null;
  });
  const [history, setHistory] = useState<GameHistoryEntry[]>(() => {
    const saved = localStorage.getItem('memory_game_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isNewRecord, setIsNewRecord] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Ambient Music
    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-ambient-tech-lounge-425.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    audioRef.current = audio;

    // SFX Initialization
    flipSfx.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-card-flip-607.mp3');
    matchSfx.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-reward-952.mp3');
    mismatchSfx.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
    winSfx.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  useEffect(() => {
    document.body.setAttribute('data-theme', settings.uiTheme);
    document.body.setAttribute('data-font-size', settings.fontSize);
    document.documentElement.dir = settings.lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.lang;
  }, [settings.uiTheme, settings.fontSize, settings.lang]);

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let result = TRANSLATIONS[settings.lang] || TRANSLATIONS.en;
    for (const k of keys) result = result?.[k];
    return result || key;
  }, [settings.lang]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = settings.lang === 'he' ? 'he-IL' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const playSfx = (audio: HTMLAudioElement | null) => {
    if (audio && !isMuted) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      timerRef.current = window.setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  useEffect(() => {
    if (status === GameStatus.FINISHED) {
      playSfx(winSfx.current);
      if (settings.playersCount === 1) {
        if (bestTime === null || seconds < bestTime) {
          setBestTime(seconds);
          setIsNewRecord(true);
          localStorage.setItem('memory_game_best_time', seconds.toString());
        } else {
          setIsNewRecord(false);
        }
      } else {
        const newEntry: GameHistoryEntry = {
          id: Date.now().toString(),
          date: new Date().toLocaleString(settings.lang === 'he' ? 'he-IL' : 'en-US'),
          p1Score: players[0].score,
          p2Score: players[1].score,
          theme: customTheme || t(`themes.${settings.theme}`),
          duration: seconds,
          pairsCount: settings.pairsCount
        };
        const updatedHistory = [newEntry, ...history].slice(0, 50);
        setHistory(updatedHistory);
        localStorage.setItem('memory_game_history', JSON.stringify(updatedHistory));
      }
    }
  }, [status]);

  const startGame = async () => {
    speak(t('start'));
    setStatus(GameStatus.LOADING);
    setIsNewRecord(false);
    const finalTheme = customTheme || t(`themes.${settings.theme}`);
    
    const imageUrls = await generateThemeImages(finalTheme, settings.pairsCount, (txt, prog) => {
      setLoadingText(txt);
      setLoadingProgress(prog);
    });

    const newCards: Card[] = [];
    imageUrls.forEach((url, idx) => {
      newCards.push({ id: idx * 2, pairId: idx, imageUrl: url, isFlipped: false, isMatched: false });
      newCards.push({ id: idx * 2 + 1, pairId: idx, imageUrl: url, isFlipped: false, isMatched: false });
    });

    setCards(newCards.sort(() => Math.random() - 0.5));
    setPlayers([{ id: 0, name: '1', score: 0 }, { id: 1, name: '2', score: 0 }]);
    setCurrentPlayerIndex(0);
    setFlippedIndices([]);
    setSeconds(0);
    setStatus(GameStatus.PLAYING);
  };

  const handleCardClick = (id: number) => {
    if (isProcessing) return;
    const clickedCardIdx = cards.findIndex(c => c.id === id);
    if (flippedIndices.length >= 2 || flippedIndices.includes(clickedCardIdx)) return;

    playSfx(flipSfx.current);
    const newFlipped = [...flippedIndices, clickedCardIdx];
    setFlippedIndices(newFlipped);
    setCards(prev => prev.map((card, idx) => idx === clickedCardIdx ? { ...card, isFlipped: true } : card));

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [i1, i2] = newFlipped;
      if (cards[i1].pairId === cards[i2].pairId) {
        setTimeout(() => {
          playSfx(matchSfx.current);
          const updatedCards = cards.map((c, idx) => 
            (idx === i1 || idx === i2) ? { ...c, isMatched: true } : c
          );
          setCards(updatedCards);
          setPlayers(p => {
            const next = [...p];
            next[currentPlayerIndex].score += 1;
            return next;
          });
          setFlippedIndices([]);
          setIsProcessing(false);
          if (updatedCards.every(c => c.isMatched)) setStatus(GameStatus.FINISHED);
        }, 600);
      } else {
        setTimeout(() => {
          playSfx(mismatchSfx.current);
          setCards(prev => prev.map((c, idx) => newFlipped.includes(idx) ? { ...c, isFlipped: false } : c));
          if (settings.playersCount === 2) {
            const nextIdx = currentPlayerIndex === 0 ? 1 : 0;
            setCurrentPlayerIndex(nextIdx);
            speak(t('activeTurn'));
          }
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const clearMatchHistory = () => {
    setHistory([]);
    localStorage.removeItem('memory_game_history');
    speak(t('clear'));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 relative">
      <div className="flex-1 flex items-center justify-center w-full">
        {status === GameStatus.SETUP && (
          <div className="max-w-xl w-full mx-auto bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/10 animate-fade-in overflow-hidden relative">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                {Object.keys(TRANSLATIONS).map(l => (
                  <button 
                    key={l} 
                    onClick={() => { setSettings({...settings, lang: l as LanguageCode}); speak(l); }} 
                    className={`px-2 py-1 text-xs rounded-md font-bold transition-all ${settings.lang === l ? 'bg-cyan-500 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 items-center">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${!isMuted ? 'bg-cyan-500 text-white shadow-lg rotate-12' : 'bg-slate-700 text-slate-400'}`}
                >
                  <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                </button>
                <div className="flex gap-2">
                  <button onClick={() => { setSettings({...settings, uiTheme: 'dark'}); speak('Dark'); }} className="w-6 h-6 rounded-full bg-slate-900 border border-white/20 shadow-inner"></button>
                  <button onClick={() => { setSettings({...settings, uiTheme: 'bright'}); speak('Bright'); }} className="w-6 h-6 rounded-full bg-white border border-slate-300 shadow-inner"></button>
                  <button onClick={() => { setSettings({...settings, uiTheme: 'colorful'}); speak('Colorful'); }} className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 shadow-inner"></button>
                </div>
              </div>
            </div>

            {!showHistory ? (
              <div className="animate-fade-in">
                <h1 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">{t('title')}</h1>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-3 opacity-70">{t('theme')}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {THEME_OPTIONS.map(opt => (
                        <button 
                          key={opt} 
                          onClick={() => { setSettings({...settings, theme: opt}); setCustomTheme(''); speak(t(`themes.${opt}`)); }} 
                          className={`py-2 rounded-xl border-2 transition-all ${settings.theme === opt && !customTheme ? 'border-cyan-500 bg-cyan-500/10 shadow-sm' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                        >
                          {t(`themes.${opt}`)}
                        </button>
                      ))}
                      <div className="col-span-1 relative flex items-center">
                        <input 
                          type="text" placeholder={t('custom')} value={customTheme} 
                          onChange={(e) => setCustomTheme(e.target.value)} 
                          className={`w-full py-2 pl-3 pr-8 rounded-xl border-2 bg-transparent focus:outline-none transition-all ${customTheme ? 'border-cyan-500' : 'border-slate-700'}`}
                        />
                        {customTheme && <button onClick={() => setCustomTheme('')} className="absolute right-2 text-slate-500 hover:text-white"><i className="fas fa-times-circle"></i></button>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-8 items-end">
                     <div className="flex-1">
                       <label className="block text-sm font-bold mb-3 opacity-70">{t('pairs')}: {settings.pairsCount}</label>
                       <input 
                          type="range" min="6" max="24" step="2" value={settings.pairsCount} 
                          onChange={(e) => setSettings({...settings, pairsCount: parseInt(e.target.value)})} 
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                       />
                     </div>
                     <div className="flex gap-2">
                       {(['small', 'medium', 'large'] as FontSize[]).map(f => (
                         <button key={f} onClick={() => setSettings({...settings, fontSize: f})} className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold transition-all ${settings.fontSize === f ? 'border-cyan-500 text-cyan-500 bg-cyan-500/5 shadow-md' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>
                           {f[0].toUpperCase()}
                         </button>
                       ))}
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3 opacity-70">{t('players')}</label>
                    <div className="flex gap-4">
                      <button onClick={() => { setSettings({...settings, playersCount: 1}); speak(t('single')); }} className={`flex-1 py-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${settings.playersCount === 1 ? 'border-cyan-500 bg-cyan-500/20 shadow-md' : 'border-slate-700'}`}>
                        <i className="fas fa-user"></i> {t('single')}
                      </button>
                      <button onClick={() => { setSettings({...settings, playersCount: 2}); speak(t('multi')); }} className={`flex-1 py-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${settings.playersCount === 2 ? 'border-cyan-500 bg-cyan-500/20 shadow-md' : 'border-slate-700'}`}>
                        <i className="fas fa-users"></i> {t('multi')}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={startGame} className="flex-[3] py-5 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-2xl text-xl font-black shadow-xl hover:scale-[1.02] transition-all transform active:scale-95 text-white">{t('start')}</button>
                    <button onClick={() => { setShowHistory(true); speak(t('history')); }} className="flex-1 py-5 bg-slate-700/50 hover:bg-slate-700 rounded-2xl border border-white/5 transition-all text-white/70"><i className="fas fa-history text-xl"></i></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black">{t('history')}</h2>
                  <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white"><i className="fas fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {history.length === 0 ? <p className="text-center opacity-40 mt-10 italic">{t('noHistory')}</p> : history.map(entry => (
                    <div key={entry.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
                       <div className="flex justify-between text-[10px] opacity-40 font-bold"><span>{entry.date}</span><span>{entry.theme}</span></div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-[8px] opacity-30">P1</p>
                              <p className={`text-xl font-black ${entry.p1Score > entry.p2Score ? 'text-cyan-400' : ''}`}>{entry.p1Score}</p>
                            </div>
                            <span className="opacity-20">VS</span>
                            <div className="text-center">
                              <p className="text-[8px] opacity-30">P2</p>
                              <p className={`text-xl font-black ${entry.p2Score > entry.p1Score ? 'text-indigo-400' : ''}`}>{entry.p2Score}</p>
                            </div>
                          </div>
                          <div className="text-right"><p className="text-[8px] opacity-30">{t('time')}</p><p className="text-sm font-mono font-bold">{formatTime(entry.duration)}</p></div>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button onClick={clearMatchHistory} disabled={history.length === 0} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 disabled:opacity-20">{t('clearHistory')}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {status === GameStatus.LOADING && (
          <div className="text-center p-12 max-w-md w-full animate-fade-in">
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="absolute inset-0 border-8 border-indigo-500/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-8 border-t-cyan-500 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-4 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-full shadow-2xl flex items-center justify-center">
                <i className="fas fa-brain text-white text-3xl animate-pulse"></i>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">{t('loading')}</h2>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4 border border-white/5">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <p className="text-slate-400 text-sm font-mono">{loadingText}</p>
          </div>
        )}

        {status === GameStatus.PLAYING && (
          <div className="w-full max-w-6xl animate-fade-in">
             <div className="flex justify-between items-center mb-8 bg-slate-800/40 p-6 rounded-3xl backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden">
               <div className="flex gap-4">
                  <div className={`relative p-4 rounded-2xl text-center min-w-[120px] transition-all duration-500 ${currentPlayerIndex === 0 && settings.playersCount === 2 ? 'bg-cyan-500/20 ring-4 ring-cyan-500 scale-110 shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'bg-slate-700/50 opacity-60'}`}>
                    <p className="text-[10px] uppercase font-black opacity-40">{t('player1')}</p>
                    <p className="text-3xl font-black">{players[0].score}</p>
                    {currentPlayerIndex === 0 && settings.playersCount === 2 && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-pulse">
                        {t('activeTurn')}
                      </div>
                    )}
                  </div>
                  {settings.playersCount === 2 && (
                    <div className={`relative p-4 rounded-2xl text-center min-w-[120px] transition-all duration-500 ${currentPlayerIndex === 1 ? 'bg-indigo-500/20 ring-4 ring-indigo-500 scale-110 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-700/50 opacity-60'}`}>
                      <p className="text-[10px] uppercase font-black opacity-40">{t('player2')}</p>
                      <p className="text-3xl font-black">{players[1].score}</p>
                      {currentPlayerIndex === 1 && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-pulse">
                          {t('activeTurn')}
                        </div>
                      )}
                    </div>
                  )}
               </div>
               <div className="flex flex-col items-center">
                  <div className="font-mono text-4xl font-black bg-black/40 px-8 py-3 rounded-2xl tabular-nums shadow-inner border border-white/5">{formatTime(seconds)}</div>
                  {settings.playersCount === 1 && bestTime !== null && <p className="text-[10px] mt-2 font-bold uppercase tracking-widest text-cyan-500/50">{t('bestTime')}: {formatTime(bestTime)}</p>}
               </div>
               <div className="flex gap-3">
                 <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-xl transition-all ${!isMuted ? 'bg-cyan-500 text-white shadow-lg' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                   <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                 </button>
                 <button onClick={() => setStatus(GameStatus.SETUP)} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all"><i className="fas fa-home"></i></button>
               </div>
             </div>
             <div className={`grid gap-4 sm:gap-6 ${settings.pairsCount > 15 ? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-10' : settings.pairsCount > 12 ? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8' : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6'}`}>
                {cards.map(c => <CardComponent key={c.id} card={c} onClick={handleCardClick} disabled={isProcessing} />)}
             </div>
          </div>
        )}

        {status === GameStatus.FINISHED && (
          <div className="max-w-md w-full bg-slate-800 p-10 rounded-[2.5rem] text-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden animate-fade-in">
            {isNewRecord && <div className="absolute top-6 right-6 bg-yellow-400 text-black px-4 py-2 rounded-full text-xs font-black animate-bounce shadow-xl">{t('newRecord')}</div>}
            <div className="text-7xl mb-6">🏆</div>
            <h2 className="text-4xl font-black mb-10 text-white">
              {settings.playersCount === 2 
                ? (players[0].score > players[1].score ? `${t('player1')} 👑` : players[1].score > players[0].score ? `${t('player2')} 👑` : t('draw')) 
                : 'CONGRATS!'}
            </h2>
            
            <div className="bg-black/30 backdrop-blur-md p-8 rounded-3xl mb-10 flex flex-col gap-6 border border-white/5 shadow-inner">
               {settings.playersCount === 2 ? (
                 <div className="flex justify-around items-center py-4 px-2 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase opacity-30 mb-3">{t('player1')}</p>
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black border-4 transition-all duration-700 ${players[0].score > players[1].score ? 'border-cyan-500 bg-cyan-500/20 scale-110 shadow-[0_0_25px_rgba(34,211,238,0.5)]' : 'border-slate-700'}`}>
                        {players[0].score}
                      </div>
                    </div>
                    <div className="text-3xl font-black opacity-10 mx-2 italic">VS</div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase opacity-30 mb-3">{t('player2')}</p>
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black border-4 transition-all duration-700 ${players[1].score > players[0].score ? 'border-indigo-500 bg-indigo-500/20 scale-110 shadow-[0_0_25px_rgba(99,102,241,0.5)]' : 'border-slate-700'}`}>
                        {players[1].score}
                      </div>
                    </div>
                 </div>
               ) : null}

               <div className="flex justify-around items-center border-t border-white/5 pt-6">
                 <div className="text-center">
                   <p className="text-[10px] font-black uppercase opacity-30 mb-1">{t('time')}</p>
                   <p className="text-3xl font-black tabular-nums">{formatTime(seconds)}</p>
                 </div>
                 <div className="w-px h-12 bg-white/10"></div>
                 <div className="text-center">
                   <p className="text-[10px] font-black uppercase opacity-30 mb-1">{t('theme')}</p>
                   <p className="text-xl font-bold truncate max-w-[120px] text-indigo-400">{customTheme || t(`themes.${settings.theme}`)}</p>
                 </div>
               </div>
               
               {settings.playersCount === 1 && (
                 <div className="pt-6 border-t border-white/5">
                   <p className="text-[10px] font-black uppercase opacity-30 mb-1">{t('bestTime')}</p>
                   <p className="text-2xl font-black text-cyan-400 tabular-nums">{formatTime(bestTime || seconds)}</p>
                 </div>
               )}
            </div>
            
            <button onClick={() => { setStatus(GameStatus.SETUP); speak(t('playAgain')); }} className="w-full py-5 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-2xl font-black text-xl shadow-2xl hover:scale-[1.05] transition-all transform active:scale-95 text-white">{t('playAgain')}</button>
          </div>
        )}
      </div>

      <footer className="mt-16 text-center text-[10px] font-bold opacity-30 space-y-3 tracking-widest uppercase">
         <p>&copy; Noam Gold AI 2026 | {t('feedback')}: <a href="mailto:goldnoamai@gmail.com" className="underline hover:text-cyan-400 transition-colors">goldnoamai@gmail.com</a></p>
         <div className="flex justify-center gap-6 text-base">
            <i className="fab fa-accessible-icon"></i>
            <i className="fas fa-brain"></i>
            <i className="fas fa-wifi"></i>
         </div>
      </footer>
    </div>
  );
};

export default App;
