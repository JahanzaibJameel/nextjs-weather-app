interface FeatureFlags {
  weatherForecast: boolean;
  favoritesSystem: boolean;
  pwaMode: boolean;
  advancedAnalytics: boolean;
  betaFeatures: boolean;
  maintenanceMode: boolean;
}

class FeatureFlagManager {
  private flags: FeatureFlags;
  private readonly STORAGE_KEY = 'weather_app_flags';

  constructor() {
    this.flags = this.loadFlags();
  }

  private loadFlags(): FeatureFlags {
    if (typeof window === 'undefined') {
      // Server-side defaults
      return {
        weatherForecast: process.env.ENABLE_FORECAST === 'true',
        favoritesSystem: process.env.ENABLE_FAVORITES === 'true',
        pwaMode: process.env.ENABLE_PWA === 'true',
        advancedAnalytics: process.env.ENABLE_ANALYTICS === 'true',
        betaFeatures: process.env.ENABLE_BETA === 'true',
        maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
      };
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...this.getDefaultFlags(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading feature flags:', error);
    }

    return this.getDefaultFlags();
  }

  private getDefaultFlags(): FeatureFlags {
    return {
      weatherForecast: true, // Enabled by default
      favoritesSystem: true, // Enabled by default
      pwaMode: true, // Enabled by default
      advancedAnalytics: false, // Disabled by default
      betaFeatures: false, // Disabled by default
      maintenanceMode: false, // Disabled by default
    };
  }

  private saveFlags(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.flags));
      } catch (error) {
        console.error('Error saving feature flags:', error);
      }
    }
  }

  // Public API methods
  isEnabled(feature: keyof FeatureFlags): boolean {
    return this.flags[feature];
  }

  enableFeature(feature: keyof FeatureFlags): void {
    this.flags[feature] = true;
    this.saveFlags();
  }

  disableFeature(feature: keyof FeatureFlags): void {
    this.flags[feature] = false;
    this.saveFlags();
  }

  toggleFeature(feature: keyof FeatureFlags): void {
    this.flags[feature] = !this.flags[feature];
    this.saveFlags();
  }

  getFlags(): FeatureFlags {
    return { ...this.flags };
  }

  // Feature-specific convenience methods
  isForecastEnabled(): boolean {
    return this.isEnabled('weatherForecast');
  }

  areFavoritesEnabled(): boolean {
    return this.isEnabled('favoritesSystem');
  }

  isPWAEnabled(): boolean {
    return this.isEnabled('pwaMode');
  }

  isAnalyticsEnabled(): boolean {
    return this.isEnabled('advancedAnalytics');
  }

  areBetaFeaturesEnabled(): boolean {
    return this.isEnabled('betaFeatures');
  }

  isMaintenanceMode(): boolean {
    return this.isEnabled('maintenanceMode');
  }

  // Admin methods for remote flag management
  updateFlagsFromServer(serverFlags: Partial<FeatureFlags>): void {
    this.flags = { ...this.flags, ...serverFlags };
    this.saveFlags();
  }

  resetToDefaults(): void {
    this.flags = this.getDefaultFlags();
    this.saveFlags();
  }

  // Analytics and monitoring
  trackFeatureUsage(feature: keyof FeatureFlags, action: string): void {
    if (this.isAnalyticsEnabled()) {
      console.log(`Feature Flag Event: ${feature} - ${action}`);
      // Send to analytics service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'feature_usage', {
          feature_name: feature,
          action: action,
        });
      }
    }
  }
}

export const featureFlags = new FeatureFlagManager();

// Type declaration for global analytics
declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
  }
}
