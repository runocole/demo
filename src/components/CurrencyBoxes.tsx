import React from 'react';
import { useCurrency } from "../context/CurrencyContext"; 

const CurrencyBoxes: React.FC = () => {
  const { currentCurrency, setCurrency } = useCurrency();

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    right: '0px',
    transform: 'translateY(-50%)',
    zIndex: 2147483647,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    pointerEvents: 'auto'
  };

  const currencyButtonStyle: React.CSSProperties = {
    padding: '8px 15px',
    border: '1px solid #081748', // Fixed: removed the bracket after "solid"
    background: 'white',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    borderRadius: '8px 0 0 8px',
    color: '#333',
    minWidth: '60px',
    boxShadow: '-2px 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  };

  const activeCurrencyStyle: React.CSSProperties = {
    ...currencyButtonStyle,
    background: '#081748', // Fixed: removed the brackets
    color: 'white',
    fontWeight: '600',
    borderColor: '#081748' // Fixed: removed the brackets
  };

  return (
    <div style={containerStyle}>
      <button
        style={currentCurrency === 'USD' ? activeCurrencyStyle : currencyButtonStyle}
        onClick={() => setCurrency('USD')}
      >
        USD
      </button>
      
      <button
        style={currentCurrency === 'NGN' ? activeCurrencyStyle : currencyButtonStyle}
        onClick={() => setCurrency('NGN')}
      >
        NGN
      </button>
    </div>
  );
};

export default CurrencyBoxes;