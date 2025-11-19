import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: 'bg-white/95 backdrop-blur-md border-2 shadow-2xl rounded-md',
          title: 'text-sm font-semibold text-gray-900',
          description: 'text-sm text-gray-600',
          actionButton: 'bg-[#4B8B32] text-white hover:bg-green-700 font-medium px-3 py-1.5 rounded-md text-sm transition-all duration-200',
          cancelButton: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium px-3 py-1.5 rounded-md text-sm transition-all duration-200',
          closeButton: 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200 rounded-md',
          error: 'border-red-500 bg-red-50/95 backdrop-blur-md',
          success: 'border-[#4B8B32] bg-green-50/95 backdrop-blur-md',
          warning: 'border-orange-500 bg-orange-50/95 backdrop-blur-md',
          info: 'border-[#2196F3] bg-blue-50/95 backdrop-blur-md',
        },
        duration: 4000,
        style: {
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
        },
      }}
      expand={true}
      richColors={false}
      closeButton={true}
    />
  )
}
