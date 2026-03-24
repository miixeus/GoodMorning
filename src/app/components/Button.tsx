interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'w-full px-6 py-5 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-[0.98] hover:shadow-lg';
  
  const variants = {
    primary: 'bg-[#00cf40] text-white hover:bg-[#00b938] active:bg-[#00a030]',
    secondary: 'bg-[#5f19ea] text-white hover:bg-[#5010d0] active:bg-[#4810c0]',
    outline: 'bg-white border-2 border-[#e0e0e0] text-black hover:bg-[#f5f5f5] active:bg-[#ebebeb] hover:border-[#d0d0d0]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}