import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center px-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <Image src="/logo.png" alt="OpenPaws" width={120} height={120} priority className="drop-shadow-md" />
        <span className="text-2xl font-bold text-gray-900 tracking-tight">OpenPaws</span>
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
