
import React, { useState } from 'react';
import './FilterPanel.css';

const RangeSlider = ({ label, min, max, value, onChange, unit = '' }) => {
    // value is [min, max]
    const [minVal, maxVal] = value;

    // Convert to percentage for the slider track background
    const getPercent = (v) => Math.round(((v - min) / (max - min)) * 100);
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    const handleChangeMin = (e) => {
        const val = Math.min(Number(e.target.value), maxVal - 1);
        onChange([val, maxVal]);
    };

    const handleChangeMax = (e) => {
        const val = Math.max(Number(e.target.value), minVal + 1);
        onChange([minVal, val]);
    };

    return (
        <div className="range-slider-container">
            <div className="slider-header">
                <label>{label}</label>
                <span className="slider-values">
                    {minVal}{unit} - {maxVal}{unit}
                </span>
            </div>

            <div className="slider-wrapper">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={handleChangeMin}
                    className="thumb thumb--left"
                    style={{ zIndex: minVal > max - 10 ? '5' : '3' }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={handleChangeMax}
                    className="thumb thumb--right"
                />

                <div className="slider">
                    <div className="slider__track" />
                    <div
                        className="slider__range"
                        style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export function FilterPanel({ stats, filters, onChange }) {
    if (!stats) return null;
    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = (key, newValue) => {
        onChange({ ...filters, [key]: newValue });
    };

    return (
        <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
            <button
                className="filter-toggle"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
                Filter by Stats
            </button>

            {isOpen && (
                <div className="filter-content">
                    <RangeSlider
                        label="Alcohol (ABV)"
                        unit="%"
                        min={stats.abv.min}
                        max={stats.abv.max}
                        value={filters.abv}
                        onChange={(val) => handleFilterChange('abv', val)}
                    />
                    <RangeSlider
                        label="Bitterness (IBU)"
                        min={stats.ibu.min}
                        max={stats.ibu.max}
                        value={filters.ibu}
                        onChange={(val) => handleFilterChange('ibu', val)}
                    />
                    <RangeSlider
                        label="Color (EBC)"
                        min={stats.ebc.min}
                        max={stats.ebc.max}
                        value={filters.ebc}
                        onChange={(val) => handleFilterChange('ebc', val)}
                    />
                </div>
            )}
        </div>
    );
}
