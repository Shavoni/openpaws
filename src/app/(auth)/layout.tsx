import { PawPrint } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center px-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
          <PawPrint className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900">OpenPaws</span>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
      <p className="mt-8 text-sm text-gray-500">
        &copy; 2026 OpenPaws. Built by HAAIS.
      </p>
    </div>
  )
}
