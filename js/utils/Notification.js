export class Notification {
    static container = null;

    static init() {
        // Create notification container if it doesn't exist
        if (!Notification.container) {
            Notification.container = document.getElementById('notification-container');
            
            if (!Notification.container) {
                Notification.container = document.createElement('div');
                Notification.container.id = 'notification-container';
                Notification.container.className = 'notification-container';
                document.body.appendChild(Notification.container);
            }
        }
    }

    static show(message, type = 'info', duration = 4000) {
        Notification.init();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Create icon based on type
        const icon = Notification.getIcon(type);
        
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;

        Notification.container.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => Notification.remove(notification));

        if (duration > 0) {
            setTimeout(() => Notification.remove(notification), duration);
        }
    }

    static remove(notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    static getIcon(type) {
        const icons = {
            success: '<i class="ri-checkbox-circle-line"></i>',
            error: '<i class="ri-error-warning-line"></i>',
            warning: '<i class="ri-alert-line"></i>',
            info: '<i class="ri-information-line"></i>'
        };
        return icons[type] || icons.info;
    }

    static success(message, duration = 4000) {
        Notification.show(message, 'success', duration);
    }

    static error(message, duration = 5000) {
        Notification.show(message, 'error', duration);
    }

    static warning(message, duration = 4000) {
        Notification.show(message, 'warning', duration);
    }

    static info(message, duration = 4000) {
        Notification.show(message, 'info', duration);
    }
}
