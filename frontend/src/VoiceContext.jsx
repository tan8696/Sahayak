import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { parseVoiceIntent } from './voiceSearch';

const VoiceContext = createContext();

export function VoiceProvider({ children }) {
    const [selectedLang, setSelectedLang] = useState('hi-IN');
    const [isListening, setIsListening] = useState(false);
    const [latestIntent, setLatestIntent] = useState(null); // { parsedClass, parsedSubject, actionIntent, text }
    
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                setIsListening(false);
                const intent = parseVoiceIntent(transcript);
                setLatestIntent(intent);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
            
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Update language dynamically
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = selectedLang;
        }
    }, [selectedLang]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition not supported in this browser.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    return (
        <VoiceContext.Provider value={{ 
            selectedLang, 
            setSelectedLang, 
            isListening, 
            toggleListening, 
            latestIntent, 
            setLatestIntent 
        }}>
            {children}
            
            {/* Global Massive Teacher MIC FAB */}
            <button
                onClick={toggleListening}
                className={`voice-fab ${isListening ? 'listening' : ''}`}
            >
                🎤
            </button>
            
            {isListening && (
                <div className="listening-text">
                    Listening...
                </div>
            )}
        </VoiceContext.Provider>
    );
}

export function useVoice() {
    return useContext(VoiceContext);
}
