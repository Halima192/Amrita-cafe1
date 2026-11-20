import { VISIT_INFO } from '../../data/visit'

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.3c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.92-.16-.27-.02-.42.12-.56.13-.12.28-.32.42-.48.14-.16.18-.27.28-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.99 2.66 1.12 2.84c.14.18 1.95 2.98 4.72 4.18.66.28 1.18.45 1.58.58.66.21 1.27.18 1.75.11.53-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32ZM12.05 2C6.5 2 2 6.48 2 12c0 1.77.46 3.44 1.27 4.89L2 22l5.25-1.38A9.96 9.96 0 0 0 12.05 22C17.6 22 22 17.52 22 12S17.6 2 12.05 2Zm0 18.15c-1.6 0-3.09-.43-4.38-1.18l-.31-.19-3.12.82.83-3.04-.2-.31A8.12 8.12 0 0 1 3.9 12c0-4.48 3.66-8.13 8.15-8.13 4.48 0 8.13 3.65 8.13 8.13 0 4.49-3.65 8.15-8.13 8.15Z" />
    </svg>
  )
}

export function WhatsAppFab({ className = '' }: { className?: string }) {
  return (
    <a
      href={VISIT_INFO.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'grid size-16 shrink-0 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={VISIT_INFO.whatsappLabel}
      title={VISIT_INFO.whatsappLabel}
    >
      <WhatsAppIcon className="size-[55%]" />
    </a>
  )
}
