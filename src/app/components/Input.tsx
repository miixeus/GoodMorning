interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Input({ value, onChange, placeholder, className = '' }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-6 py-5 rounded-2xl bg-[#f5f5f5] border-2 border-transparent focus:border-[#00cf40] focus:outline-none focus:bg-white transition-all duration-200 hover:bg-white text-lg ${className}`}
    />
  );
}