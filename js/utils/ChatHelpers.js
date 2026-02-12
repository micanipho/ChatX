export class ChatHelpers {
    static getUserDisplayName(user) {
        if (!user) return 'Unknown User';
        
        const firstName = user.firstName || user.fName || '';
        const lastName = user.lastName || user.lName || '';
        
        const fullName = `${firstName} ${lastName}`.trim();
        
        if (fullName) return fullName;
        
        return user.name || user.username || 'Unknown';
    }

    static formatLastSeen(isOnline, lastSeen) {
        if (isOnline) return 'Online';
        if (!lastSeen) return 'Offline';

        const now = new Date();
        const seen = new Date(lastSeen);
        const diffInSeconds = Math.floor((now - seen) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        return seen.toLocaleDateString();
    }

    static formatTimestamp(timestamp) {
        if (!timestamp) return '';
        
        const now = new Date();
        const date = new Date(timestamp);
        
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24 && now.getDate() === date.getDate()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    static getInitials(name) {
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }
}
