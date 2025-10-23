import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader } from 'lucide-react'
import axios from 'axios'

const API_URL = (import.meta as any).env?.VITE_BACKEND_API_URL || 'http://localhost:8000'

interface Message {
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

interface CurriculumChatProps {
  rfpId: string
  rfpTitle: string
  clausesCount: number
  onClausesSelected?: (clauseIds: string[]) => void
  onCurriculumGenerated?: (curriculumData: any) => void
}

export default function CurriculumChat({
  rfpId,
  rfpTitle,
  clausesCount,
  onClausesSelected,
  onCurriculumGenerated
}: CurriculumChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm here to help you create curricula from "${rfpTitle}".\n\nI can see ${clausesCount} requirements from the RFP. Let's build your curriculum together!\n\nYou can:\n• Tell me what kind of course you want to create\n• Answer my questions step-by-step\n• Or just chat naturally - I'll adapt!\n\nWhat would you like to create?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [context, setContext] = useState<any>({})
  const [suggestions, setSuggestions] = useState<string[]>([
    "Create a basic CPR course for healthcare workers",
    "I need to create 3 different courses from this RFP",
    "8-hour first aid training with AED certification"
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || sending) return

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      // Call backend chat API
      const response = await axios.post(`${API_URL}/api/curriculum/chat`, {
        rfp_id: rfpId,
        message: textToSend,
        conversation_history: messages,
        current_context: context
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      console.log('[Chat] Response:', response.data)
      
      // Update context FIRST (preserve conversation state)
      if (response.data.current_context) {
        console.log('[Chat] Updating context:', response.data.current_context)
        setContext(response.data.current_context)
      }
      
      // Update selected clauses
      if (response.data.selected_clauses && response.data.selected_clauses.length > 0) {
        console.log('[Chat] Selected clauses:', response.data.selected_clauses.length)
        onClausesSelected?.(response.data.selected_clauses)
      }
      
      // Update curriculum preview
      if (response.data.curriculum_preview) {
        console.log('[Chat] Curriculum preview available')
        onCurriculumGenerated?.(response.data.curriculum_preview)
      }
      
      // Update suggestions
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        console.log('[Chat] New suggestions:', response.data.suggestions)
        setSuggestions(response.data.suggestions)
      }
      
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or try rephrasing your request.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setSending(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="p-2 bg-primary-100 rounded-full">
          <Bot className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Curriculum Designer AI</h3>
          <p className="text-sm text-gray-600">Let's create your curriculum together</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'assistant'
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`flex-1 max-w-[80%] ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block px-4 py-3 rounded-2xl ${
                  message.role === 'assistant'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-primary-600 text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-2">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="inline-block px-4 py-3 rounded-2xl bg-gray-100">
              <Loader className="w-4 h-4 animate-spin text-primary-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        {/* Suggestions */}
        {suggestions.length > 0 && !sending && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 hover:border-primary-500 hover:bg-primary-50 text-gray-700 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the curriculum you want to create..."
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={2}
            disabled={sending}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Be specific about course duration, audience, and key topics
        </p>
      </div>
    </div>
  )
}

