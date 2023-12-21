import React, { useEffect, useState } from 'react';
import { InputBase } from '@mui/material';

const VortexVoucherSearchBar = ({ onInput = () => {} }) => {
  const [input, setInput] = useState('');

  const delay = (function (callback, ms) {
    let timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  useEffect(() => {
    const timeout = setTimeout(() => {
      onInput(input);
    }, 500);
    return () => clearTimeout(timeout);
  }, [input]);

  const searchAfterDelay = (e) => {
    setInput(e.target.value);
    delay(() => {
      // search here
      onInput(e.target.value);
    }, 1000);
  };

  return (
    <div
      style={{
        margin: '1em',
      }}
    >
      <div className="heading-search-container">
        <div className="heading-search-shape" style={{ display: 'flex' }}>
          <InputBase
            disabled={false}
            style={{
              width: '100%',
              fontFamily: 'montserrat',
              fontSize: '1em',
              fontWeight: '500',
              color: '#6b6b6b',
              paddingLeft: '0.3em',
              zIndex: 999,
            }}
            placeholder="Search for products here"
            onInput={searchAfterDelay}
            value={input}
          />
          {input?.length > 0 && (
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'grey',
                fontWeight: 'bold',
              }}
              onClick={() => {
                setInput('');
                onInput('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setInput('');
                  onInput('');
                }
              }}
            >
              X
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VortexVoucherSearchBar;
