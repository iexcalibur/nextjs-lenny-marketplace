interface ButtonProps {
  text: string;
  onClick?: () => void | Promise<void>;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export default function Button({ 
  text, 
  onClick, 
  bgColor = 'bg-[#1E4C2F]',
  textColor = 'text-white',
  className = ''
}: ButtonProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      try {
        await onClick();
      } catch (error) {
        console.error('Button click error:', error);
      }
    }
  };

  return (
    <button 
      type="button"
      onClick={handleClick}
      className={`px-8 py-4 rounded-lg hover:bg-opacity-90 transition ${bgColor} ${textColor} ${className}`}
    >
      {text}
    </button>
  );
} 