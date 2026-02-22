import Image from 'next/image'
import { PawTrail } from '@/components/ui/paw-trail'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Paw prints — mascot walked through the login page */}
      <PawTrail variant="diagonal" opacity={0.07} />

      {/* Giant mascot backdrop */}
      <div className="pointer-events-none absolute -right-20 -bottom-20 opacity-[0.06] select-none">
        <Image src="/logo.png" alt="" width={700} height={700} priority aria-hidden="true" className="rotate-[-8deg]" />
      </div>
      <div className="pointer-events-none absolute -left-16 -top-16 opacity-[0.04] select-none">
        <Image src="/logo.png" alt="" width={400} height={400} aria-hidden="true" className="rotate-[12deg]" />
      </div>

      {/* Logo + brand */}
      <div className="relative z-10 mb-8 flex flex-col items-center gap-3">
        <Image src="/logo.png" alt="OpenPaws" width={140} height={140} priority className="drop-shadow-lg" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
      <p className="relative z-10 mt-8 text-sm text-gray-500">
        &copy; 2026 OpenPaws. Built by HAAIS.
      </p>
    </div>
  )
}
