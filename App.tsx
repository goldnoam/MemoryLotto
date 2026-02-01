
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Card, Player, GameSettings, FontSize, LanguageCode, GameHistoryEntry } from './types';
import { generateThemeImages } from './services/geminiService';
import CardComponent from './components/CardComponent';

const TRANSLATIONS: Record<LanguageCode, any> = {
  he: {
    title: 'לוטו זיכרון Master',
    pairs: 'זוגות',
    players: 'מצב משחק',
    single: 'שחקן 1',
    multi: '2 שחקנים',
    start: 'התחל',
    theme: 'נושא',
    loading: 'טוען לוח...',
    mainMenu: 'תפריט',
    player1: 'שחקן 1',
    player2: 'שחקן 2',
    time: 'זמן',
    left: 'נותרו',
    winner: 'המנצח:',
    draw: 'תיקו!',
    playAgain: 'שחק שוב',
    bestTime: 'שיא',
    newRecord: 'שיא חדש!',
    feedback: 'משוב',
    custom: 'נושא חופשי...',
    music: 'מוזיקה',
    mute: 'השתק',
    unmute: 'צליל',
    export: 'ייצא',
    clear: 'נקה',
    history: 'היסטוריה',
    noHistory: 'אין היסטוריה',
    clearHistory: 'מחק היסטוריה',
    clearAllData: 'איפוס מלא',
    clearSuccess: 'אופס בהצלחה',
    confirmClear: 'למחוק הכל?',
    score: 'ניקוד',
    activeTurn: 'תורך!',
    themes: { animals: 'חיות', space: 'חלל', food: 'אוכל', nature: 'טבע', robots: 'רובוטים' }
  },
  en: {
    title: 'Memory Master',
    pairs: 'Pairs',
    players: 'Mode',
    single: '1 Player',
    multi: '2 Players',
    start: 'Start',
    theme: 'Theme',
    loading: 'Loading...',
    mainMenu: 'Menu',
    player1: 'P1',
    player2: 'P2',
    time: 'Time',
    left: 'Left',
    winner: 'Winner:',
    draw: 'Draw!',
    playAgain: 'Play Again',
    bestTime: 'Best',
    newRecord: 'Record!',
    feedback: 'Feedback',
    custom: 'Custom theme...',
    music: 'Music',
    mute: 'Mute',
    unmute: 'Sound',
    export: 'Export',
    clear: 'Clear',
    history: 'History',
    noHistory: 'Empty',
    clearHistory: 'Clear History',
    clearAllData: 'Factory Reset',
    clearSuccess: 'Reset successful',
    confirmClear: 'Clear all data?',
    score: 'Score',
    activeTurn: 'Your Turn!',
    themes: { animals: 'Animals', space: 'Space', food: 'Food', nature: 'Nature', robots: 'Robots' }
  },
  zh: { title: '记忆大师', start: '开始', theme: '主题', loading: '准备中...', bestTime: '最佳', newRecord: '新纪录！', music: '音乐', history: '历史', activeTurn: '轮到你了！', clearAllData: '重置数据', confirmClear: '确定删除吗？' },
  hi: { title: 'मेमोरी मास्टर', start: 'शुरू करें', theme: 'विषय', loading: 'तैयारी...', bestTime: 'सर्वश्रेष्ठ', newRecord: 'नया रिकॉर्ड!', music: 'संगीत', history: 'इतिहास', activeTurn: 'बारी!', clearAllData: 'डेटा साफ़ करें', confirmClear: 'डेटा हटाएं?' },
  de: { title: 'Memory Meister', start: 'Start', theme: 'Thema', loading: 'Vorbereitung...', bestTime: 'Bestzeit', newRecord: 'Rekord!', music: 'Musik', history: 'Verlauf', activeTurn: 'Dran!', clearAllData: 'Reset', confirmClear: 'Daten löschen?' },
  es: { title: 'Maestro de Memoria', start: 'Empezar', theme: 'Tema', loading: 'Preparando...', bestTime: 'Mejor', newRecord: '¡Récord!', music: 'Música', history: 'Historial', activeTurn: '¡Turno!', clearAllData: 'Borrar todo', confirmClear: '¿Borrar todo?' },
  fr: { title: 'Maître de Mémoire', start: 'Démarrer', theme: 'Thème', loading: 'Préparation...', bestTime: 'Meilleur', newRecord: 'Record!', music: 'Musique', history: 'Historique', activeTurn: 'À toi !', clearAllData: 'Effacer', confirmClear: 'Effacer ?' }
};

