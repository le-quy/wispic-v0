import { cn } from '@/lib/utils'

export function Logo({
  className,
  showMark = true,
}: {
  className?: string
  showMark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      {showMark && <WispicMark className="self-center" />}
      <span className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        WISPIC
      </span>
    </span>
  )
}

/** Camera + Leaf mark — visual identity của WISPIC */
export function WispicMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn('h-6 w-6', className)}
    >
      {/* Leaf — Tangerine */}
      <path
        d="M7 24C7 14 19 7.5 25 6c-1.5 8-10.5 16-18 18z"
        className="fill-tangerine"
      />
      <path d="M7 24C11 20 16 17.5 21 16" stroke="#f7f2e9" strokeWidth="1.4" strokeLinecap="round" />
      {/* Camera body */}
      <rect
        x="8.5"
        y="12.5"
        width="15"
        height="11.5"
        rx="2.25"
        stroke="currentColor"
        strokeWidth="1.6"
        className="text-charcoal"
      />
      <circle
        cx="16"
        cy="18.25"
        r="3.4"
        stroke="currentColor"
        strokeWidth="1.6"
        className="text-charcoal"
      />
      <rect x="10" y="15.2" width="2.6" height="1.1" rx="0.55" className="fill-terracotta" />
    </svg>
  )
}