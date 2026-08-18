import { fullLibraryDB } from './libraryData';
import { intentDictionary } from './languageConfig';

// Map hindi digits to english digits just in case
const hindiToEnglishDigits = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

const wordToNumber = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12,
    'एक': 1, 'पहली': 1, 'दो': 2, 'दूसरी': 2, 'तीन': 3, 'तीसरी': 3,
    'चार': 4, 'चौथी': 4, 'पांच': 5, 'पांचवी': 5, 'पांचवीं': 5,
    'छह': 6, 'छठी': 6, 'सात': 7, 'सातवी': 7, 'सातवीं': 7,
    'आठ': 8, 'आठवी': 8, 'आठवीं': 8, 'नौ': 9, 'नौवी': 9, 'नौवीं': 9,
    'दस': 10, 'दसवी': 10, 'दसवीं': 10, 'ग्यारह': 11, 'ग्यारहवी': 11, 'ग्यारहवीं': 11,
    'बारह': 12, 'बारहवी': 12, 'बारहवीं': 12
};

function normalizeText(text) {
    let normalized = text.toLowerCase();
    // Replace Hindi digits with English digits
    for (const [hi, en] of Object.entries(hindiToEnglishDigits)) {
        normalized = normalized.replaceAll(hi, en);
    }
    return normalized;
}

export function parseVoiceIntent(transcript) {
    const text = normalizeText(transcript);
    
    let parsedClass = null;
    let parsedSubject = null;
    let actionIntent = null;

    // 0. Find explicit action keywords (Read / Back / Submit / Start)
    const actionKeys = ['Read', 'Back', 'Submit', 'Start'];
    for (const action of actionKeys) {
        for (const keyword of intentDictionary[action]) {
            if (text.includes(keyword.toLowerCase())) {
                actionIntent = action;
                break;
            }
        }
        if (actionIntent) break;
    }

    // 1. Try finding numeric class
    const numericMatch = text.match(/\b(1[0-2]|[1-9])\b/);
    if (numericMatch) {
        parsedClass = parseInt(numericMatch[1], 10);
    } else {
        // 2. Try finding word class
        for (const [word, num] of Object.entries(wordToNumber)) {
            if (text.includes(word)) {
                parsedClass = num;
                break;
            }
        }
    }

    // 3. Find subject using intentDictionary
    for (const [englishSubject, regionalKeywords] of Object.entries(intentDictionary)) {
        // Skip meta-keys
        if (['Class', 'Read', 'Back', 'Submit', 'Start'].includes(englishSubject)) continue;
        for (const keyword of regionalKeywords) {
            if (text.includes(keyword.toLowerCase())) {
                parsedSubject = englishSubject;
                break;
            }
        }
        if (parsedSubject) break;
    }

    // 4. Detect a "Navigate to class" intent:
    //    Triggered when the transcript explicitly contains a class keyword AND a number,
    //    and no other action keyword was detected yet.
    //    e.g. "class 3", "कक्षा तीन", "வகுப்பு 10"
    if (!actionIntent && parsedClass !== null) {
        const classKeywords = intentDictionary['Class'] || [];
        const hasClassKeyword = classKeywords.some(kw => text.includes(kw.toLowerCase()));
        if (hasClassKeyword) {
            actionIntent = 'Navigate';
        }
    }

    return { parsedClass, parsedSubject, actionIntent, text };
}

export function searchLibrary(classNum, subjectStr) {
    return fullLibraryDB.filter(item => {
        const matchClass = classNum ? item.class === classNum : true;
        const matchSubject = subjectStr ? item.subject === subjectStr : true;
        return matchClass && matchSubject;
    });
}
