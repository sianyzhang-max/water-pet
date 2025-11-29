import React, { useState, useEffect } from 'react';
import { Settings, Bell, BellOff, Volume2, VolumeX, RotateCcw, Sparkles, X, Heart, Maximize2, Minimize2, Loader2 } from 'lucide-react';

// ==========================================
// 🔧 配置区域
// ==========================================
// 请将 API Key 粘贴在下方引号中。
// 即使不填，系统也会使用“离线模式”随机回复，保证不会白屏。
const apiKey = "AIzaSyA_GTRPhiQWYz6c7JGgSzzRc7vIHDOCDpM"; 

// ==========================================
// 💬 离线数据
// ==========================================
const defaultMotivations = [
  "主人，你的大脑渴啦！🌱",
  "咕噜咕噜... 我想要喝水！",
  "喝水会让皮肤变好哦 ✨",
  "即使是仙女也要喝水的！",
  "不要等到口渴才想起我~",
  "补充水分，专注力 +100！",
  "你是最棒的，喝口水休息下吧！",
  "今天也要元气满满哦！💧",
  "水是生命之源，也是快乐之源~",
  "摸摸我，然后去喝杯水吧！",
  "我在变瘪... 快救救我 QAQ",
  "没有什么是一杯水解决不了的！"
];

const offlineAdvices = [
  "听起来你需要一个大大的拥抱！🤗 先喝口水，深呼吸，事情会慢慢变好的。(离线模式)",
  "你的感受是完全合理的。现在的你可能只是有点累了，给大脑补点水，休息一下吧。(离线模式)",
  "抱抱！虽然我只是个水精灵，但我会一直陪着你的。喝杯水，我们一起从头再来！(离线模式)",
  "有时候这种感觉就像脱水一样，让人干枯。快去喝杯水，让活力流回身体里！(离线模式)",
  "不要对自己太苛刻啦。你已经做得很棒了！喝口水奖励一下自己吧。(离线模式)"
];

// 音效
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'add') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'win') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) { console.error(e); }
};

// 安全的 API 调用
const callGemini = async (prompt) => {
  // 自动清理 Key 中的空格，防止报错
  const cleanKey = apiKey ? apiKey.trim() : "";
  if (!cleanKey) throw new Error("No API Key");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${cleanKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // 确保返回的一定是字符串，防止 React 渲染对象报错导致白屏
    return typeof text === 'string' ? text : "AI 似乎在发呆，请再说一次...";
  } catch (error) { 
    console.error("Gemini API Error:", error);
    throw error; 
  }
};

