/**
 * MediHelp Progressive Web App (PWA) & Service Worker Manager
 * Provides offline caching, network status monitoring, install prompts, and local push triggers.
 */

export interface PwaStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  isInstallable: boolean;
  installPromptEvent: any | null;
}

type NetworkChangeCallback = (isOnline: boolean) => void;

class PwaService {
  private deferredPrompt: any = null;
  private networkListeners: Set<NetworkChangeCallback> = new Set();
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isRegistered: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
      window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault();
        this.deferredPrompt = e;
        console.log('[PwaService] Capture beforeinstallprompt event for PWA installation');
      });
    }
  }

  /**
   * Registers the MediHelp Service Worker (/sw.js)
   */
  public async registerServiceWorker(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('[PwaService] Service Workers not supported in this environment');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      this.isRegistered = true;
      console.log('[PwaService] Service Worker registered successfully with scope:', registration.scope);

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'EXECUTE_OFFLINE_SYNC') {
          console.log('[PwaService] Received EXECUTE_OFFLINE_SYNC message from SW');
          window.dispatchEvent(new CustomEvent('medihelp-offline-sync'));
        }
      });

      return true;
    } catch (error) {
      console.error('[PwaService] Service Worker registration failed:', error);
      return false;
    }
  }

  /**
   * Prompts user to install PWA to home screen
   */
  public async promptInstallPwa(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('[PwaService] No deferred install prompt available');
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      console.log('[PwaService] User installation response:', choiceResult.outcome);
      this.deferredPrompt = null;
      return choiceResult.outcome === 'accepted';
    } catch (err) {
      console.error('[PwaService] Failed to trigger install prompt:', err);
      return false;
    }
  }

  /**
   * Returns whether the PWA is currently installable
   */
  public isInstallable(): boolean {
    return !!this.deferredPrompt;
  }

  /**
   * Check if device is online
   */
  public getIsOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Subscribe to network online/offline state changes
   */
  public onNetworkChange(callback: NetworkChangeCallback): () => void {
    this.networkListeners.add(callback);
    return () => {
      this.networkListeners.delete(callback);
    };
  }

  /**
   * Request Notification permission and register local notification trigger
   */
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    const permission = await Notification.requestPermission();
    console.log('[PwaService] Notification permission status:', permission);
    return permission;
  }

  /**
   * Send a local notification (or trigger via active SW)
   */
  public async sendLocalNotification(title: string, options?: NotificationOptions): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission !== 'granted') {
      const perm = await this.requestNotificationPermission();
      if (perm !== 'granted') return false;
    }

    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, {
          icon: '/assets/icon-192.png',
          badge: '/assets/icon-192.png',
          vibrate: [200, 100, 200],
          ...options
        } as any);
        return true;
      } else {
        new Notification(title, {
          icon: '/assets/icon-192.png',
          ...options
        });
        return true;
      }
    } catch (err) {
      console.error('[PwaService] Error sending notification:', err);
      return false;
    }
  }

  private handleOnline(): void {
    this.isOnline = true;
    console.log('[PwaService] Network status: ONLINE');
    this.notifyNetworkListeners(true);
  }

  private handleOffline(): void {
    this.isOnline = false;
    console.log('[PwaService] Network status: OFFLINE');
    this.notifyNetworkListeners(false);
  }

  private notifyNetworkListeners(isOnline: boolean): void {
    this.networkListeners.forEach((listener) => {
      try {
        listener(isOnline);
      } catch (err) {
        console.error('[PwaService] Error in network listener callback:', err);
      }
    });
  }
}

export const pwaService = new PwaService();
