import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { srmToEbc } from '../utils/srm';

export function useBeerSearch(styles, query, filters) {
    const [results, setResults] = useState([]);

    // 1. First, apply Range Filters to get a candidate set
    // We memoize this so we don't re-filter on every keystroke if filters didn't change
    const filteredStyles = useMemo(() => {
        if (!styles || !filters) return styles;

        return styles.filter(style => {
            // ABV
            const abvMin = parseFloat(style.alcohol_by_volume?.minimum?.value || 0);
            const abvMax = parseFloat(style.alcohol_by_volume?.maximum?.value || 0);
            // Check if style range overlaps with filter range
            // Style [sMin, sMax] overlaps Filter [fMin, fMax] if sMin <= fMax && sMax >= fMin
            // Ideally, we want styles that fit WITHIN the filter? Or just overlap?
            // "Show beers with ABV between 4% and 6%" usually means style.abv matches that.
            // Simplified: If style's avg ABV is within range? Or if style range overlaps?
            // "Use the lower and upper limit of all beers" usually implies we are filtering down.
            // Let's go with: Style's range overlaps with selected filter range.
            const abvOverlap = (abvMin <= filters.abv[1] && abvMax >= filters.abv[0]);

            // IBU
            const ibuMin = parseFloat(style.international_bitterness_units?.minimum?.value || 0);
            const ibuMax = parseFloat(style.international_bitterness_units?.maximum?.value || 0);
            const ibuOverlap = (ibuMin <= filters.ibu[1] && ibuMax >= filters.ibu[0]);

            // EBC
            const srmMin = parseFloat(style.color?.minimum?.value || 0);
            const srmMax = parseFloat(style.color?.maximum?.value || 0);
            const ebcMin = parseFloat(srmToEbc(srmMin));
            const ebcMax = parseFloat(srmToEbc(srmMax));
            const ebcOverlap = (ebcMin <= filters.ebc[1] && ebcMax >= filters.ebc[0]);

            return abvOverlap && ibuOverlap && ebcOverlap;
        });
    }, [styles, filters]);

    // 2. Initialize Fuse with the Filtered Set
    const fuse = useMemo(() => {
        if (!filteredStyles || filteredStyles.length === 0) return null;

        const options = {
            includeScore: true,
            keys: [
                { name: 'name', weight: 0.4 },
                { name: 'overall_impression', weight: 0.3 },
                { name: 'tags', weight: 0.2 },
                { name: 'flavor', weight: 0.1 },
                { name: 'aroma', weight: 0.1 },
                { name: 'examples', weight: 0.1 }
            ],
            threshold: 0.4,
            ignoreLocation: true
        };

        return new Fuse(filteredStyles, options);
    }, [filteredStyles]);

    // 3. Perform Search or Return Filtered List
    useMemo(() => {
        // If no query, return all filtered styles (if we are filtering)
        // We'll let the UI decide when to show them.
        if (!query) {
            setResults(filteredStyles || []);
            return;
        }

        if (fuse) {
            const searchResults = fuse.search(query);

            // Custom Sort: Prioritize Alphabetical order if scores are close
            searchResults.sort((a, b) => {
                const scoreDiff = a.score - b.score;
                if (Math.abs(scoreDiff) > 0.2) return scoreDiff;
                return a.item.name.localeCompare(b.item.name);
            });

            setResults(searchResults.map(result => result.item));
        }
    }, [fuse, query, filteredStyles]);

    return results;
}


