import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 hover:from-blue-600 hover:via-blue-700 hover:to-sky-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-700 shadow-md hover:shadow-lg',
    outline: 'bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl',
    disabled: 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-md'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${disabled ? variants.disabled : variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;