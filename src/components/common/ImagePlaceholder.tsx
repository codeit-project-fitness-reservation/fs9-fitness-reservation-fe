interface ImagePlaceholderProps {
  className?: string;
}

export default function ImagePlaceholder({ className = '' }: ImagePlaceholderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="text-sm text-gray-400">No Image</span>
    </div>
  );
}
