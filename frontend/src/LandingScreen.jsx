import React, { useEffect } from 'react';
import { supportedLanguages } from './languageConfig';
import { useVoice } from './VoiceContext';

const CLASS_GROUPS = [
    { label: 'Primary', classes: [1, 2, 3, 4, 5] },
    { label: 'Middle School', classes: [6, 7, 8] },
    { label: 'Secondary', classes: [9, 10, 11, 12] },
];

function LandingScreen({ onSelectClass, addLog }) {
    const { selectedLang, setSelectedLang, latestIntent, setLatestIntent } = useVoice();

    // Voice intent: navigate to a specific class
    useEffect(() => {
        if (latestIntent && latestIntent.actionIntent === 'Navigate' && latestIntent.parsedClass) {
            const c = latestIntent.parsedClass;
            addLog(`🗣️ Voice: Opening Class ${c}`);
            onSelectClass(c);
            setLatestIntent(null);
        }
    }, [latestIntent, onSelectClass, addLog, setLatestIntent]);

    return (
        <div className="landing-screen">
            {/* Language Selector */}
            <div className="lang-selector-wrapper">
                <select
                    value={selectedLang}
                    onChange={e => setSelectedLang(e.target.value)}
                    className="neon-select"
                >
                    {supportedLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                </select>
            </div>

            <h1 className="landing-title">Sahayak</h1>
            <p className="landing-subtitle">Select your class to begin</p>

            {CLASS_GROUPS.map(group => (
                <div key={group.label} className="class-group">
                    <span className="class-group-label">{group.label}</span>
                    <div className="class-grid">
                        {group.classes.map(c => (
                            <button
                                key={c}
                                className="class-btn"
                                onClick={() => {
                                    addLog(`📚 Opening Class ${c}`);
                                    onSelectClass(c);
                                }}
                            >
                                <span className="class-btn-num">{c}</span>
                                <span className="class-btn-label">Class</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <p className="voice-hint">🎤 Say "Class 5" or "कक्षा ३" to navigate by voice</p>
        </div>
    );
}

export default LandingScreen;
