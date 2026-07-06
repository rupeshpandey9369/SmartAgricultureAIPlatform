import { useState } from 'react'
import { coreApi } from '../api/client'

const SUPPORTED_CROPS = [
  'Cassava', 'Maize', 'Plantains and others', 'Potatoes',
  'Rice, paddy', 'Sorghum', 'Soybeans', 'Sweet potatoes', 'Wheat', 'Yams'
]

const INTERPRETATION_STYLES = {
  'Excellent': 'bg-green-50 border-green-300 text-green-800',
  'Good': 'bg-blue-50 border-blue-300 text-blue-800',
  'Moderate': 'bg-yellow-50 border-yellow-300 text-yellow-800',
  'Below': 'bg-red-50 border-red-300 text-red-800',
}

function getInterpStyle(text) {
  const key = Object.keys(INTERPRETATION_STYLES).find(k => text.startsWith(k))
  return INTERPRETATION_STYLES[key] || INTERPRETATION_STYLES['Moderate']
}

export default function YieldPredictionPage() {
  const [form, setForm] = useState({
    crop: 'Wheat',
    area: 'India',
    year: new Date().getFullYear(),
    rainfall_mm: 1200,
    pesticides_tonnes: 100,
    avg_temp: 25,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await coreApi.post('/yield/predict', {
        crop: form.crop,
        area: form.area,
        year: parseInt(form.year),
        rainfall_mm: parseFloat(form.rainfall_mm),
        pesticides_tonnes: parseFloat(form.pesticides_tonnes),
        avg_temp: parseFloat(form.avg_temp),
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Crop Yield Prediction</h1>
      <p className="text-ink/60 text-sm mb-8">
        Predict expected crop yield using a Random Forest ML model (R² = 0.985).
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-wheat-deep space-y-5">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Crop */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">
              Crop <span className="text-terracotta">*</span>
            </label>
            <select
              name="crop"
              value={form.crop}
              onChange={handleChange}
              required
              className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
            >
              {SUPPORTED_CROPS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">
              Region / Country <span className="text-terracotta">*</span>
            </label>
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="e.g. India"
              required
              className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              min="2000"
              max="2100"
              required
              className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
          </div>

          {/* Rainfall */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">
              Annual Rainfall (mm)
            </label>
            <input
              type="number"
              name="rainfall_mm"
              value={form.rainfall_mm}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
              className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
          </div>

          {/* Pesticides */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">
              Pesticides Used (tonnes)
            </label>
            <input
              type="number"
              name="pesticides_tonnes"
              value={form.pesticides_tonnes}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
              className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">
              Average Temperature (°C)
            </label>
            <input
              type="number"
              name="avg_temp"
              value={form.avg_temp}
              onChange={handleChange}
              step="0.1"
              required
              className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-60"
        >
          {loading ? 'Predicting…' : 'Predict Yield'}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-4">
          <h2 className="font-display text-lg font-bold text-ink">
            Yield Prediction — {result.crop} in {result.region}
          </h2>

          {/* Main prediction cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Yield (hg/ha)', value: result.prediction.yield_hg_per_ha.toLocaleString(), color: 'bg-forest text-wheat' },
              { label: 'Yield (kg/ha)', value: result.prediction.yield_kg_per_ha.toLocaleString(), color: 'bg-terracotta text-white' },
              { label: 'Tonnes/acre', value: result.prediction.yield_tonnes_per_acre, color: 'bg-sage text-white' },
            ].map(card => (
              <div key={card.label} className={`rounded-xl p-4 text-center ${card.color}`}>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs opacity-80 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Confidence interval */}
          <div className="bg-white rounded-xl border border-wheat-deep p-4 shadow-sm">
            <p className="font-semibold text-ink text-sm mb-2">📊 Confidence Interval (68%)</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-ink/60">Low: <strong>{result.confidence_interval.lower_kg_per_ha} kg/ha</strong></span>
              <div className="flex-1 h-2 bg-wheat-deep rounded-full overflow-hidden">
                <div className="h-full bg-terracotta rounded-full" style={{ width: '68%' }}></div>
              </div>
              <span className="text-sm text-ink/60">High: <strong>{result.confidence_interval.upper_kg_per_ha} kg/ha</strong></span>
            </div>
            <p className="text-xs text-ink/40 mt-2">{result.confidence_interval.note}</p>
          </div>

          {/* Interpretation */}
          <div className={`rounded-xl border px-4 py-3 ${getInterpStyle(result.interpretation)}`}>
            <p className="font-semibold text-sm">💡 Interpretation</p>
            <p className="text-sm mt-1">{result.interpretation}</p>
          </div>

          {/* Inputs summary */}
          <div className="bg-white rounded-xl border border-wheat-deep p-4 shadow-sm">
            <p className="font-semibold text-ink text-sm mb-3">📋 Input Summary</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Rainfall', value: `${result.inputs.rainfall_mm_per_year} mm` },
                { label: 'Pesticides', value: `${result.inputs.pesticides_tonnes} t` },
                { label: 'Avg Temp', value: `${result.inputs.avg_temp_celsius}°C` },
              ].map(item => (
                <div key={item.label} className="bg-wheat/50 rounded-lg p-2">
                  <p className="font-semibold text-ink text-sm">{item.value}</p>
                  <p className="text-xs text-ink/50 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
