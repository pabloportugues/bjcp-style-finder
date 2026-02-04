import { useState, useEffect, useMemo } from 'react'
import { SearchInput } from './components/SearchInput'
import { StyleCard } from './components/StyleCard'
import { QuickStart } from './components/QuickStart'
import { FilterPanel } from './components/FilterPanel'
import { useBeerSearch } from './hooks/useBeerSearch'
import { calculateStats } from './utils/stats'
import beerGlass from './assets/beer_glass.png'
import './App.css'

function App() {
    const [styles, setStyles] = useState([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [stats, setStats] = useState(null)
    const [filters, setFilters] = useState(null)
    const [error, setError] = useState(null);

    useEffect(() => {
        // Use BASE_URL to handle GitHub Pages subpath
        const baseUrl = import.meta.env.BASE_URL;
        const dataPath = `${baseUrl}data/bjcp_2021.json`.replace('//', '/');

        fetch(dataPath)
            .then(res => res.json())
            .then(data => {
                let loadedStyles = [];
                if (data.beerjson && data.beerjson.styles) {
                    loadedStyles = data.beerjson.styles;
                } else if (Array.isArray(data)) {
                    loadedStyles = data;
                } else if (data.styles) {
                    loadedStyles = data.styles;
                } else {
                    setError("Failed to parse guideline data structure.");
                }

                if (loadedStyles.length > 0) {
                    setStyles(loadedStyles);
                    const calculatedStats = calculateStats(loadedStyles);
                    setStats(calculatedStats);

                    // Initialize filters with full range
                    setFilters({
                        abv: [calculatedStats.abv.min, calculatedStats.abv.max],
                        ibu: [calculatedStats.ibu.min, calculatedStats.ibu.max],
                        ebc: [calculatedStats.ebc.min, calculatedStats.ebc.max],
                    });
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load styles:", err);
                setError("Could not load BJCP data.");
                setLoading(false);
            })
    }, [])

    const results = useBeerSearch(styles, query, filters)

    // Check if filters match default stats (i.e. user hasn't touched them)
    const isFiltering = useMemo(() => {
        if (!stats || !filters) return false;
        return (
            filters.abv[0] !== stats.abv.min || filters.abv[1] !== stats.abv.max ||
            filters.ibu[0] !== stats.ibu.min || filters.ibu[1] !== stats.ibu.max ||
            filters.ebc[0] !== stats.ebc.min || filters.ebc[1] !== stats.ebc.max
        );
    }, [stats, filters]);

    // Show results if searching OR filtering
    const showResults = query.length > 0 || isFiltering;

    return (
        <div className="app-container">

            <header>
                <div className="header-credits">credit <a href="https://www.linkedin.com/in/pabloportugues">@pabloportugues</a></div>
                <div className="header-content">
                    <img src={beerGlass} className="beer-logo" alt="Beer Glass" />
                    <h1>Beer <span>Style Finder</span></h1>
                    <p className="subtitle">Discover beer styles based on your preferences</p>
                </div>
            </header>

            <main>
                <div className="search-section">
                    <h2 className="search-prompt">What do you feel like drinking today?</h2>
                    <SearchInput
                        value={query}
                        onChange={setQuery}
                        placeholder="Describe what you like... (e.g., coffee, rich, fruity, sweet)"
                    />

                    {filters && stats && (
                        <FilterPanel
                            stats={stats}
                            filters={filters}
                            onChange={setFilters}
                        />
                    )}
                </div>

                {loading && <div className="loading-state">Loading Guidelines...</div>}
                {error && <div className="error-state">{error}</div>}

                {!loading && !showResults && (
                    <QuickStart onSelect={setQuery} />
                )}

                {showResults && (
                    <div className="results-container">
                        {results.length === 0 ? (
                            <p className="no-results">
                                No styles found matching {query ? `"${query}"` : "your filters"}
                            </p>
                        ) : (
                            results.map((style, idx) => (
                                <StyleCard key={style.style_id || style.name || idx} style={style} />
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default App
