import { useState, useRef, useEffect } from 'react'
import { coreApi } from '../api/client'

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-1 my-1">$1</ul>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}

function Message({ role, text }) {
  const isBot = role === 'bot'
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
        isBot ? 'bg-forest text-wheat' : 'bg-terracotta text-white'
      }`}>
        {isBot ? '🧑‍💻' : '👨🏻‍🌾'}
      </div>
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isBot
          ? 'bg-white border border-wheat-deep text-ink rounded-tl-none'
          : 'bg-terracotta text-white rounded-tr-none'
      }`}>
        {isBot ? (
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
        ) : (
          text
        )}
      </div>
    </div>
  )
}

const SUGGESTIONS = [
  "What is the treatment for tomato late blight?",
  "टमाटर की खेती के लिए कितना पानी चाहिए?",
  "Which fertilizer is best for wheat crop?",
  "PM-KISAN scheme ke liye kaise apply karein?",
  "How to protect crops from pests in rainy season?",
  "गेहूं की बुवाई का सही समय क्या है?",
  "धान की खेती के लिए कौन सी मिट्टी उपयुक्त है?",
  "पौधों में सफेद फफूंदी का इलाज क्या है?",
  "फसल में पत्तियां सूखने का कारण क्या है?",
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: '🌾🙏 Jai Kisan! Swagat hai KRISHIMITRA AI mein.\n\n Main aapka Smart AI Krishi Sahayak hoon🌾 Aaiye, milkar kheti ko aur smart aur behtar banayein!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text) {
    const userMsg = text || input.trim()
    if (!userMsg) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    const history = messages
      .reduce((acc, msg, i, arr) => {
        if (msg.role === 'user' && arr[i+1]?.role === 'bot') {
          acc.push({ user: msg.text, bot: arr[i+1].text })
        }
        return acc
      }, [])

    try {
      const res = await coreApi.post('/chatbot/chat', {
        message: userMsg,
        history,
      })
      setMessages(prev => [...prev, { role: 'bot', text: res.data.response }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '❌ Sorry, something went wrong. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-ink">KRISHIMITRA AI</h1>
        <p className="text-ink/60 text-sm mt-1">AI farming assistant — ask in Hindi or English 🌾</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-wheat-deep shadow-sm p-4 space-y-4 mb-4">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} text={msg.text} />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-forest text-wheat flex items-center justify-center text-sm shrink-0">🤖</div>
            <div className="bg-white border border-wheat-deep rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                <div className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="text-xs bg-white border border-wheat-deep text-ink/70 px-3 py-1.5 rounded-full hover:border-terracotta hover:text-terracotta transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Apna sawaal likhein... / Type your question..."
          rows={2}
          className="flex-1 border border-wheat-deep rounded-xl px-4 py-3 text-sm text-ink resize-none focus:outline-none focus:ring-2 focus:ring-terracotta bg-white"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="bg-terracotta text-white px-5 rounded-xl font-semibold text-sm hover:bg-terracotta/90 transition disabled:opacity-50 shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  )
}
