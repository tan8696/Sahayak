import React, { useState, useEffect } from 'react';
import { useVoice } from './VoiceContext';
import { speakText } from './voiceSpeaker';

function ResultsDashboard({ results, searchParams, onBack, onCompleteItem }) {
    const { classNum, subjectStr } = searchParams;
    const { selectedLang, latestIntent, setLatestIntent } = useVoice();
    
    // We need a selected item to know what to read or submit
    const [selectedItemId, setSelectedItemId] = useState(null);

    const subjectsToDisplay = subjectStr 
        ? [subjectStr]
        : [...new Set(results.map(r => r.subject))];

    // Global Voice Actions on Results Dashboard
    useEffect(() => {
        if (!latestIntent || !latestIntent.actionIntent) return;

        const { actionIntent, text } = latestIntent;

        if (actionIntent === 'Start') {
            // Fuzzy match the chapter number spoken in the transcript
            // e.g. "Start Chapter 1" or "Start first"
            const numMatch = text.match(/\b(1|2|3|4|5|one|two|three|four|five|एक|दो|तीन|चार|पांच)\b/);
            if (numMatch) {
                let parsedNum = 1;
                const matchVal = numMatch[1];
                if (['1','one','एक'].includes(matchVal)) parsedNum = 1;
                else if (['2','two','दो'].includes(matchVal)) parsedNum = 2;
                else if (['3','three','तीन'].includes(matchVal)) parsedNum = 3;
                else if (['4','four','चार'].includes(matchVal)) parsedNum = 4;
                else if (['5','five','पांच'].includes(matchVal)) parsedNum = 5;

                // Find the first item in results that matches this chapter number
                const target = results.find(r => r.chapterNumber === parsedNum);
                if (target) {
                    setSelectedItemId(target.id);
                    speakText(`Opening Chapter ${parsedNum}`, selectedLang);
                }
            }
            setLatestIntent(null);
        }
        else if (actionIntent === 'Read') {
            if (selectedItemId) {
                const target = results.find(r => r.id === selectedItemId);
                if (target) {
                    speakText(target.content, selectedLang);
                }
            } else {
                speakText("Please start a lesson first.", selectedLang);
            }
            setLatestIntent(null);
        }
        else if (actionIntent === 'Submit') {
            if (selectedItemId) {
                const target = results.find(r => r.id === selectedItemId);
                if (target) {
                    onCompleteItem(target.type, target);
                    speakText("Quiz saved successfully", selectedLang);
                }
            } else {
                speakText("Please start a lesson first.", selectedLang);
            }
            setLatestIntent(null);
        }
        // Note: 'Back' is handled by App.jsx
        
    }, [latestIntent, results, selectedItemId, onCompleteItem, setLatestIntent, selectedLang]);


    return (
        <div className="results-screen">
            {/* Header */}
            <div className="top-bar" style={{ position: 'sticky', top: 0, zIndex: 10, margin: '-20px -20px 20px -20px' }}>
                <button 
                    onClick={onBack}
                    className="btn-outline-neon"
                    style={{ width: 'auto', padding: '8px 15px' }}
                >
                    ⬅ Back
                </button>
                <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>
                    Class {classNum} {subjectStr ? `- ${subjectStr}` : ''}
                </h2>
            </div>

            {/* List View */}
            <div style={{ paddingBottom: '100px' }}>
                {results.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>No content found.</p>
                ) : (
                    subjectsToDisplay.map(subj => {
                        const subjResults = results.filter(r => r.subject === subj);
                        return (
                            <div key={subj} style={{ marginBottom: '30px' }}>
                                <h3 className="subject-header">
                                    {subj}
                                </h3>
                                
                                {subjResults.map(item => {
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
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span className={`card-type ${typeClass}`}>
                                                    {item.type}
                                                </span>
                                                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{item.chapterTitle}</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '15px' }}>
                                                {item.content}
                                            </p>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onCompleteItem(item.type, item);
                                                    if(item.type !== 'Study Material') speakText("Quiz saved successfully", selectedLang);
                                                }}
                                                className="btn-outline-neon"
                                                style={{ marginTop: '10px' }}
                                            >
                                                {item.type === 'Study Material' ? 'Mark as Read' : 'Complete Activity'}
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ResultsDashboard;
