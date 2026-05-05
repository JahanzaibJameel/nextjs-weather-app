export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    pressure_mb: number;
    wind_kph: number;
    vis_km: number;
    uv: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
        };
        wind_kph: number;
        humidity: number;
        chance_of_rain: number;
      }>;
    }>;
  };
}

export interface WeatherError {
  error: string;
  message: string;
  details?: any;
}

export interface SearchParams {
  q?: string;
  lat?: string;
  lon?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
