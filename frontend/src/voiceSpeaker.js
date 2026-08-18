export function speakText(text, langCode = 'hi-IN') {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any currently playing speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        
        // Optional: you can tune pitch and rate here if needed
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
    } else {
        console.warn("Text-to-Speech not supported in this browser.");
    }
}
