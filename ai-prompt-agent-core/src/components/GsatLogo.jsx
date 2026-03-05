import React from 'react';

/**
 * الجبل والقصبة — Gsat brand logo
 * Mountain = structural strength · Kasbah = protection & authenticity
 * Neon pulse beacon at the peak ties into the Deep-Space dark theme.
 */
export default function GsatLogo({ className = 'h-8 w-8', neon = true }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-label="Gsat Logo"
    >
      {/* Mountain silhouette */}
      <path
        d="M40 140 L100 40 L160 140 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      {/* Kasbah body */}
      <rect x="75" y="100" width="50" height="40" fill="currentColor" />
      {/* Kasbah roof / battlement */}
      <path d="M70 100 L130 100 L115 85 L85 85 Z" fill="currentColor" />
      {/* Neon peak beacon */}
      {neon && (
        <circle
          cx="100"
          cy="70"
          r="5"
          className="animate-neon-pulse fill-neon-blue dark:fill-neon-cyan"
        />
      )}
    </svg>
  );
}
