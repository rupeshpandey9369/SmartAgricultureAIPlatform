import { useState, useEffect } from 'react'
import { farmsApi, coreApi } from '../api/client'

const SOIL_TYPES = ['alluvial', 'sandy', 'clay', 'loamy', 'black', 'red', 'laterite']
const CROPS = ['wheat', 'rice', 'maize', 'corn', 'potato', 'tomato', 'pepper', 'cotton', 'sugarcane', 'soybean', 'groundnut']

export default function FertilizerPage() {
  const [farms, setFarms] = useState([])
  const [selectedFarm, setSelectedFarm] = useState('')
  const [crop, setCrop] = useState('')
  const [soilType, setSoilType] = useState('')
  const [area, setArea] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    farmsApi.list().then(res => setFarms(res.data)).catch(() => {})
  }, [])

  function handleFarmSelect(e) {
    const farmId = e.target.value
    setSelectedFarm(farmId)
    if (farmId) {
      const farm = farms.find(f => f.id === farmId)
      if (farm) {
        setCrop(farm.primary_crop || farm.current_crop || '')
        setSoilType(farm.soil_type || '')
        setArea(farm.area_acres?.toString() || '')
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await coreApi.post('/fertilizer/recommend', {
        crop,
        soil_type: soilType,
        area_acres: parseFloat(area),
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Fertilizer Recommendation</h1>
      <p className="text-ink/60 text-sm mb-8">Get an NPK fertilizer plan based on your crop, soil, and farm size.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-wheat-deep space-y-5">

        {/* Farm picker */}
        {farms.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">
              Autofill from a saved farm <span className="font-normal text-ink/50">(optional)</span>
            </label>
            <select
              value={selectedFarm}
              onChange={handleFarmSelect}
              className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
            >
              <option value="">— Select a farm —</option>
              {farms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="border-t border-wheat/40 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Crop */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Crop <span className="text-terracotta">*</span></label>
            <input
              list="crop-list"
              value={crop}
              onChange={e => setCrop(e.target.value)}
              placeholder="e.g. wheat, rice, tomato"
              required
              className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
            <datalist id="crop-list">
              {CROPS.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Soil Type <span className="text-terracotta">*</span></label>
            <select
              value={soilType}
              onChange={e => setSoilType(e.target.value)}
              required
              className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
            >
              <option value="">— Select soil type —</option>
              {SOIL_TYPES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Farm Area (acres) <span className="text-terracotta">*</span></label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={area}
              onChange={e => setArea(e.target.value)}
              placeholder="e.g. 5.5"
              required
              className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-60"
        >
          {loading ? 'Calculating…' : 'Get Fertilizer Plan'}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-4">
          <h2 className="font-display text-lg font-bold text-ink">
            Fertilizer Plan — {result.crop} on {result.area_acres} acres ({result.soil_type} soil)
          </h2>

          {/* NPK summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Nitrogen (N)', value: result.nutrient_requirement_kg.nitrogen_N, color: 'bg-green-50 border-green-200 text-green-800' },
              { label: 'Phosphorus (P)', value: result.nutrient_requirement_kg.phosphorus_P, color: 'bg-blue-50 border-blue-200 text-blue-800' },
              { label: 'Potassium (K)', value: result.nutrient_requirement_kg.potassium_K, color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
            ].map(n => (
              <div key={n.label} className={`rounded-xl border p-4 text-center ${n.color}`}>
                <p className="text-2xl font-bold">{n.value}</p>
                <p className="text-xs font-semibold mt-1">{n.label}</p>
                <p className="text-xs opacity-70">kg required</p>
              </div>
            ))}
          </div>

          {/* Fertilizer plan cards */}
          <div className="space-y-3">
            {result.fertilizer_plan.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-wheat-deep p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{item.fertilizer}</p>
                    <p className="text-xs text-ink/50 mt-0.5">Supplies: {item.supplies}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-terracotta">{item.quantity_kg} kg</p>
                    <p className="text-xs text-ink/50">total quantity</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink/70 bg-wheat/50 rounded-lg px-3 py-2">{item.application}</p>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="bg-sage/10 border border-sage/30 rounded-xl px-4 py-3 text-sm text-ink/70">
            ℹ️ {result.notes}
          </div>
        </div>
      )}
    </div>
  )
}
