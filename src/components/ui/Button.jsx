import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
    primary: 'bg-primary hover:bg-green-500 text-white shadow-lg shadow-green-900/20',
    secondary: 'bg-secondary hover:bg-red-500 text-white shadow-lg shadow-red-900/20',
    accent: 'bg-accent hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20',
    outline: 'border-2 border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-transparent',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base font-semibold',
    lg: 'px-8 py-4 text-lg font-bold',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    to = null,
    onClick,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0e17] focus:ring-slate-400';
    const variantStyles = variants[variant] || variants.primary;
    const sizeStyles = sizes[size] || sizes.md;

    const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`;

    if (to) {
        return (
            <Link to={to} className={combinedClassName} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={combinedClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;
