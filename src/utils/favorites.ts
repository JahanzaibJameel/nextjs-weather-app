import { WeatherData } from '@/types/weather';

export interface FavoriteLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: string;
  lastSearched?: string;
}

interface StorageData {
  favorites: FavoriteLocation[];
  recentSearches: Array<{
    query: string;
    timestamp: string;
  }>;
}

const STORAGE_KEY = 'weather_app_data';
const MAX_FAVORITES = 10;
const MAX_RECENT_SEARCHES = 5;

class FavoritesManager {
  private getStorageData(): StorageData {
    if (typeof window === 'undefined') {
      return { favorites: [], recentSearches: [] };
    }
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { favorites: [], recentSearches: [] };
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return { favorites: [], recentSearches: [] };
    }
  }

  private setStorageData(data: StorageData): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  // Favorites management
  addFavorite(weatherData: WeatherData): FavoriteLocation[] {
    const data = this.getStorageData();
    const newFavorite: FavoriteLocation = {
      id: `${weatherData.location.lat}_${weatherData.location.lon}`,
      name: weatherData.location.name,
      country: weatherData.location.country,
      lat: weatherData.location.lat,
      lon: weatherData.location.lon,
      addedAt: new Date().toISOString(),
    };

    // Remove if already exists
    data.favorites = data.favorites.filter(fav => fav.id !== newFavorite.id);
    
    // Add to beginning
    data.favorites.unshift(newFavorite);
    
    // Limit to max favorites
    data.favorites = data.favorites.slice(0, MAX_FAVORITES);
    
    this.setStorageData(data);
    return data.favorites;
  }

  removeFavorite(id: string): FavoriteLocation[] {
    const data = this.getStorageData();
    data.favorites = data.favorites.filter(fav => fav.id !== id);
    this.setStorageData(data);
    return data.favorites;
  }

  getFavorites(): FavoriteLocation[] {
    return this.getStorageData().favorites;
  }

  isFavorite(lat: number, lon: number): boolean {
    const id = `${lat}_${lon}`;
    return this.getFavorites().some(fav => fav.id === id);
  }

  // Recent searches management
  addRecentSearch(query: string): Array<{ query: string; timestamp: string }> {
    const data = this.getStorageData();
    const newSearch = {
      query: query.trim(),
      timestamp: new Date().toISOString(),
    };

    // Remove if already exists
    data.recentSearches = data.recentSearches.filter(search => search.query !== newSearch.query);
    
    // Add to beginning
    data.recentSearches.unshift(newSearch);
    
    // Limit to max recent searches
    data.recentSearches = data.recentSearches.slice(0, MAX_RECENT_SEARCHES);
    
    this.setStorageData(data);
    return data.recentSearches;
  }

  getRecentSearches(): Array<{ query: string; timestamp: string }> {
    return this.getStorageData().recentSearches;
  }

  clearRecentSearches(): void {
    const data = this.getStorageData();
    data.recentSearches = [];
    this.setStorageData(data);
  }

  // Utility methods
  exportData(): string {
    const data = this.getStorageData();
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): { success: boolean; message: string } {
    try {
      const importedData = JSON.parse(jsonData);
      
      // Validate structure
      if (!importedData.favorites || !Array.isArray(importedData.favorites)) {
        return { success: false, message: 'Invalid data format' };
      }
      
      const data = this.getStorageData();
      data.favorites = importedData.favorites.slice(0, MAX_FAVORITES);
      this.setStorageData(data);
      
      return { success: true, message: `Imported ${data.favorites.length} favorites` };
    } catch (error) {
      return { success: false, message: 'Failed to import data' };
    }
  }

  clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  getStorageStats(): { favoritesCount: number; recentSearchesCount: number; storageSize: string } {
    const data = this.getStorageData();
    const storageSize = new Blob([JSON.stringify(data)]).size;
    
    return {
      favoritesCount: data.favorites.length,
      recentSearchesCount: data.recentSearches.length,
      storageSize: `${(storageSize / 1024).toFixed(2)} KB`,
    };
  }
}

export const favoritesManager = new FavoritesManager();
