import React from 'react';
import './QuickStart.css';

export function QuickStart({ onSelect }) {
    const suggestions = [
        { label: "Light & Refreshing", query: "American Light Lager" },
        { label: "Coffee Notes", query: "coffee roast" },
        { label: "Spicy Wheat", query: "Weissbier" },
        { label: "Bitter IPA", query: "IPA bitter" },
        { label: "Dark & Malty", query: "complex dark malt" }
    ];

    return (
        <div className="quick-start">
            <p>Try searching for:</p>
            <div className="suggestion-chips">
                {suggestions.map((s) => (
                    <button
                        key={s.label}
                        className="chip"
                        onClick={() => onSelect(s.query)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
