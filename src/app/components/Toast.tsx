import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-[#00cf40] text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 min-w-[280px]">
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
        <span className="text-lg flex-1">{message}</span>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
