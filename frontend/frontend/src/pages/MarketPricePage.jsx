import { useState, useEffect } from 'react'
import { coreApi } from '../api/client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'

const CROPS = [
  'Wheat','Rice','Maize','Soybean','Cotton','Sugarcane',
  'Potato','Onion','Tomato','Mustard','Groundnut','Turmeric','Chilli','Garlic'
]

const TREND_COLORS = {
  rising: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', icon: '📈', label: 'Rising' },
  falling: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', icon: '📉', label: 'Falling' },
  stable: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800', icon: '➡️', label: 'Stable' },
}

function PriceCard({ item }) {
  return (
    <div className="bg-white rounded-xl border border-wheat-deep p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-ink text-sm">{item.mandi}</p>
          <p className="text-xs text-ink/50 mt-0.5">{item.state}</p>
        </div>
        <span className="text-xl">{item.emoji}</span>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-terracotta">
          ₹{item.modal_price.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-ink/50 mt-0.5">modal price / {item.unit}</p>
      </div>
      <div className="flex justify-between mt-3 pt-3 border-t border-wheat/40">
        <div className="text-center">
          <p className="text-xs text-ink/50">Min</p>
          <p className="text-sm font-semibold text-ink">₹{item.min_price.toLocaleString('en-IN')}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-ink/50">Max</p>
          <p className="text-sm font-semibold text-ink">₹{item.max_price.toLocaleString('en-IN')}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-ink/50">Date</p>
          <p className="text-sm font-semibold text-ink">{item.date}</p>
        </div>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-wheat-deep rounded-lg px-3 py-2 shadow-lg text-sm">
        <p className="text-ink/60 text-xs">{label}</p>
        <p className="font-bold text-terracotta">₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    )
  }
  return null
}