const THEME_OPTIONS = ['animals', 'space', 'food', 'nature', 'robots'];

const App: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings>({
    pairsCount: 8,
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
    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-ambient-tech-lounge-425.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    audioRef.current = audio;

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
    const finalTheme = customTheme || settings.theme;
    
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
        }, 400); 
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text');
    if (text) setCustomTheme(text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 lg:p-12 relative overflow-hidden">
      <div className="w-full max-w-6xl flex-1 flex items-center justify-center">
        {status === GameStatus.SETUP && (
          <div className="max-w-xl w-full mx-auto bg-slate-800/90 backdrop-blur-3xl p-6 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-in relative">
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-2">
                {['he', 'en'].map(l => (
                  <button key={l} onClick={() => setSettings({...settings, lang: l as LanguageCode})} className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all ${settings.lang === l ? 'bg-cyan-500 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
              <div className="flex gap-4 items-center">
                <button onClick={() => { setIsMuted(!isMuted); speak(!isMuted ? 'Muted' : 'Unmuted'); }} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${!isMuted ? 'bg-cyan-500 text-white shadow-lg' : 'bg-slate-700 text-slate-400'}`}><i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i></button>
                <div className="flex gap-2.5">
                  <button onClick={() => { setSettings({...settings, uiTheme: 'dark'}); speak('Dark Theme'); }} className="w-6 h-6 rounded-full bg-slate-900 border-2 border-white/20 hover:scale-110 transition-transform"></button>
                  <button onClick={() => { setSettings({...settings, uiTheme: 'bright'}); speak('Bright Theme'); }} className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 hover:scale-110 transition-transform"></button>
                  <button onClick={() => { setSettings({...settings, uiTheme: 'colorful'}); speak('Colorful Theme'); }} className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 border-2 border-white/20 hover:scale-110 transition-transform"></button>
                </div>
              </div>
            </div>

            {!showHistory ? (
              <div className="animate-fade-in">
                <h1 className="text-4xl sm:text-5xl font-black mb-10 text-center bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-md">{t('title')}</h1>
                <div className="space-y-8">
                  <div>
                    <label className="block text-xs font-bold mb-4 opacity-70 uppercase tracking-[0.2em]">{t('theme')}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {THEME_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => { setSettings({...settings, theme: opt}); setCustomTheme(''); speak(t(`themes.${opt}`)); }} className={`py-3 px-2 text-sm font-bold rounded-2xl border-2 transition-all ${settings.theme === opt && !customTheme ? 'border-cyan-500 bg-cyan-500/10 shadow-lg' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>{t(`themes.${opt}`)}</button>
                      ))}
                      <div className="relative flex items-center col-span-1 sm:col-span-1">
                        <input 
                          type="text" placeholder={t('custom')} value={customTheme} 
                          onChange={(e) => setCustomTheme(e.target.value)} 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          className={`w-full py-3 pl-4 pr-10 rounded-2xl border-2 bg-slate-900/50 text-sm focus:outline-none focus:border-cyan-500 transition-all ${customTheme ? 'border-cyan-500' : 'border-slate-700'}`}
                        />
                        {customTheme && <button onClick={() => setCustomTheme('')} className="absolute right-3 text-slate-500 hover:text-white"><i className="fas fa-times-circle"></i></button>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-8 items-center bg-slate-900/30 p-6 rounded-3xl border border-white/5 shadow-inner">
                     <div className="flex-1 w-full">
                       <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-bold opacity-70 uppercase tracking-widest">{t('pairs')}</label>
                        <span className="text-cyan-400 font-black text-lg">{settings.pairsCount}</span>
                       </div>
                       <input type="range" min="4" max="24" step="2" value={settings.pairsCount} onChange={(e) => setSettings({...settings, pairsCount: parseInt(e.target.value)})} className="w-full h-2 bg-slate-700 rounded-lg accent-cyan-500 appearance-none cursor-pointer" />
                     </div>
                     <div className="flex gap-3">
                       {(['small', 'medium', 'large'] as FontSize[]).map(f => (
                         <button key={f} onClick={() => { setSettings({...settings, fontSize: f}); speak(f); }} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all ${settings.fontSize === f ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10 shadow-md' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>{f[0].toUpperCase()}</button>
                       ))}
                     </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => { setSettings({...settings, playersCount: 1}); speak(t('single')); }} className={`flex-1 py-4 rounded-3xl border-2 text-sm font-black transition-all flex items-center justify-center gap-2 ${settings.playersCount === 1 ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-lg' : 'border-slate-700 text-slate-400'}`}><i className="fas fa-user"></i> {t('single')}</button>
                    <button onClick={() => { setSettings({...settings, playersCount: 2}); speak(t('multi')); }} className={`flex-1 py-4 rounded-3xl border-2 text-sm font-black transition-all flex items-center justify-center gap-2 ${settings.playersCount === 2 ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-lg' : 'border-slate-700 text-slate-400'}`}><i className="fas fa-users"></i> {t('multi')}</button>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={startGame} className="flex-[4] py-5 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-3xl text-xl font-black shadow-2xl hover:scale-[1.03] active:scale-95 transition-all text-white uppercase tracking-widest">{t('start')}</button>
                    <button onClick={() => { setShowHistory(true); speak(t('history')); }} className="flex-1 py-5 bg-slate-700/50 rounded-3xl text-white/70 hover:bg-slate-700 transition-colors"><i className="fas fa-history text-xl"></i></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in flex flex-col h-[450px]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black uppercase tracking-[0.1em]">{t('history')}</h2>
                  <button onClick={() => setShowHistory(false)} className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:text-white transition-colors"><i className="fas fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
                  {history.length === 0 ? <p className="text-center opacity-40 mt-12 italic text-sm">{t('noHistory')}</p> : history.map(entry => (
                    <div key={entry.id} className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 text-sm shadow-sm">
                       <div className="flex justify-between opacity-50 mb-3 text-[10px] font-bold uppercase tracking-widest"><span>{entry.date}</span><span>{entry.theme}</span></div>
                       <div className="flex justify-between font-black items-center">
                        <span className="text-indigo-400">P1: {entry.p1Score} | P2: {entry.p2Score}</span>
                        <span className="text-cyan-400 font-mono text-lg">{formatTime(entry.duration)}</span>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/10">
                  <button onClick={() => { if(confirm(t('confirmClear'))) { localStorage.clear(); setHistory([]); setBestTime(null); speak(t('clearSuccess')); } }} className="w-full py-4 text-xs text-red-400 font-black uppercase tracking-[0.2em] bg-red-500/5 rounded-2xl border border-red-500/20 hover:bg-red-500/10 transition-all">{t('clearAllData')}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {status === GameStatus.LOADING && (
          <div className="text-center p-12 max-w-md w-full animate-fade-in bg-slate-800/50 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl">
            <div className="relative w-28 h-28 mx-auto mb-10">
              <div className="absolute inset-0 border-[6px] border-indigo-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-t-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <i className="fas fa-brain text-white text-3xl animate-pulse"></i>
              </div>
            </div>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-widest">{t('loading')}</h2>
            <p className="text-slate-400 text-sm font-mono opacity-60">{loadingText}</p>
          </div>
        )}

        {status === GameStatus.PLAYING && (
          <div className="w-full flex flex-col h-[90vh] max-h-[850px] animate-fade-in">
             <div className="flex justify-between items-center mb-6 bg-slate-800/60 p-5 rounded-[2rem] border border-white/10 backdrop-blur-2xl shadow-2xl">
                <div className="flex gap-3">
                  <div className={`px-5 py-3 rounded-2xl text-center transition-all ${currentPlayerIndex === 0 && settings.playersCount === 2 ? 'ring-2 ring-cyan-500 bg-cyan-500/15 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-700/50 opacity-60'}`}>
                    <p className="text-[10px] uppercase font-black opacity-40">{t('player1')}</p>
                    <p className="text-2xl font-black text-cyan-400">{players[0].score}</p>
                  </div>
                  {settings.playersCount === 2 && (
                    <div className={`px-5 py-3 rounded-2xl text-center transition-all ${currentPlayerIndex === 1 ? 'ring-2 ring-indigo-500 bg-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-slate-700/50 opacity-60'}`}>
                      <p className="text-[10px] uppercase font-black opacity-40">{t('player2')}</p>
                      <p className="text-2xl font-black text-indigo-400">{players[1].score}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-mono text-3xl font-black bg-black/40 px-6 py-2 rounded-2xl tabular-nums shadow-inner border border-white/5 tracking-tighter">{formatTime(seconds)}</div>
                  {settings.playersCount === 1 && bestTime !== null && <p className="text-[10px] mt-1 font-bold text-cyan-500/60 uppercase">{t('bestTime')}: {formatTime(bestTime)}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setIsMuted(!isMuted); speak(!isMuted ? 'Muted' : 'Unmuted'); }} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${!isMuted ? 'bg-cyan-500/20 text-cyan-400 shadow-md' : 'bg-slate-700/50 text-slate-500'}`}><i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i></button>
                  <button onClick={() => { setStatus(GameStatus.SETUP); speak(t('mainMenu')); }} className="w-12 h-12 bg-slate-700/50 hover:bg-slate-700 rounded-2xl flex items-center justify-center transition-all text-white/80"><i className="fas fa-home text-lg"></i></button>
                </div>
             </div>
             
             {/* Main Scrollable Image Gallery (Game Board) */}
             <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
               <div className="game-grid pb-16">
                  {cards.map(c => <CardComponent key={c.id} card={c} onClick={handleCardClick} disabled={isProcessing} />)}
               </div>
             </div>
          </div>
        )}

        {status === GameStatus.FINISHED && (
          <div className="max-w-md w-full bg-slate-800 p-10 rounded-[3rem] text-center shadow-[0_40px_80px_rgba(0,0,0,0.7)] border border-white/10 animate-fade-in relative overflow-hidden">
            {isNewRecord && <div className="absolute top-8 right-8 bg-yellow-400 text-black px-5 py-2 rounded-full text-[10px] font-black animate-bounce shadow-xl uppercase tracking-widest">{t('newRecord')}</div>}
            <div className="text-7xl mb-6 drop-shadow-lg">🏆</div>
            <h2 className="text-4xl font-black mb-8 text-white">
              {settings.playersCount === 2 
                ? (players[0].score > players[1].score ? `${t('player1')} 👑` : players[1].score > players[0].score ? `${t('player2')} 👑` : t('draw')) 
                : 'VICTORY!'}
            </h2>
            <div className="bg-black/30 backdrop-blur-md p-8 rounded-[2rem] mb-10 flex flex-col gap-6 border border-white/5 shadow-inner">
               <div className="flex justify-around items-center">
                 <div className="text-center">
                   <p className="text-[10px] uppercase font-bold opacity-30 mb-2">{t('time')}</p>
                   <p className="text-4xl font-black text-white">{formatTime(seconds)}</p>
                 </div>
                 <div className="w-px h-16 bg-white/10"></div>
                 <div className="text-center">
                   <p className="text-[10px] uppercase font-bold opacity-30 mb-2">{t('pairs')}</p>
                   <p className="text-4xl font-black text-indigo-400">{settings.pairsCount}</p>
                 </div>
               </div>
               {settings.playersCount === 1 && bestTime !== null && (
                 <div className="pt-6 border-t border-white/5">
                    <p className="text-[10px] uppercase font-bold opacity-30 mb-2">{t('bestTime')}</p>
                    <p className="text-3xl font-black text-cyan-400">{formatTime(bestTime)}</p>
                 </div>
               )}
            </div>
            <button onClick={() => { setStatus(GameStatus.SETUP); speak(t('playAgain')); }} className="w-full py-5 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-3xl font-black text-xl text-white shadow-2xl hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-widest">{t('playAgain')}</button>
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-[10px] font-bold opacity-30 tracking-[0.3em] uppercase pb-6 space-y-3">
         <p>&copy; Noam Gold AI 2026 | Feedback: <a href="mailto:goldnoamai@gmail.com" className="underline hover:text-cyan-400 transition-colors">goldnoamai@gmail.com</a></p>
         <div className="flex justify-center gap-6 text-base opacity-40">
           <i className="fas fa-universal-access" title="Accessibility"></i>
           <i className="fas fa-signal-perfect" title="High Performance"></i>
           <i className="fas fa-shield-halved" title="Privacy Focused"></i>
         </div>
      </footer>
    </div>
  );
};

export default App;
