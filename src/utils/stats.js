
import { srmToEbc } from './srm';

export const calculateStats = (styles) => {
    // Initial bounds
    const stats = {
        abv: { min: 100, max: 0 },
        ibu: { min: 200, max: 0 },
        ebc: { min: 200, max: 0 }
    };

    styles.forEach(style => {
        // ABV
        if (style.alcohol_by_volume) {
            const min = parseFloat(style.alcohol_by_volume.minimum?.value || 0);
            const max = parseFloat(style.alcohol_by_volume.maximum?.value || 0);
            if (min < stats.abv.min && min > 0) stats.abv.min = min;
            if (max > stats.abv.max) stats.abv.max = max;
        }

        // IBU
        if (style.international_bitterness_units) {
            const min = parseFloat(style.international_bitterness_units.minimum?.value || 0);
            const max = parseFloat(style.international_bitterness_units.maximum?.value || 0);
            if (min < stats.ibu.min) stats.ibu.min = min;
            if (max > stats.ibu.max) stats.ibu.max = max;
        }

        // Color (EBC)
        if (style.color) {
            // Data is in SRM, convert to EBC for stats
            const minSrm = parseFloat(style.color.minimum?.value || 0);
            const maxSrm = parseFloat(style.color.maximum?.value || 0);

            const minEbc = parseFloat(srmToEbc(minSrm));
            const maxEbc = parseFloat(srmToEbc(maxSrm));

            if (minEbc < stats.ebc.min) stats.ebc.min = minEbc;
            if (maxEbc > stats.ebc.max) stats.ebc.max = maxEbc;
        }
    });

    // Rounding and safety
    stats.abv.min = Math.floor(stats.abv.min);
    stats.abv.max = Math.ceil(stats.abv.max);

    stats.ibu.min = Math.floor(stats.ibu.min);
    stats.ibu.max = Math.ceil(stats.ibu.max);

    stats.ebc.min = Math.floor(stats.ebc.min);
    stats.ebc.max = Math.ceil(stats.ebc.max);

    return stats;
};
