import React, { useState, useEffect } from 'react';
import { useVoice } from './VoiceContext';
import { speakText } from './voiceSpeaker';
import { fullLibraryDB } from './libraryData';

const SUBJECTS = ['Math', 'Science', 'Hindi', 'English'];

function ClassView({ classNum, onBack, onCompleteItem, addLog }) {
    const [activeSubject, setActiveSubject] = useState(SUBJECTS[0]);
    const [activeTab, setActiveTab] = useState('study'); // 'study' | 'quiz'
    const [selectedItemId, setSelectedItemId] = useState(null);
    const { selectedLang, latestIntent, setLatestIntent } = useVoice();

    // All items for this class + subject
    const allItems = fullLibraryDB.filter(
        item => item.class === classNum && item.subject === activeSubject
    );

    const studyItems = allItems.filter(item => item.type === 'Study Material');
    const quizItems  = allItems.filter(item => item.type === 'Classwork' || item.type === 'Assignment');

    const visibleItems = activeTab === 'study' ? studyItems : quizItems;

    // Voice actions while inside ClassView
    useEffect(() => {
        if (!latestIntent || !latestIntent.actionIntent) return;
        const { actionIntent, text } = latestIntent;

        if (actionIntent === 'Read') {
            if (selectedItemId) {
                const target = allItems.find(r => r.id === selectedItemId);
                if (target) speakText(target.content, selectedLang);
            } else {
                speakText('Please select a card first.', selectedLang);
            }
            setLatestIntent(null);
        } else if (actionIntent === 'Start') {
            const numMatch = text.match(/\b(1|2|3|4|5|one|two|three|four|five|एक|दो|तीन|चार|पांच)\b/);
            if (numMatch) {
                const wordMap = { '1': 1, 'one': 1, 'एक': 1, '2': 2, 'two': 2, 'दो': 2,
                    '3': 3, 'three': 3, 'तीन': 3, '4': 4, 'four': 4, 'चार': 4, '5': 5, 'five': 5, 'पांच': 5 };
                const num = wordMap[numMatch[1]] || 1;
                const target = allItems.find(r => r.chapterNumber === num);
                if (target) {
                    setSelectedItemId(target.id);
                    speakText(`Opening Chapter ${num}`, selectedLang);
                }
            }
            setLatestIntent(null);
        } else if (actionIntent === 'Submit') {
            if (selectedItemId) {
                const target = allItems.find(r => r.id === selectedItemId);
                if (target) {
                    onCompleteItem(target.type, target);
                    speakText('Activity submitted successfully.', selectedLang);
                }
            } else {
                speakText('Please select a card first.', selectedLang);
            }
            setLatestIntent(null);
        }
        // 'Back' and 'Navigate' are handled by App.jsx
    }, [latestIntent, allItems, selectedItemId, onCompleteItem, selectedLang, setLatestIntent]);

    // Reset selection when subject or tab changes
    useEffect(() => { setSelectedItemId(null); }, [activeSubject, activeTab]);

    return (
        <div className="class-view">
            {/* ── Sticky Header ── */}
            <div className="class-view-header">
                <button className="back-btn" onClick={onBack}>⬅</button>
                <h2 className="class-view-title">Class {classNum}</h2>
            </div>

            {/* ── Subject Tabs ── */}
            <div className="subject-tabs">
                {SUBJECTS.map(subj => (
                    <button
                        key={subj}
                        className={`subject-tab ${activeSubject === subj ? 'active' : ''}`}
                        onClick={() => setActiveSubject(subj)}
                    >
                        {subj}
                    </button>
                ))}
            </div>

            {/* ── Section Tabs ── */}
            <div className="section-tabs">
                <button
                    className={`section-tab ${activeTab === 'study' ? 'active' : ''}`}
                    onClick={() => setActiveTab('study')}
                >
                    📖 Study Materials
                    <span className="tab-count">{studyItems.length}</span>
                </button>
                <button
                    className={`section-tab ${activeTab === 'quiz' ? 'active' : ''}`}
                    onClick={() => setActiveTab('quiz')}
                >
                    ✏️ Quizzes &amp; Activities
                    <span className="tab-count">{quizItems.length}</span>
                </button>
            </div>

            {/* ── Content ── */}
            <div className="class-view-content">
                {visibleItems.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                        No content found.
                    </p>
                ) : (
                    visibleItems.map(item => {
                        const isSelected = selectedItemId === item.id;
                        let typeClass = 'study';
                        if (item.type === 'Classwork') typeClass = 'work';
                        if (item.type === 'Assignment') typeClass = 'assign';

                        return (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItemId(item.id)}
                                className={`dashboard-card ${isSelected ? 'selected' : ''}`}
                            >
                                <div className="card-row">
                                    <span className={`card-type ${typeClass}`}>{item.type}</span>
                                    <span className="card-chapter">{item.chapterTitle}</span>
                                </div>
                                <p className="card-content">{item.content}</p>
                                <div className="card-actions">
                                    {/* TTS read button */}
                                    <button
                                        className="btn-icon"
                                        title="Read aloud"
                                        onClick={e => {
                                            e.stopPropagation();
                                            speakText(item.content, selectedLang);
                                            addLog(`🔊 Reading: ${item.chapterTitle}`);
                                        }}
                                    >
                                        🔊
                                    </button>
                                    {/* Primary action */}
                                    <button
                                        className="btn-outline-neon"
                                        style={{ flex: 1, padding: '10px' }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            onCompleteItem(item.type, item);
                                            if (item.type !== 'Study Material')
                                                speakText('Activity submitted.', selectedLang);
                                            addLog(`✅ Completed: ${item.chapterTitle}`);
                                        }}
                                    >
                                        {item.type === 'Study Material' ? 'Mark as Read' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ClassView;