export default function MarketPricePage() {
  const [selectedCrop, setSelectedCrop] = useState('Wheat')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('prices')

  useEffect(() => {
    fetchPrices(selectedCrop)
  }, [selectedCrop])

  async function fetchPrices(crop) {
    setLoading(true)
    setError('')
    try {
      const res = await coreApi.get('/market/prices', { params: { crop } })
      setData(res.data)
    } catch {
      setError('Failed to fetch market prices. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const trendStyle = data?.prediction
    ? TREND_COLORS[data.prediction.trend] || TREND_COLORS.stable
    : null

  const cropPrices = data?.prices?.filter(p => p.crop === selectedCrop) || []
  const avgModal = cropPrices.length
    ? Math.round(cropPrices.reduce((s, p) => s + p.modal_price, 0) / cropPrices.length)
    : 0
  const maxPrice = cropPrices.length ? Math.max(...cropPrices.map(p => p.max_price)) : 0
  const minPrice = cropPrices.length ? Math.min(...cropPrices.map(p => p.min_price)) : 0

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Market Price Dashboard</h1>
        <p className="text-ink/60 text-sm mt-1">Live mandi prices, 30-day trends, and selling advice for Indian crops.</p>
      </div>

      {/* Crop selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CROPS.map(crop => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              selectedCrop === crop
                ? 'bg-terracotta text-white shadow-sm'
                : 'bg-white border border-wheat-deep text-ink/70 hover:border-terracotta hover:text-terracotta'
            }`}
          >
            {crop}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-ink/50 text-sm">Loading market data…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {data && !loading && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-forest rounded-xl p-4 text-center text-wheat">
              <p className="text-3xl font-bold">₹{avgModal.toLocaleString('en-IN')}</p>
              <p className="text-xs text-wheat/60 mt-1">Avg Modal Price / quintal</p>
            </div>
            <div className="bg-white rounded-xl border border-wheat-deep p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-green-700">₹{Math.round(maxPrice).toLocaleString('en-IN')}</p>
              <p className="text-xs text-ink/50 mt-1">Highest Price</p>
            </div>
            <div className="bg-white rounded-xl border border-wheat-deep p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-red-600">₹{Math.round(minPrice).toLocaleString('en-IN')}</p>
              <p className="text-xs text-ink/50 mt-1">Lowest Price</p>
            </div>
          </div>

          {/* Selling advice banner */}
          {data.prediction && trendStyle && (
            <div className={`rounded-xl border px-5 py-4 mb-6 ${trendStyle.bg} ${trendStyle.border}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{trendStyle.icon}</span>
                <div>
                  <p className={`font-bold text-sm ${trendStyle.text}`}>
                    Price Trend: {trendStyle.label} — Best selling date: {data.prediction.best_selling_date}
                  </p>
                  <p className={`text-sm mt-1 ${trendStyle.text} opacity-80`}>{data.prediction.advice}</p>
                  <p className={`text-sm font-semibold mt-1 ${trendStyle.text}`}>
                    Expected best price: ₹{data.prediction.best_selling_price.toLocaleString('en-IN')} / quintal
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-wheat-deep/40 rounded-xl p-1 w-fit">
            {['prices', 'trend', 'forecast'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink/50 hover:text-ink'
                }`}
              >
                {tab === 'prices' ? '🏪 Mandi Prices' : tab === 'trend' ? '📊 30-Day Trend' : '🔮 7-Day Forecast'}
              </button>
            ))}
          </div>

          {/* Mandi prices grid */}
          {activeTab === 'prices' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cropPrices.map((item, i) => (
                <PriceCard key={i} item={item} />
              ))}
            </div>
          )}

          {/* 30-day trend chart */}
          {activeTab === 'trend' && data.price_trend.length > 0 && (
            <div className="bg-white rounded-xl border border-wheat-deep p-5 shadow-sm">
              <h3 className="font-display font-bold text-ink mb-4">30-Day Price Trend — {selectedCrop}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.price_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC4" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#4A4A42' }}
                    tickFormatter={d => d.slice(5)}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#4A4A42' }}
                    tickFormatter={v => `₹${(v/1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={avgModal} stroke="#7A9B7E" strokeDasharray="4 4" label={{ value: 'Avg', fill: '#7A9B7E', fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#C8623A"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#C8623A' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 7-day forecast chart */}
          {activeTab === 'forecast' && data.prediction && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-wheat-deep p-5 shadow-sm">
                <h3 className="font-display font-bold text-ink mb-4">7-Day Price Forecast — {selectedCrop}</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.prediction.next_7_days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC4" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#4A4A42' }} tickFormatter={d => d.slice(5)} />
                    <YAxis tick={{ fontSize: 11, fill: '#4A4A42' }} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="predicted_price"
                      stroke="#1F3A2E"
                      strokeWidth={2.5}
                      strokeDasharray="6 3"
                      dot={{ r: 4, fill: '#1F3A2E' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Forecast table */}
              <div className="bg-white rounded-xl border border-wheat-deep overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-wheat/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-ink">Date</th>
                      <th className="text-right px-4 py-3 font-semibold text-ink">Predicted Price</th>
                      <th className="text-right px-4 py-3 font-semibold text-ink">vs Today</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.prediction.next_7_days.map((day, i) => {
                      const change = ((day.predicted_price - avgModal) / avgModal * 100).toFixed(1)
                      const isUp = change > 0
                      const isBest = day.date === data.prediction.best_selling_date
                      return (
                        <tr key={i} className={`border-t border-wheat/30 ${isBest ? 'bg-green-50' : ''}`}>
                          <td className="px-4 py-3 text-ink">
                            {day.date}
                            {isBest && <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Best day</span>}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-ink">
                            ₹{day.predicted_price.toLocaleString('en-IN')}
                          </td>
                          <td className={`px-4 py-3 text-right font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                            {isUp ? '+' : ''}{change}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Data source note */}
          <p className="text-xs text-ink/30 mt-6 text-center">
            ℹ️ {data.note}
          </p>
        </>
      )}
    </div>
  )
}