const WaterSpirit = ({ percentage, onClick, isHappy, isThinking }) => {
  const getGradient = () => {
    if (percentage < 30) return 'linear-gradient(135deg, #f9a8d4, #fecaca)'; 
    if (percentage < 60) return 'linear-gradient(135deg, #60a5fa, #93c5fd)'; 
    return 'linear-gradient(135deg, #3b82f6, #22d3ee)'; 
  };

  const eyeStyle = {
    width: '12px',
    height: '12px',
    backgroundColor: '#1e293b',
    borderRadius: '50%',
    transition: 'transform 0.3s',
    transform: isThinking ? 'scaleY(0.5)' : percentage < 30 ? 'rotate(12deg)' : isHappy ? 'scaleX(1.25) scaleY(0.5)' : 'none'
  };

  return (
    <div 
      onClick={onClick}
      className={isHappy ? 'anim-bounce' : 'anim-float'}
      style={{
        position: 'relative', width: '160px', height: '160px', cursor: 'pointer', userSelect: 'none', margin: '0 auto'
      }}
    >
      <div className="anim-blob" style={{
        position: 'absolute', inset: 0, borderRadius: '40%', background: getGradient(),
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)', opacity: 0.9, mixBlendMode: 'multiply', transition: 'background 1s'
      }}></div>
      <div className="anim-blob" style={{
        position: 'absolute', inset: 0, borderRadius: '45%', background: getGradient(),
        opacity: 0.8, animationDelay: '-2s', transition: 'background 1s'
      }}></div>
      <div style={{
        position: 'absolute', top: '24px', left: '32px', width: '32px', height: '16px',
        background: 'rgba(255,255,255,0.4)', borderRadius: '99px', transform: 'rotate(-20deg)', filter: 'blur(2px)'
      }}></div>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', paddingTop: '16px'
      }}>
        <div style={{ display: 'flex', gap: '32px', marginBottom: '8px' }}>
          <div className="anim-blink" style={eyeStyle}></div>
          <div className="anim-blink" style={eyeStyle}></div>
        </div>
        <div style={{ width: '16px', height: '8px', marginTop: '4px' }}>
           {percentage < 30 ? (
             <svg viewBox="0 0 20 10" style={{width:'100%', height:'100%', stroke:'#1e293b', fill:'none', strokeWidth:3, transform:'rotate(180deg)', opacity:0.6}}><path d="M2,8 Q10,0 18,8" /></svg>
           ) : isHappy ? (
             <svg viewBox="0 0 20 10" style={{width:'100%', height:'100%', stroke:'#1e293b', fill:'none', strokeWidth:3}}><path d="M2,2 Q10,10 18,2" /></svg>
           ) : (
             <div style={{ width: '8px', height: '8px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '50%', margin: '0 auto' }}></div>
           )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [goal, setGoal] = useState(2000); 
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastDrinkTime, setLastDrinkTime] = useState(Date.now());
  const [showSettings, setShowSettings] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(60); 
  const [miniMode, setMiniMode] = useState(false); 
  const [motivationText, setMotivationText] = useState("主人，记得喝水哦！🌱");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [userFeeling, setUserFeeling] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [aiAdviceLoading, setAiAdviceLoading] = useState(false);
  const [bubblePopKey, setBubblePopKey] = useState(0);

  const fetchNewMotivation = async () => {
    setBubblePopKey(prev => prev + 1);
    if (soundEnabled) playSound('pop');
    
    // 如果没有填 Key，直接使用本地语录，避免请求
    if (!apiKey || !apiKey.trim()) {
      setMotivationText(defaultMotivations[Math.floor(Math.random() * defaultMotivations.length)]);
      return;
    }

    setIsAiLoading(true);
    try {
      const text = await callGemini(`你是一个可爱的桌面水精灵。主人可能有ADHD。说一句简短（15字内）的撒娇或调皮的话催他喝水。`);
      setMotivationText(text);
    } catch {
      setMotivationText(defaultMotivations[Math.floor(Math.random() * defaultMotivations.length)]);
    } finally { setIsAiLoading(false); }
  };

  const analyzeFeeling = async () => {
    if (!userFeeling.trim()) return;
    
    setAiAdviceLoading(true);
    setAiAdvice(""); // 清空旧建议

    // 如果 Key 为空，模拟延时后显示离线建议
    if (!apiKey || !apiKey.trim()) {
      setTimeout(() => {
        const randomAdvice = offlineAdvices[Math.floor(Math.random() * offlineAdvices.length)];
        setAiAdvice(randomAdvice);
        if (soundEnabled) playSound('pop');
        setAiAdviceLoading(false);
      }, 1000);
      return;
    }

    // 在线请求
    try {
      const text = await callGemini(`主人感觉：${userFeeling}。如果是身体不适判断是否缺水，如果是情绪问题给个拥抱。简短回复（40字内）。`);
      setAiAdvice(text);
      if (soundEnabled) playSound('pop');
    } catch (err) {
      // 错误捕获：显示友好的错误信息，而不是白屏
      setAiAdvice("哎呀，AI 暂时连不上... 抱抱你！(请检查网络或 API Key)");
    } finally {
      setAiAdviceLoading(false);
    }
  };

  const requestNotification = () => {
    if (!("Notification" in window)) alert("不支持通知");
    else if (Notification.permission !== "denied") Notification.requestPermission().then(p => p === "granted" && setNotificationsEnabled(true));
  };

  useEffect(() => {
    if (!notificationsEnabled) return;
    const interval = setInterval(() => {
      if ((Date.now() - lastDrinkTime) / 1000 / 60 >= reminderInterval) new Notification("主人！", { body: "该喝水啦！", icon: "/favicon.ico" });
    }, 60000);
    return () => clearInterval(interval);
  }, [notificationsEnabled, lastDrinkTime, reminderInterval]);

  const addWater = (amount) => {
    const newLevel = Math.min(waterLevel + amount, goal + 1000);
    setWaterLevel(newLevel);
    setLastDrinkTime(Date.now());
    if (soundEnabled) playSound('add');
    fetchNewMotivation();
    if (waterLevel < goal && newLevel >= goal) {
      setShowConfetti(true);
      if (soundEnabled) playSound('win');
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const percentage = Math.min((waterLevel / goal) * 100, 100);
  const btnStyle = { border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', transition: 'background 0.2s' };

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', fontFamily: 'sans-serif', color: '#334155', position: 'relative', overflow: 'hidden'
    }}>
      
      {!miniMode && (
         <div style={{position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none'}}>
            <div className="anim-blob" style={{position: 'absolute', top: '10%', left: '10%', width: '250px', height: '250px', background: '#bfdbfe', borderRadius: '50%', filter: 'blur(40px)'}}></div>
            <div className="anim-blob" style={{position: 'absolute', bottom: '10%', right: '10%', width: '250px', height: '250px', background: '#c7d2fe', borderRadius: '50%', filter: 'blur(40px)', animationDelay: '-4s'}}></div>
         </div>
      )}

      {showSettings && (
        <div className="anim-fade-in" style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', width: '280px', border: '1px solid #e2e8f0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
               <h3 style={{margin: 0, fontSize: '18px', fontWeight: 'bold'}}>设置</h3>
               <button onClick={() => setShowSettings(false)} style={btnStyle}><X size={20} color="#94a3b8"/></button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{fontSize: '14px', color: '#64748b', fontWeight: '500'}}>每日目标 (ml)</label>
                <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} style={{width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px'}}/>
              </div>
              <div>
                <label style={{fontSize: '14px', color: '#64748b', fontWeight: '500'}}>提醒间隔 (分钟)</label>
                <select value={reminderInterval} onChange={(e) => setReminderInterval(Number(e.target.value))} style={{width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px'}}>
                  {[30, 45, 60, 90, 120].map(m => <option key={m} value={m}>{m} 分钟</option>)}
                </select>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                 <span style={{fontSize: '14px', color: '#64748b', fontWeight: '500'}}>声音开关</span>
                 <button onClick={() => setSoundEnabled(!soundEnabled)} style={{...btnStyle, background: soundEnabled ? '#dbeafe' : '#f1f5f9', color: soundEnabled ? '#2563eb' : '#94a3b8'}}>
                   {soundEnabled ? <Volume2 size={18}/> : <VolumeX size={18}/>}
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI 诊所弹窗 */}
      {showAiModal && (
        <div className="anim-fade-in" style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '320px', border: '1px solid #e0e7ff', position: 'relative'}}>
            <button onClick={() => setShowAiModal(false)} style={{position: 'absolute', top: '16px', right: '16px', ...btnStyle}}><X size={20} color="#94a3b8"/></button>
            <div style={{textAlign: 'center', marginBottom: '16px'}}>
              <div style={{display: 'inline-block', padding: '12px', background: '#e0e7ff', borderRadius: '50%', marginBottom: '8px'}}><Sparkles size={24} color="#6366f1"/></div>
              <h3 style={{margin: 0, fontSize: '18px', fontWeight: 'bold'}}>水精灵诊所</h3>
            </div>
            {aiAdvice ? (
               <div className="anim-fade-in" style={{background: '#e0e7ff', padding: '16px', borderRadius: '12px', color: '#3730a3', fontSize: '14px', lineHeight: '1.5'}}>
                 {aiAdvice}
                 <button onClick={() => setAiAdvice("")} style={{display: 'block', width: '100%', marginTop: '8px', border: 'none', background: 'transparent', color: '#6366f1', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'}}>再问一次</button>
               </div>
            ) : (
              <>
                <textarea value={userFeeling} onChange={(e) => setUserFeeling(e.target.value)} placeholder="我现在感觉有点..." style={{width: '100%', height: '80px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', resize: 'none', fontSize: '14px', marginBottom: '16px'}}/>
                <button onClick={analyzeFeeling} disabled={aiAdviceLoading || !userFeeling.trim()} style={{width: '100%', padding: '10px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                  {aiAdviceLoading ? <Loader2 className="anim-spin" size={16}/> : "告诉水精灵"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 主界面 */}
      <div style={{transition: 'all 0.5s', transform: miniMode ? 'scale(0.9)' : 'scale(1)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        
        <div style={{position: 'relative', marginBottom: '16px', height: '64px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '250px'}}>
           <div key={bubblePopKey} className="anim-pop-in" style={{background: 'white', border: '2px solid #f1f5f9', padding: '12px 16px', borderRadius: '16px 16px 16px 0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', position: 'relative', transformOrigin: 'bottom left'}}>
              <p style={{margin: 0, fontSize: '14px', fontWeight: '500', color: '#475569', textAlign: 'center', lineHeight: 1.5}}>{isAiLoading ? "思考中..." : motivationText}</p>
              <div style={{position: 'absolute', left: '-4px', bottom: '0', width: '6px', height: '6px', background: 'white', border: '1px solid #f1f5f9', borderRadius: '50%'}}></div>
              <button onClick={(e) => {e.stopPropagation(); fetchNewMotivation();}} style={{position: 'absolute', top: '-8px', right: '-8px', background: '#fef3c7', color: '#d97706', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)'}}><Sparkles size={12}/></button>
           </div>
        </div>

        <WaterSpirit percentage={percentage} isHappy={showConfetti} isThinking={isAiLoading || aiAdviceLoading} onClick={() => addWater(250)} />

        {miniMode && (
          <div className="anim-fade-in" style={{marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
             <div style={{width: '128px', height: '8px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden'}}>
                <div style={{height: '100%', background: '#60a5fa', width: `${percentage}%`, transition: 'width 0.5s'}}></div>
             </div>
             <div style={{display: 'flex', gap: '16px', color: '#94a3b8'}}>
                <button onClick={() => setMiniMode(false)} style={btnStyle}><Maximize2 size={16}/></button>
                <button onClick={() => setWaterLevel(Math.max(0, waterLevel - 250))} style={btnStyle}><RotateCcw size={16}/></button>
             </div>
          </div>
        )}

        {!miniMode && (
          <div className="anim-fade-in" style={{width: '100%', maxWidth: '320px', marginTop: '32px'}}>
            <div style={{textAlign: 'center', marginBottom: '24px'}}>
               <h1 style={{fontSize: '36px', fontWeight: '900', color: '#1e293b', margin: '0 0 4px 0'}}>{waterLevel} <span style={{fontSize: '16px', fontWeight: '400', color: '#64748b'}}>/ {goal} ml</span></h1>
               <div style={{width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden'}}>
                 <div style={{height: '100%', background: 'linear-gradient(to right, #3b82f6, #22d3ee)', width: `${percentage}%`, transition: 'width 1s'}}></div>
               </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '16px'}}>
               <button onClick={() => setShowAiModal(true)} style={{...btnStyle, background: '#e0e7ff', color: '#4f46e5', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', padding: '12px'}}>
                  <Heart size={16} fill="currentColor"/> 心情分析
               </button>
               <button onClick={() => setShowSettings(true)} style={{...btnStyle, background: '#f1f5f9', color: '#475569', justifyContent: 'center'}}>
                  <Settings size={20}/>
               </button>
               <button onClick={() => notificationsEnabled ? setNotificationsEnabled(false) : requestNotification()} style={{...btnStyle, background: notificationsEnabled ? '#dcfce7' : '#f1f5f9', color: notificationsEnabled ? '#16a34a' : '#94a3b8', justifyContent: 'center'}}>
                  {notificationsEnabled ? <Bell size={20}/> : <BellOff size={20}/>}
               </button>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 8px'}}>
               <button onClick={() => setWaterLevel(Math.max(0, waterLevel - 250))} style={{...btnStyle, fontSize: '12px', color: '#94a3b8'}}>撤销</button>
               <button onClick={() => setMiniMode(true)} style={{...btnStyle, fontSize: '12px', color: '#3b82f6', background: '#eff6ff', borderRadius: '99px', padding: '6px 12px', fontWeight: 'bold'}}><Minimize2 size={12}/> 变身桌宠</button>
               <button onClick={() => {setWaterLevel(0); setLastDrinkTime(Date.now())}} style={{...btnStyle, fontSize: '12px', color: '#ef4444'}}>重置</button>
            </div>
          </div>
        )}
      </div>

      {showConfetti && (
        <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="anim-bounce" style={{fontSize: '64px'}}>🎉</div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5px, -10px) scale(1.05); }
          66% { transform: translate(-5px, 5px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes popIn {
          0% { transform: scale(0) translateY(10px); opacity: 0; }
          70% { transform: scale(1.1) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes blink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .anim-blob { animation: blob 6s infinite; }
        .anim-float { animation: float 4s ease-in-out infinite; }
        .anim-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .anim-blink { animation: blink 4s infinite; }
        .anim-bounce { animation: bounce 1s infinite; }
        .anim-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .anim-spin { animation: spin 1s linear infinite; }
        
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { outline: 2px solid #60a5fa; outline-offset: 1px; }
      `}</style>
    </div>
  );
}