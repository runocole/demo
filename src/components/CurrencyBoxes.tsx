// components/CurrencyBoxes.tsx
import React from 'react';
import type { CurrencyType } from '../types/currency';

interface CurrencyBoxesProps {
  currentCurrency: CurrencyType;
  exchangeRate: number;
  onCurrencyChange: (currency: CurrencyType) => void;
}

const CurrencyBoxes: React.FC<CurrencyBoxesProps> = ({
  currentCurrency,
  exchangeRate,
  onCurrencyChange
}) => {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    right: '0px',
    transform: 'translateY(-50%)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'auto'
  };

  const boxStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px 0 0 12px',
    padding: '20px 25px 20px 20px',
    boxShadow: '-5px 5px 20px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e1e5e9',
    borderRight: 'none',
    minWidth: '180px',
    textAlign: 'left',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    marginRight: '0px'
  };

  const rateBoxStyle: React.CSSProperties = {
    ...boxStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  };

  const selectorBoxStyle: React.CSSProperties = {
    ...boxStyle,
    background: 'rgba(255, 255, 255, 0.98)',
    color: '#333'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '2px solid #ddd',
    background: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85em',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    minWidth: '70px',
    margin: '2px'
  };

  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: '#667eea',
    color: 'white',
    borderColor: '#667eea'
  };

  return (
    <div style={containerStyle}>
      {/* Exchange Rate Box */}
      <div style={rateBoxStyle}>
        <div style={{ 
          fontSize: '0.85em', 
          fontWeight: 600, 
          marginBottom: '10px', 
          opacity: 0.9,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          💱 Live Rate
        </div>
        <div style={{ 
          fontSize: '1.1em', 
          fontWeight: 'bold', 
          margin: '8px 0',
          lineHeight: '1.3'
        }}>
          1 USD = {exchangeRate.toLocaleString()} NGN
        </div>
        <div style={{ 
          fontSize: '0.75em', 
          opacity: 0.8, 
          marginTop: '6px' 
        }}>
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Currency Selector Box */}
      <div style={selectorBoxStyle}>
        <div style={{ 
          fontSize: '0.85em', 
          fontWeight: 600, 
          marginBottom: '10px', 
          opacity: 0.9,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Currency
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          flexDirection: 'column'
        }}>
          <button
            style={currentCurrency === 'USD' ? activeButtonStyle : buttonStyle}
            onClick={() => onCurrencyChange('USD')}
          >
            USD ($)
          </button>
          <button
            style={currentCurrency === 'NGN' ? activeButtonStyle : buttonStyle}
            onClick={() => onCurrencyChange('NGN')}
          >
            NGN (₦)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyBoxes;