import { useState } from 'react';
import type { Address } from '../types';

interface MapPreviewProps {
    address: Address;
    className?: string;
}

export default function MapPreview({ address, className = '' }: MapPreviewProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [showFullMap, setShowFullMap] = useState(false);

    // Create a search query from the address
    const addressQuery = encodeURIComponent(
        `${address.street} ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`
    );

    // Google Maps static map URL (no API key required for basic embedding)
    const googleMapsUrl = `https://maps.google.com/maps?q=${addressQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

    const handleImageLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const handleMapClick = () => {
        setShowFullMap(!showFullMap);
    };

    const handleOpenInMaps = () => {
        // Try to open in the user's preferred maps app
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Try to open in native maps app
            const mapsUrl = `https://maps.apple.com/?q=${addressQuery}`;
            window.open(mapsUrl, '_blank');
        } else {
            // Open in Google Maps web
            window.open(`https://maps.google.com/maps?q=${addressQuery}`, '_blank');
        }
    };

    if (showFullMap) {
        return (
            <div className={`relative ${className}`}>
                <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <iframe
                        src={googleMapsUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map for ${address.street} ${address.number}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />

                    {/* Close button */}
                    <button
                        onClick={handleMapClick}
                        className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full p-1 shadow-md"
                        title="Close map"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Open in Maps button */}
                    <button
                        onClick={handleOpenInMaps}
                        className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded shadow-md"
                        title="Open in Maps"
                    >
                        Open in Maps
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer" onClick={handleMapClick}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {hasError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs text-center">Click to view map</span>
                    </div>
                ) : (
                    <iframe
                        src={googleMapsUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, pointerEvents: 'none' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map preview for ${address.street} ${address.number}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                )}

                {/* Overlay to make it clickable */}
                <div className="absolute inset-0 bg-transparent hover:bg-black hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs opacity-0 hover:opacity-100 transition-opacity duration-200">
                        Click to expand
                    </div>
                </div>
            </div>
        </div>
    );
}
