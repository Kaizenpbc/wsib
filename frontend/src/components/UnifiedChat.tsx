import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader, Sparkles } from 'lucide-react'
import axios from 'axios'

const API_URL = (import.meta as any).env?.VITE_BACKEND_API_URL || 'http://localhost:8000'

interface Message {
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

interface UnifiedChatProps {
  rfpId: string
  rfpTitle: string
  onWorkItemUpdate: (type: 'curriculum' | 'brd' | 'ppt', title: string, data: any, status?: 'draft' | 'ready' | 'generating') => void
}

export default function UnifiedChat({
  rfpId,
  rfpTitle,
  onWorkItemUpdate
}: UnifiedChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! 👋 I'm your AI assistant for "${rfpTitle}".\n\nI can help you:\n\n📚 **Create Curricula** - Professional instructional design\n📋 **Generate BRD** - Extract business requirements\n📊 **Design PowerPoint** - Customized presentations\n✅ **More coming soon** - Manuals, scenarios, tests\n\nWhat would you like to create today?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [context, setContext] = useState<any>({})
  const [suggestions, setSuggestions] = useState<string[]>([
    "Create a curriculum for this RFP",
    "Generate business requirements document",
    "I need 3 different courses from this RFP"
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
      // Determine task type from message or context
      const taskType = context.task_type || detectTaskType(textToSend)
      
      let endpoint = '/api/curriculum/chat'
      if (taskType === 'brd') {
        endpoint = '/api/brd/chat'  // Will create this
      } else if (taskType === 'ppt') {
        endpoint = '/api/outputs/ppt-chat'
      }

      // Call appropriate backend chat API
      const response = await axios.post(`${API_URL}${endpoint}`, {
        rfp_id: rfpId,
        message: textToSend,
        conversation_history: messages,
        current_context: { ...context, task_type: taskType }
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      console.log('[Unified Chat] Response:', response.data)
      
      // Update context
      if (response.data.current_context) {
        setContext({ ...response.data.current_context, task_type: taskType })
      }
      
      // Update suggestions
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        setSuggestions(response.data.suggestions)
      }
      
      // Update work panel based on task type
      if (response.data.curriculum_preview) {
        onWorkItemUpdate('curriculum', 'Curriculum Design', response.data.curriculum_preview, 'draft')
      } else if (response.data.brd_preview) {
        onWorkItemUpdate('brd', 'Business Requirements', response.data.brd_preview, 'draft')
      } else if (response.data.ppt_outline) {
        onWorkItemUpdate('ppt', 'PowerPoint Presentation', response.data.ppt_outline, 'draft')
      }
      
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Could you try rephrasing that?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setSending(false)
    }
  }

  const detectTaskType = (message: string): string => {
    const lower = message.toLowerCase()
    
    if (lower.includes('brd') || lower.includes('business requirement') || lower.includes('requirements document')) {
      return 'brd'
    }
    if (lower.includes('ppt') || lower.includes('powerpoint') || lower.includes('presentation') || lower.includes('slides')) {
      return 'ppt'
    }
    // Default to curriculum
    return 'curriculum'
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
    <div className="flex flex-col h-full">
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
                  ? 'bg-gradient-to-br from-primary-100 to-purple-100 text-primary-600'
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
              className={`flex-1 max-w-[85%] ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block px-4 py-3 rounded-2xl ${
                  message.role === 'assistant'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-gradient-to-r from-primary-600 to-purple-600 text-white'
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
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-purple-100 text-primary-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="inline-block px-4 py-3 rounded-2xl bg-gray-100">
              <Loader className="w-4 h-4 animate-spin text-primary-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {/* Suggestions */}
        {suggestions.length > 0 && !sending && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">💡 Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-300 hover:border-primary-500 hover:from-primary-100 hover:to-purple-100 text-gray-700 rounded-full transition-all"
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
            placeholder="Tell me what you'd like to create..."
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            rows={3}
            disabled={sending}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="px-6 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ✨ Powered by AI • Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

