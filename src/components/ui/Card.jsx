import React from 'react';
import Button from './Button';

const Card = ({
    title,
    subtitle,
    image,
    content,
    footer,
    badges = [],
    className = ''
}) => {
    return (
        <div className={`group relative flex flex-col overflow-hidden rounded-2xl bg-surface border border-gray-800 transition-all duration-300 hover:border-gray-700 hover:shadow-2xl hover:shadow-primary/5 ${className}`}>
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"></div>

            {image && (
                <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            e.target.style.display = 'none'; // Hide broken image
                            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-800');
                            e.target.parentElement.innerHTML = '<span class="text-4xl">🌋</span>'; // Fallback icon
                        }}
                    />
                    {/* Overlaid Badges */}
                    {badges.length > 0 && (
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {badges.map((badge, index) => (
                                <span
                                    key={index}
                                    className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${badge.color || 'bg-gray-800 text-white'}`}
                                >
                                    {badge.text}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-1 flex-col p-6 z-10">
                {subtitle && (
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                        {subtitle}
                    </div>
                )}

                <h3 className="mb-3 text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <p className="flex-1 text-gray-400 line-clamp-3 mb-6">
                    {content}
                </p>

                {footer && (
                    <div className="mt-auto border-t border-gray-800 pt-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
