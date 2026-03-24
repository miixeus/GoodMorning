interface GreetingButtonProps {
  emoji: string;
  text: string;
  isSelected: boolean;
  onClick: () => void;
}

export function GreetingButton({ emoji, text, isSelected, onClick }: GreetingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-6 py-6 rounded-2xl transition-all duration-200 border-3 shadow-md active:scale-[0.98] hover:shadow-lg ${
        isSelected
          ? 'bg-[#00cf40] text-white border-[#00cf40] scale-[1.02]'
          : 'bg-white text-black border-[#e0e0e0] hover:bg-[#f5f5f5] hover:border-[#d0d0d0]'
      }`}
      style={{ borderWidth: '3px' }}
    >
      <span className="flex items-center justify-center gap-3">
        <span className={`text-3xl transition-transform duration-200 ${isSelected ? 'scale-110' : 'hover:scale-110'}`}>
          {emoji}
        </span>
        <span className="text-xl">{text}</span>
      </span>
    </button>
  );
}