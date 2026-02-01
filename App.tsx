import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Card, Player, GameSettings, FontSize, LanguageCode, GameHistoryEntry } from './types';
import { generateThemeImages } from './services/geminiService';
import CardComponent from './components/CardComponent';

const TRANSLATIONS: Record<LanguageCode, any> = {
  he: {
    title: 'Memory Gallery Master',
    pairs: 'זוגות',
    players: 'מצב משחק',
    single: 'שחקן 1',
    multi: '2 שחקנים',
    start: 'התחל',
    theme: 'נושא',
    loading: 'אוצר לוח תמונות...',
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
    title: 'Memory Gallery Master',
    pairs: 'Pairs',
    players: 'Mode',
    single: '1 Player',
    multi: '2 Players',
    start: 'Start',
    theme: 'Theme',
    loading: 'Curating Gallery...',
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
  zh: { title: '记忆画廊', start: '开始', theme: '主题', loading: '正在策划...', bestTime: '最佳', newRecord: '新纪录！', music: '音乐', history: '历史', activeTurn: '轮到你了！', clearAllData: '重置数据', confirmClear: '确定删除吗？' },
  hi: { title: 'मेमोरी गैलरी', start: 'शुरू करें', theme: 'विषय', loading: 'तैयारी...', bestTime: 'सर्वश्रेष्ठ', newRecord: 'नया रिकॉर्ड!', music: 'संगीत', history: 'इतिहास', activeTurn: 'बारी!', clearAllData: 'डेटा साफ़ करें', confirmClear: 'डेटा हटाएं?' },
  de: { title: 'Gedächtnis Galerie', start: 'Start', theme: 'Thema', loading: 'Kuratieren...', bestTime: 'Bestzeit', newRecord: 'Rekord!', music: 'Musik', history: 'Verlauf', activeTurn: 'Dran!', clearAllData: 'Reset', confirmClear: 'Daten löschen?' },
  es: { title: 'Galería de Memoria', start: 'Empezar', theme: 'Tema', loading: 'Preparando...', bestTime: 'Mejor', newRecord: '¡Récord!', music: 'Música', history: 'Historial', activeTurn: '¡Turno!', clearAllData: 'Borrar todo', confirmClear: '¿Borrar todo?' },
  fr: { title: 'Galerie de Mémoire', start: 'Démarrer', theme: 'Thème', loading: 'Préparation...', bestTime: 'Meilleur', newRecord: 'Record!', music: 'Musique', history: 'Historique', activeTurn: 'À toi !', clearAllData: 'Effacer', confirmClear: 'Effacer ?' }
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
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 lg:p-12 relative overflow-hidden gallery-spotlight">
      <div className="w-full max-w-[1600px] flex-1 flex items-center justify-center">
        {status === GameStatus.SETUP && (
          <div className="max-w-xl w-full mx-auto bg-slate-900/80 backdrop-blur-3xl p-6 sm:p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="flex gap-2">
                {['he', 'en'].map(l => (
                  <button key={l} onClick={() => setSettings({...settings, lang: l as LanguageCode})} className={`px-4 py-2 text-xs rounded-xl font-black transition-all ${settings.lang === l ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
              <div className="flex gap-4 items-center">
                <button onClick={() => { setIsMuted(!isMuted); speak(!isMuted ? 'Muted' : 'Unmuted'); }} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${!isMuted ? 'bg-cyan-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}><i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i></button>
                <div className="flex gap-3">
                  <button onClick={() => { setSettings({...settings, uiTheme: 'dark'}); speak('Dark'); }} className="w-7 h-7 rounded-full bg-slate-950 border-2 border-white/20 hover:scale-125 transition-transform"></button>
                  <button onClick={() => { setSettings({...settings, uiTheme: 'bright'}); speak('Bright'); }} className="w-7 h-7 rounded-full bg-white border-2 border-slate-300 hover:scale-125 transition-transform"></button>
                  <button onClick={() => { setSettings({...settings, uiTheme: 'colorful'}); speak('Color'); }} className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 border-2 border-white/20 hover:scale-125 transition-transform"></button>
                </div>
              </div>
            </div>

            {!showHistory ? (
              <div className="animate-fade-in relative z-10">
                <h1 className="text-4xl sm:text-6xl font-black mb-12 text-center bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent drop-shadow-2xl">{t('title')}</h1>
                <div className="space-y-10">
                  <div>
                    <label className="block text-xs font-black mb-5 opacity-40 uppercase tracking-[0.3em]">{t('theme')}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {THEME_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => { setSettings({...settings, theme: opt}); setCustomTheme(''); speak(t(`themes.${opt}`)); }} className={`py-4 px-3 text-sm font-black rounded-[1.5rem] border-2 transition-all ${settings.theme === opt && !customTheme ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.2)] text-white' : 'border-slate-800 text-slate-500 hover:border-slate-600'}`}>{t(`themes.${opt}`)}</button>
                      ))}
                      <div className="relative flex items-center col-span-1 sm:col-span-1">
                        <input 
                          type="text" placeholder={t('custom')} value={customTheme} 
                          onChange={(e) => setCustomTheme(e.target.value)} 
                          onDrop={handleDrop}
                          className={`w-full py-4 pl-4 pr-10 rounded-[1.5rem] border-2 bg-black/40 text-sm focus:outline-none focus:border-cyan-500 transition-all font-bold ${customTheme ? 'border-cyan-500' : 'border-slate-800'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-10 items-center bg-black/40 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                     <div className="flex-1 w-full">
                       <div className="flex justify-between items-center mb-6">
                        <label className="text-xs font-black opacity-30 uppercase tracking-[0.2em]">{t('pairs')}</label>
                        <span className="text-cyan-400 font-black text-2xl">{settings.pairsCount}</span>
                       </div>
                       <input type="range" min="4" max="24" step="2" value={settings.pairsCount} onChange={(e) => setSettings({...settings, pairsCount: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-800 rounded-full accent-cyan-500 appearance-none cursor-pointer" />
                     </div>
                     <div className="flex gap-4">
                       {(['small', 'medium', 'large'] as FontSize[]).map(f => (
                         <button key={f} onClick={() => { setSettings({...settings, fontSize: f}); speak(f); }} className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-sm transition-all ${settings.fontSize === f ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-slate-800 text-slate-600 hover:border-slate-700'}`}>{f[0].toUpperCase()}</button>
                       ))}
                     </div>
                  </div>

                  <div className="flex gap-5">
                    <button onClick={() => { setSettings({...settings, playersCount: 1}); speak(t('single')); }} className={`flex-1 py-5 rounded-[2rem] border-2 text-sm font-black transition-all flex items-center justify-center gap-3 ${settings.playersCount === 1 ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-slate-800 text-slate-600'}`}><i className="fas fa-user-crown"></i> {t('single')}</button>
                    <button onClick={() => { setSettings({...settings, playersCount: 2}); speak(t('multi')); }} className={`flex-1 py-5 rounded-[2rem] border-2 text-sm font-black transition-all flex items-center justify-center gap-3 ${settings.playersCount === 2 ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-slate-800 text-slate-600'}`}><i className="fas fa-users-crown"></i> {t('multi')}</button>
                  </div>

                  <div className="flex gap-5 pt-6">
                    <button onClick={startGame} className="flex-[4] py-6 bg-gradient-to-b from-cyan-500 to-indigo-600 rounded-[2.5rem] text-2xl font-black shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-95 transition-all text-white uppercase tracking-widest">{t('start')}</button>
                    <button onClick={() => { setShowHistory(true); speak(t('history')); }} className="flex-1 py-6 bg-slate-800/50 rounded-[2.5rem] text-white/50 hover:bg-slate-800 transition-all border border-white/5"><i className="fas fa-scroll-old text-2xl"></i></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in flex flex-col h-[500px] relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black uppercase tracking-widest">{t('history')}</h2>
                  <button onClick={() => setShowHistory(false)} className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center hover:text-white transition-all"><i className="fas fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-5 pr-4 custom-scrollbar">
                  {history.length === 0 ? <p className="text-center opacity-30 mt-20 italic text-lg">{t('noHistory')}</p> : history.map(entry => (
                    <div key={entry.id} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 shadow-sm group hover:border-white/10 transition-all">
                       <div className="flex justify-between opacity-30 mb-4 text-[10px] font-black uppercase tracking-[0.2em]"><span>{entry.date}</span><span>{entry.theme}</span></div>
                       <div className="flex justify-between font-black items-center">
                        <span className="text-indigo-300 text-base">P1: {entry.p1Score} | P2: {entry.p2Score}</span>
                        <span className="text-cyan-400 font-mono text-2xl tracking-tighter">{formatTime(entry.duration)}</span>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="pt-8 mt-4 border-t border-white/5">
                  <button onClick={() => { if(confirm(t('confirmClear'))) { localStorage.clear(); setHistory([]); setBestTime(null); speak(t('clearSuccess')); } }} className="w-full py-5 text-xs text-red-400/60 font-black uppercase tracking-widest bg-red-500/5 rounded-[2rem] border border-red-500/10 hover:bg-red-500/10 transition-all">{t('clearAllData')}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {status === GameStatus.LOADING && (
          <div className="text-center p-16 max-w-lg w-full animate-fade-in bg-slate-900/60 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)]">
            <div className="relative w-36 h-36 mx-auto mb-12">
              <div className="absolute inset-0 border-[8px] border-indigo-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-[8px] border-t-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-6 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
                <i className="fas fa-palette text-white text-4xl"></i>
              </div>
            </div>
            <h2 className="text-3xl font-black mb-6 uppercase tracking-[0.3em] text-white">{t('loading')}</h2>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
               <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <p className="text-slate-500 text-sm font-bold opacity-60 uppercase tracking-widest">{loadingText}</p>
          </div>
        )}

        {status === GameStatus.PLAYING && (
          <div className="w-full flex flex-col h-[95vh] animate-fade-in">
             <div className="flex justify-between items-center mb-10 bg-slate-900/40 p-6 sm:p-8 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl mx-auto w-full max-w-6xl">
                <div className="flex gap-6">
                  <div className={`px-8 py-4 rounded-[2rem] text-center transition-all ${currentPlayerIndex === 0 && settings.playersCount === 2 ? 'ring-4 ring-cyan-500/50 bg-cyan-500/10 shadow-[0_0_40px_rgba(34,211,238,0.2)]' : 'bg-slate-800/40 opacity-40'}`}>
                    <p className="text-[10px] uppercase font-black opacity-40 mb-1">{t('player1')}</p>
                    <p className="text-4xl font-black text-cyan-400 tracking-tighter">{players[0].score}</p>
                  </div>
                  {settings.playersCount === 2 && (
                    <div className={`px-8 py-4 rounded-[2rem] text-center transition-all ${currentPlayerIndex === 1 ? 'ring-4 ring-indigo-500/50 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]' : 'bg-slate-800/40 opacity-40'}`}>
                      <p className="text-[10px] uppercase font-black opacity-40 mb-1">{t('player2')}</p>
                      <p className="text-4xl font-black text-indigo-400 tracking-tighter">{players[1].score}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-mono text-5xl font-black text-white px-10 py-4 rounded-[2.5rem] bg-black/50 shadow-inner border border-white/5 tabular-nums tracking-tighter">{formatTime(seconds)}</div>
                  {settings.playersCount === 1 && bestTime !== null && <p className="text-[10px] mt-3 font-black text-cyan-500/40 uppercase tracking-[0.2em]">{t('bestTime')}: {formatTime(bestTime)}</p>}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => { setIsMuted(!isMuted); speak(!isMuted ? 'Muted' : 'Unmuted'); }} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${!isMuted ? 'bg-cyan-500 text-white shadow-xl' : 'bg-slate-800 text-slate-500'}`}><i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-xl`}></i></button>
                  <button onClick={() => { setStatus(GameStatus.SETUP); speak(t('mainMenu')); }} className="w-14 h-14 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-center transition-all text-white border border-white/5 shadow-xl"><i className="fas fa-th-large text-xl"></i></button>
                </div>
             </div>
             
             {/* The Enhanced Gallery Board */}
             <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-20">
               <div className="game-grid">
                  {cards.map(c => <CardComponent key={c.id} card={c} onClick={handleCardClick} disabled={isProcessing} />)}
               </div>
             </div>
          </div>
        )}

        {status === GameStatus.FINISHED && (
          <div className="max-w-2xl w-full bg-slate-900/80 p-12 rounded-[4rem] text-center shadow-[0_60px_120px_rgba(0,0,0,0.8)] border border-white/10 animate-fade-in relative overflow-hidden backdrop-blur-3xl">
            {isNewRecord && <div className="absolute top-10 right-10 bg-yellow-400 text-black px-8 py-3 rounded-full text-xs font-black animate-bounce shadow-2xl uppercase tracking-[0.3em]">{t('newRecord')}</div>}
            <div className="text-9xl mb-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">🏅</div>
            <h2 className="text-6xl font-black mb-12 text-white tracking-tight">
              {settings.playersCount === 2 
                ? (players[0].score > players[1].score ? `${t('player1')} 👑` : players[1].score > players[0].score ? `${t('player2')} 👑` : t('draw')) 
                : 'GALLERY COMPLETE'}
            </h2>
            <div className="bg-black/40 backdrop-blur-xl p-12 rounded-[3rem] mb-12 flex flex-col gap-10 border border-white/5 shadow-inner">
               <div className="flex justify-around items-center">
                 <div className="text-center">
                   <p className="text-xs uppercase font-black opacity-30 mb-4 tracking-[0.3em]">{t('time')}</p>
                   <p className="text-6xl font-black text-white tabular-nums tracking-tighter">{formatTime(seconds)}</p>
                 </div>
                 <div className="w-[2px] h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                 <div className="text-center">
                   <p className="text-xs uppercase font-black opacity-30 mb-4 tracking-[0.3em]">{t('pairs')}</p>
                   <p className="text-6xl font-black text-indigo-400 tabular-nums tracking-tighter">{settings.pairsCount}</p>
                 </div>
               </div>
               {settings.playersCount === 1 && bestTime !== null && (
                 <div className="pt-10 border-t border-white/5">
                    <p className="text-xs uppercase font-black opacity-30 mb-4 tracking-[0.3em]">{t('bestTime')}</p>
                    <p className="text-5xl font-black text-cyan-400 tabular-nums tracking-tighter">{formatTime(bestTime)}</p>
                 </div>
               )}
            </div>
            <button onClick={() => { setStatus(GameStatus.SETUP); speak(t('playAgain')); }} className="w-full py-7 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-[2.5rem] font-black text-2xl text-white shadow-2xl hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-[0.2em]">{t('playAgain')}</button>
          </div>
        )}
      </div>

      <footer className="mt-16 text-center text-[10px] font-black opacity-20 tracking-[0.5em] uppercase pb-10 space-y-5 relative z-10">
         <p>&copy; Noam Gold AI 2026 | Museum Edition | Feedback: <a href="mailto:goldnoamai@gmail.com" className="underline hover:text-cyan-400 transition-colors">goldnoamai@gmail.com</a></p>
         <div className="flex justify-center gap-10 text-xl">
           <i className="fas fa-feather-pointed" title="Curated Experience"></i>
           <i className="fas fa-crown" title="Premium Edition"></i>
           <i className="fas fa-infinity" title="Endless Memory"></i>
         </div>
      </footer>
    </div>
  );
};

export default App;