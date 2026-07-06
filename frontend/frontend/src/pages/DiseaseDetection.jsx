import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { diseaseApi } from '../api/client'

const HISTORY_KEY = 'diagnosis_history'

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(entries) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 20)))
}

export default function DiseaseDetection() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setResult(null)
    setError('')
    setPreview(URL.createObjectURL(f))
  }

  const handlePredict = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const res = await diseaseApi.predict(file)
      setResult(res.data)

      const entry = {
        id: Date.now(),
        disease_name: res.data.disease_name,
        confidence: res.data.confidence,
        model_status: res.data.model_status,
        preview,
        timestamp: new Date().toISOString(),
      }
      const updated = [entry, ...history]
      setHistory(updated)
      saveHistory(updated)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Could not analyze the image. Is ai-service running?')
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const confidencePct = result ? Math.round(result.confidence * 100) : 0

  return (
    <Layout>
      <h1 className="font-display text-2xl text-forest mb-1">Crop disease detection</h1>
      <p className="text-ink/60 text-sm mb-6">Upload a leaf photo to get an instant diagnosis.</p>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/60 border border-forest/10 rounded-2xl p-6">
          <label className="block">
            <div className="border-2 border-dashed border-forest/25 rounded-xl h-64 flex items-center justify-center cursor-pointer hover:border-terracotta transition overflow-hidden bg-white/50 relative">
              {preview ? (
                <img src={preview} alt="Leaf preview" className="h-full w-full object-cover" />
              ) : (
                <p className="text-ink/50 text-sm px-6 text-center">
                  Click to choose a leaf photo (JPEG or PNG)
                </p>
              )}

              {loading && (
                <div className="absolute inset-0 bg-forest/70 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-wheat/30 border-t-terracotta rounded-full animate-spin" />
                  <p className="text-wheat text-sm font-medium">Analyzing leaf...</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" disabled={loading} />
          </label>

          <button
            onClick={handlePredict}
            disabled={!file || loading}
            className="w-full mt-4 bg-terracotta text-wheat py-2.5 rounded-lg font-medium hover:bg-terracotta/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-wheat/40 border-t-wheat rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              'Diagnose leaf'
            )}
          </button>

          {error && <p className="text-terracotta text-sm bg-terracotta/10 px-3 py-2 rounded-lg mt-3">{error}</p>}
        </div>

        <div>
          {!result ? (
            <div className="h-full bg-white/30 border border-forest/10 rounded-2xl p-6 flex items-center justify-center">
              <p className="text-ink/40 text-sm text-center">Diagnosis will appear here after analysis.</p>
            </div>
          ) : (
            <div className="bg-white border border-forest/15 rounded-2xl overflow-hidden">
              <div className="bg-forest px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-wheat/60 text-xs uppercase tracking-wide">Field report</p>
                  <p className="font-display text-xl text-wheat">{result.disease_name}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${
                  result.model_status === 'trained_model' ? 'bg-sage/30 text-wheat' : 'bg-terracotta/40 text-wheat'
                }`}>
                  {result.model_status === 'trained_model' ? 'AI model' : 'placeholder'}
                </span>
              </div>

              <div className="px-6 py-5 space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-ink/60">Confidence</span>
                    <span className="font-medium text-forest">{confidencePct}%</span>
                  </div>
                  <div className="h-2 bg-forest/10 rounded-full overflow-hidden">
                    <div className="h-full bg-terracotta rounded-full transition-all" style={{ width: `${confidencePct}%` }} />
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">Symptoms</p>
                  <p className="text-sm text-ink/80">{result.symptoms}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">Treatment</p>
                  <p className="text-sm text-ink/80">{result.treatment}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">Prevention</p>
                  <p className="text-sm text-ink/80">{result.prevention}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg text-forest">Past diagnoses</h2>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-xs text-ink/50 hover:text-terracotta transition">
              Clear history
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-ink/40 text-sm">No diagnoses yet. Your past results will appear here.</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {history.map((entry) => (
              <div key={entry.id} className="bg-white/60 border border-forest/10 rounded-xl overflow-hidden">
                {entry.preview && (
                  <img src={entry.preview} alt={entry.disease_name} className="w-full h-28 object-cover" />
                )}
                <div className="p-3">
                  <p className="text-sm font-medium text-forest truncate">{entry.disease_name}</p>
                  <p className="text-xs text-ink/50 mt-1">
                    {Math.round(entry.confidence * 100)}% Â· {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
