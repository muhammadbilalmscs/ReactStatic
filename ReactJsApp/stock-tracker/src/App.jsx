import React, { useState, useEffect } from 'react';
 
export default function StockTracker() {
  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 0, change: 0, changePercent: 0 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 0, change: 0, changePercent: 0 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 0, change: 0, changePercent: 0 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 0, change: 0, changePercent: 0 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 0, change: 0, changePercent: 0 }
  ]);
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 300000);
    return () => clearInterval(interval);
  }, []);
 
  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);
 
      const updatedStocks = await Promise.all(
        stocks.map(async (stock) => {
          const API_KEY = '6SH959G8QP7K1ELK'; // Replace with your API key from alphavantage.co
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${API_KEY}`;
 
          try {
            const response = await fetch(url);
            const data = await response.json();
 
            if (data['Global Quote']) {
              const quote = data['Global Quote'];
              return {
                ...stock,
                price: parseFloat(quote['05. price']) || 0,
                change: parseFloat(quote['09. change']) || 0,
                changePercent: parseFloat(quote['10. change percent']) || 0
              };
            }
            return stock;
          } catch (err) {
            console.error(`Error fetching ${stock.symbol}:`, err);
            return stock;
          }
        })
      );
 
      setStocks(updatedStocks);
    } catch (err) {
      setError('Failed to fetch stock data. Using mock data.');
      setStocks([
        { symbol: 'AAPL', name: 'Apple Inc.', price: 192.53, change: 2.14, changePercent: 1.12 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 428.05, change: 5.20, changePercent: 1.23 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.80, change: -1.25, changePercent: -0.88 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 198.40, change: 3.45, changePercent: 1.77 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.29, change: 12.50, changePercent: 1.45 }
      ]);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>📈 Market Tracker</h1>
            <p style={styles.subtitle}>Top 5 Tech Stocks at a Glance</p>
          </div>
          <button style={styles.refreshBtn} onClick={fetchStockData} disabled={loading}>
            {loading ? '🔄 Updating...' : '🔄 Refresh'}
          </button>
        </div>
      </header>
 
      <main style={styles.main}>
        {error && <div style={styles.errorAlert}>{error}</div>}
 
        {loading && stocks.some(s => s.price === 0) ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading stock data...</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {stocks.map((stock) => (
              <div key={stock.symbol} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.symbol}>{stock.symbol}</h3>
                    <p style={styles.companyName}>{stock.name}</p>
                  </div>
                  <div style={{
                    ...styles.badge,
                    backgroundColor: stock.changePercent >= 0 ? '#10b981' : '#ef4444',
                    color: '#fff'
                  }}>
                    {stock.changePercent >= 0 ? '📈' : '📉'}
                  </div>
                </div>
 
                <div style={styles.priceSection}>
                  <div style={styles.price}>
                    ${stock.price.toFixed(2)}
                  </div>
                  <div style={{
                    ...styles.change,
                    color: stock.changePercent >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                    <span style={styles.percent}>
                      ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
 
                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${Math.min(Math.abs(stock.changePercent) * 10, 100)}%`,
                    backgroundColor: stock.changePercent >= 0 ? '#10b981' : '#ef4444'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
 
      <footer style={styles.footer}>
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
        <p style={styles.apiNote}>Data from Alpha Vantage API • Refresh every 5 minutes</p>
      </footer>
    </div>
  );
}
 
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    color: '#e2e8f0',
    fontFamily: '"Segoe UI", Trebuchet MS, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
 
  header: {
    background: 'rgba(15, 23, 42, 0.5)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
  },
 
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
 
  titleSection: {
    flex: 1,
  },
 
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
 
  subtitle: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    margin: '0',
  },
 
  refreshBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0ea5e9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
 
  main: {
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '2rem',
  },
 
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
 
  card: {
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
 
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    paddingBottom: '1rem',
  },
 
  symbol: {
    fontSize: '1.25rem',
    fontWeight: '700',
    margin: '0',
    color: '#e2e8f0',
  },
 
  companyName: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    margin: '0.25rem 0 0 0',
  },
 
  badge: {
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    fontSize: '1.25rem',
    fontWeight: '600',
  },
 
  priceSection: {
    marginBottom: '1.5rem',
  },
 
  price: {
    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
    fontWeight: '700',
    color: '#e2e8f0',
    margin: '0 0 0.5rem 0',
  },
 
  change: {
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
 
  percent: {
    fontSize: '0.85rem',
    opacity: 0.8,
  },
 
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
 
  progressFill: {
    height: '100%',
    transition: 'width 0.5s ease',
  },
 
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '1rem',
  },
 
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(148, 163, 184, 0.2)',
    borderTop: '3px solid #0ea5e9',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
 
  loadingText: {
    color: '#94a3b8',
    fontSize: '1rem',
  },
 
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
  },
 
  footer: {
    background: 'rgba(15, 23, 42, 0.5)',
    borderTop: '1px solid rgba(148, 163, 184, 0.1)',
    padding: '1.5rem 2rem',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
 
  apiNote: {
    margin: '0.5rem 0 0 0',
    fontSize: '0.85rem',
    opacity: 0.7,
  },
};
 
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  div[style*="grid"] > div:hover {
    transform: translateY(-4px);
    border-color: rgba(14, 165, 233, 0.4);
    box-shadow: 0 20px 40px rgba(14, 165, 233, 0.1);
  }
  
  @media (max-width: 640px) {
    header { padding: 1.5rem 1rem; }
    main { padding: 1.5rem 1rem; }
    footer { padding: 1rem; }
  }
`;
if (typeof window !== 'undefined') {
  document.head.appendChild(styleSheet);
}

