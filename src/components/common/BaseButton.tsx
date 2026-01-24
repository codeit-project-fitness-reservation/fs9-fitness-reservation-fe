interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const BaseButton = ({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: BaseButtonProps) => {
  const variantStyles =
    variant === 'primary'
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50';

  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[14px] font-bold transition-colors ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
