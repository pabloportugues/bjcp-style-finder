// Approximate SRM to Hex colors
export const getSrmColor = (srm) => {
    // Cap SRM at 40+ (Black)
    const val = Math.min(Math.max(srm, 1), 40);

    // Mapping based on common SRM charts
    const colors = {
        1: '#FFE699',
        2: '#FFD878',
        3: '#FFCA5A',
        4: '#FFBF42',
        5: '#FBB123',
        6: '#F8A600',
        7: '#F39C00',
        8: '#EA8F00',
        9: '#E58500',
        10: '#DE7C00',
        11: '#D77200',
        12: '#CF6900',
        13: '#CB6200',
        14: '#C35900',
        15: '#BB5100',
        16: '#B54C00',
        17: '#B04500',
        18: '#A63E00',
        19: '#A13700',
        20: '#9B3200',
        21: '#952D00',
        22: '#8E2900',
        23: '#882300',
        24: '#821E00',
        25: '#7B1A00',
        26: '#771900',
        27: '#701400',
        28: '#6A0E00',
        29: '#660D00',
        30: '#5E0B00',
        35: '#380602', // Deep Brown/Black
        40: '#000000'
    };

    // Find closest key if exact match missing
    if (colors[Math.round(val)]) return colors[Math.round(val)];

    // Flashback to black if very dark
    if (val > 30) return '#1A1A1A';

    return '#FFE699'; // Default Straw
};

export const getReviewColor = (srmMin, srmMax) => {
    const avg = (parseFloat(srmMin) + parseFloat(srmMax)) / 2;
    return getSrmColor(avg);
}

export const srmToEbc = (srm) => {
    if (!srm) return '?';
    return (parseFloat(srm) * 1.97).toFixed(0);
}
