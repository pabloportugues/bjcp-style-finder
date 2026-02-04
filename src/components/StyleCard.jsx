import React from 'react';
import { getReviewColor, srmToEbc } from '../utils/srm';
import './StyleCard.css';

export function StyleCard({ style }) {
    const srmBlob = {
        background: style.color && style.color.minimum
            ? getReviewColor(style.color.minimum.value, style.color.maximum.value)
            : '#f8f9fa'
    };

    const tags = style.tags ? style.tags.split(',').map(t => t.trim()) : [];

    return (
        <div className="style-card">
            <div className="style-header">
                <div className="beer-avatar" style={srmBlob}>
                    <div className="froth"></div>
                </div>
                <div className="title-section">
                    <h2>{style.name}</h2>
                    <span className="category-id">{style.style_id} - {style.category}</span>
                </div>
            </div>

            <p className="impression">{style.overall_impression}</p>

            <div className="stats-grid">
                <div className="stat-item">
                    <span className="label">ABV</span>
                    <span className="value">
                        {style.alcohol_by_volume?.minimum?.value || '?'} - {style.alcohol_by_volume?.maximum?.value || '?'}%
                    </span>
                </div>
                <div className="stat-item">
                    <span className="label">IBU</span>
                    <span className="value">
                        {style.international_bitterness_units?.minimum?.value || '?'} - {style.international_bitterness_units?.maximum?.value || '?'}
                    </span>
                </div>
                <div className="stat-item">
                    <span className="label">EBC</span>
                    <span className="value">
                        {srmToEbc(style.color?.minimum?.value)} - {srmToEbc(style.color?.maximum?.value)}
                    </span>
                </div>
            </div>

            <div className="commercial-examples">
                <h3>Commercial Examples</h3>
                <p>{style.examples}</p>
            </div>

            <div className="tags-list">
                {tags.slice(0, 5).map(tag => (
                    <span key={tag} className="tag-badge">{tag}</span>
                ))}
            </div>
        </div>
    );
}
