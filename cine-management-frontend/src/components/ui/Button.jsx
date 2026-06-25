export function Button({
  children,
  onClick,
  disabled,
  type = "button",
  variant = "primary",
  isLoading = false,
}) {
  const baseClasses =
    "px-6 py-3 min-h-[44px] font-medium rounded-lg transition-colors duration-200 flex justify-center items-center gap-2 cursor-pointer";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed",
    dark: "bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-400 disabled:cursor-not-allowed",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {isLoading ? (
        <span className="animate-pulse">Cargando...</span>
      ) : (
        children
      )}
    </button>
  );
}
