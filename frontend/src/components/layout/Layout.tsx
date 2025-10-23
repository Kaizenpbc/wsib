import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText, BookOpen, FileOutput, CheckSquare, Home, Shield, FileCheck, Bot } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: '🤖 AI Assistant', href: '/ai-assistant', icon: Bot, highlight: true },
    { name: 'Upload RFP', href: '/rfp-upload', icon: FileText },
    { name: 'Upload Standards', href: '/standards-upload', icon: Shield },
    { name: 'Business Requirements', href: '/brd', icon: FileCheck },
    { name: 'Curriculum Design', href: '/curriculum/new', icon: BookOpen },
    { name: 'Generate Outputs', href: '/outputs/new', icon: FileOutput },
    { name: 'Compliance', href: '/compliance/new', icon: CheckSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                GTA CPR Curriculum Designer
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">WSIB Project</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              const isHighlight = (item as any).highlight
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? isHighlight 
                        ? 'bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 font-semibold shadow-sm'
                        : 'bg-primary-50 text-primary-700 font-medium'
                      : isHighlight
                        ? 'bg-gradient-to-r from-primary-50 to-purple-50 text-gray-700 hover:from-primary-100 hover:to-purple-100 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

