import { useState, useEffect } from 'react'
import { coreApi } from '../api/client'

const ALERT_STYLES = {
  high: 'bg-red-50 border-red-300 text-red-800',
  medium: 'bg-orange-50 border-orange-300 text-orange-800',
  low: 'bg-blue-50 border-blue-300 text-blue-800',
}

const ALERT_ICONS = {
  heatwave: '🌡️',
  frost: '❄️',
  rain: '🌧️',
  rain_forecast: '🌦️',
  disease_risk: '🍄',
  wind: '💨',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function WeatherPage() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lat, setLat] = useState(26.8467)
  const [lon, setLon] = useState(80.9462)

  useEffect(() => {
    fetchWeather(lat, lon)
  }, [])

  async function fetchWeather(latitude, longitude) {
    setLoading(true)
    setError('')
    try {
      const res = await coreApi.get('/weather/current', {
        params: { lat: latitude, lon: longitude }
      })
      setWeather(res.data)
    } catch (err) {
      setError('Could not fetch weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude)
        setLon(pos.coords.longitude)
        fetchWeather(pos.coords.latitude, pos.coords.longitude)
      },
      () => setError('Could not get your location. Please allow location access.')
    )
  }

  function getDayName(dateStr) {
    const d = new Date(dateStr)
    return DAYS[d.getDay()]
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Weather Intelligence</h1>
          <p className="text-ink/60 text-sm mt-1">Real-time weather + farming alerts for your location.</p>
        </div>
        <button
          onClick={useMyLocation}
          className="text-sm bg-forest text-wheat px-4 py-2 rounded-lg hover:bg-forest/90 transition"
        >
          📍 Use My Location
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-ink/50 text-sm">Fetching weather data…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {weather && !loading && (
        <div className="space-y-4">

          {/* Current weather card */}
          <div className="bg-forest rounded-2xl p-6 text-wheat">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-wheat/60 text-sm font-medium">
                  {weather.location.city}, {weather.location.country}
                </p>
                <p className="font-display text-6xl font-bold mt-1">{weather.current.temp}°C</p>
                <p className="text-wheat/80 text-lg mt-1">{weather.current.description}</p>
                <p className="text-wheat/50 text-sm mt-1">Feels like {weather.current.feels_like}°C</p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
                alt={weather.current.description}
                className="w-20 h-20"
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mt-6 pt-5 border-t border-wheat/10">
              {[
                { label: 'Humidity', value: `${weather.current.humidity}%` },
                { label: 'Wind', value: `${weather.current.wind_speed} m/s` },
                { label: 'Pressure', value: `${weather.current.pressure} hPa` },
                { label: 'Clouds', value: `${weather.current.clouds}%` },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-wheat font-semibold text-sm">{s.value}</p>
                  <p className="text-wheat/50 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Farming alerts */}
          {weather.farming_alerts.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-display font-bold text-ink text-base">🚨 Farming Alerts</h2>
              {weather.farming_alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`rounded-xl border px-4 py-3 ${ALERT_STYLES[alert.severity] || ALERT_STYLES.low}`}
                >
                  <p className="font-semibold text-sm">
                    {ALERT_ICONS[alert.type] || '⚠️'} {alert.title}
                  </p>
                  <p className="text-sm mt-1 opacity-80">{alert.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* 5-day forecast */}
          <div>
            <h2 className="font-display font-bold text-ink text-base mb-3">5-Day Forecast</h2>
            <div className="grid grid-cols-5 gap-2">
              {weather.forecast.map((day, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-wheat-deep p-3 text-center shadow-sm"
                >
                  <p className="font-semibold text-ink text-sm">{getDayName(day.date)}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                    alt={day.description}
                    className="w-10 h-10 mx-auto"
                  />
                  <p className="text-xs text-ink/60 leading-tight">{day.description}</p>
                  <p className="text-terracotta font-bold text-sm mt-1">{Math.round(day.temp_max)}°</p>
                  <p className="text-ink/40 text-xs">{Math.round(day.temp_min)}°</p>
                  <p className="text-blue-500 text-xs mt-1">💧 {Math.round(day.rain_chance)}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => fetchWeather(lat, lon)}
            className="w-full border border-wheat-deep text-ink/60 text-sm py-2.5 rounded-xl hover:bg-white transition"
          >
            🔄 Refresh Weather
          </button>

        </div>
      )}
    </div>
  )
}
