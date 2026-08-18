const STORAGE_KEY = 'sahayak_gamification';

export function getStats() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        return JSON.parse(raw);
    }
    return {
        xp: 0,
        streak: 0,
        lastActiveDate: null,
        rank: 'Level 1'
    };
}

export function awardPoints() {
    const stats = getStats();
    
    // Add 50 XP
    stats.xp += 50;

    // Streak Calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    
    if (stats.lastActiveDate) {
        const lastActive = new Date(stats.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today - lastActive);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
            stats.streak += 1;
        } else if (diffDays > 1) {
            stats.streak = 1;
        }
    } else {
        // First time
        stats.streak = 1;
    }
    
    stats.lastActiveDate = today.toISOString();

    // Rank Calculation
    stats.rank = `Level ${Math.floor(stats.xp / 500) + 1}`;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    return stats;
}
