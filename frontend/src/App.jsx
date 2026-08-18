import React, { useState, useEffect } from 'react';
import { saveScoreOffline, getPendingScores, clearPendingScores } from './offlineStorage';
import { getStats, awardPoints } from './gamificationEngine';
import LandingScreen from './LandingScreen';
import ClassView from './ClassView';
import { useVoice } from './VoiceContext';

function App() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [simulateOffline, setSimulateOffline] = useState(false);
    
    // UI Routing State
    const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing' | 'classview'
    const [activeClass, setActiveClass] = useState(null);

    // Visual Console
    const [consoleLogs, setConsoleLogs] = useState([]);
    
    // Gamification
    const [stats, setStats] = useState(getStats());

    const { latestIntent, setLatestIntent } = useVoice();

    const isEffectivelyOnline = isOnline && !simulateOffline;

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (isOnline && !simulateOffline) {
            syncPendingScores();
        }
    }, [isOnline, simulateOffline]);

    const addLog = (msg) => {
        setConsoleLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg }]);
    };

    const syncPendingScores = async () => {
        const pending = await getPendingScores();
        if (pending.length > 0) {
            try {
                const response = await fetch('/api/sync-scores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pending)
                });
                if (response.ok) {
                    await clearPendingScores();
                    addLog(`Synced ${pending.length} offline actions to server!`);
                }
            } catch (error) {
                console.error("Failed to sync pending scores", error);
            }
        }
    };

    // Global Voice Routing — handles Back and Navigate intents at the app level
    useEffect(() => {
        if (!latestIntent) return;
        const { actionIntent, parsedClass } = latestIntent;

        if (actionIntent === 'Back') {
            if (currentScreen !== 'landing') {
                setCurrentScreen('landing');
                setActiveClass(null);
                addLog('🗣️ Voice: Going back to home');
            }
            setLatestIntent(null);
            return;
        }

        if (actionIntent === 'Navigate' && parsedClass !== null) {
            handleSelectClass(parsedClass);
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(`Opening Class ${parsedClass}`);
                window.speechSynthesis.speak(u);
            }
            setLatestIntent(null);
        }
    }, [latestIntent, currentScreen, setLatestIntent]);

    const handleOfflineAction = async (actionType, item) => {
        const data = { 
            type: actionType, 
            class: item.class, 
            subject: item.subject, 
            itemTitle: item.chapterTitle,
            timestamp: new Date().toISOString() 
        };

        const newStats = awardPoints();
        setStats(newStats);
        addLog(`🌟 Earned 50 XP! Total XP: ${newStats.xp} | Rank: ${newStats.rank}`);

        if (isEffectivelyOnline) {
            try {
                const response = await fetch('/api/sync-scores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify([data])
                });
                if (response.ok) {
                    addLog(`✅ Online: ${actionType} completed successfully.`);
                } else {
                    throw new Error("Server Error");
                }
            } catch (error) {
                await saveScoreOffline(data);
                addLog(`⚠️ Network issue. ${actionType} saved to offline queue.`);
            }
        } else {
            await saveScoreOffline(data);
            addLog(`💾 Offline: ${actionType} saved to offline queue.`);
        }
    };

    const handleSelectClass = (classNum) => {
        setActiveClass(classNum);
        setCurrentScreen('classview');
        addLog(`📚 Opened Class ${classNum}`);
    };

    const handleBack = () => {
        setCurrentScreen('landing');
        setActiveClass(null);
    };

    return (
        <div className="app-container">
            
            {/* Top Bar (App Level) */}
            <div className="top-bar">
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                        type="checkbox" 
                        checked={simulateOffline}
                        onChange={(e) => setSimulateOffline(e.target.checked)}
                        style={{ marginRight: '5px' }}
                    />
                    Simulate Offline
                </label>
                <span className={isEffectivelyOnline ? 'status-online' : 'status-offline'}>
                    {isEffectivelyOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
            </div>

            {/* Gamification Stats Bar */}
            <div className="stats-bar">
                <div className="stats-header">
                    <span className="stats-rank">{stats.rank}</span>
                    <div className="stats-metrics">
                        <span style={{ color: '#ff9800' }}>🔥 {stats.streak}</span>
                        <span style={{ color: '#fbc02d' }}>⭐️ {stats.xp}</span>
                    </div>
                </div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${(stats.xp % 500) / 500 * 100}%` }}></div>
                </div>
            </div>

            {/* Screens */}
            <div style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                {currentScreen === 'landing' && (
                    <LandingScreen onSelectClass={handleSelectClass} addLog={addLog} />
                )}

                {currentScreen === 'classview' && (
                    <ClassView
                        classNum={activeClass}
                        onBack={handleBack}
                        onCompleteItem={handleOfflineAction}
                        addLog={addLog}
                    />
                )}
            </div>

            {/* Floating Visual Console (Hidden mostly, expands on demand or just short overlay) */}
            <div className="console-logs">
                <div className="console-header">
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>Console Logs</span>
                    <button onClick={() => setConsoleLogs([])} style={{ background: 'none', border: 'none', color: '#f44336', cursor: 'pointer', fontSize: '12px' }}>Clear</button>
                </div>
                {consoleLogs.length === 0 ? (
                    <span style={{ color: '#5c6370' }}>No logs yet...</span>
                ) : (
                    consoleLogs.slice(-5).map((log, i) => (
                        <div key={i} style={{ marginBottom: '3px' }}>
                            <span style={{ color: '#61afef', marginRight: '5px' }}>[{log.time}]</span>
                            {log.msg}
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default App;
