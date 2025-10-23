import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader, Sparkles } from 'lucide-react'
import axios from 'axios'

const API_URL = (import.meta as any).env?.VITE_BACKEND_API_URL || 'http://localhost:8000'

interface Message {
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

interface PptChatProps {
  curriculumId: string
  curriculumTitle: string
  onPptReady?: (pptData: any) => void
}

export default function PptChat({
  curriculumId,
  curriculumTitle,
  onPptReady
}: PptChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'll help you create a PowerPoint presentation for "${curriculumTitle}".\n\nYou can customize:\n• Color theme and design\n• Which modules to include\n• Slide types (content, practice, assessment)\n• Instructor notes\n• Number of slides\n\nWhat kind of presentation would you like?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [context, setContext] = useState<any>({})
  const [suggestions, setSuggestions] = useState<string[]>([
    "Professional blue theme with all modules",
    "Focus on hands-on practice slides",
    "Include assessment questions on each module"
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
      // Call backend PPT chat API
      const response = await axios.post(`${API_URL}/api/outputs/ppt-chat`, {
        curriculum_id: curriculumId,
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
      
      console.log('[PPT Chat] Response:', response.data)
      
      // Update context
      if (response.data.current_context) {
        setContext(response.data.current_context)
      }
      
      // Update suggestions
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        setSuggestions(response.data.suggestions)
      }
      
      // If PPT is ready to generate
      if (response.data.ppt_outline) {
        onPptReady?.(response.data.ppt_outline)
      }
      
    } catch (error) {
      console.error('PPT Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
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
    <div className="flex flex-col h-[500px] bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="p-2 bg-purple-100 rounded-full">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">PowerPoint Designer AI</h3>
          <p className="text-sm text-gray-600">Let's create your presentation</p>
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
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {message.role === 'assistant' ? (
                <Sparkles className="w-4 h-4" />
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
                    : 'bg-purple-600 text-white'
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
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="inline-block px-4 py-3 rounded-2xl bg-gray-100">
              <Loader className="w-4 h-4 animate-spin text-purple-600" />
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
            <p className="text-xs text-gray-600 mb-2">Quick options:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-sm bg-white border border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700 rounded-full transition-colors"
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
            placeholder="Describe your presentation preferences..."
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={2}
            disabled={sending}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Specify theme, colors, focus areas, or slide types
        </p>
      </div>
    </div>
  )
}

