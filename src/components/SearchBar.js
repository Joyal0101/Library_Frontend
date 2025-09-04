import React, { useState, useEffect } from 'react';

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Debounce the search
    const timeoutId = setTimeout(() => {
      onChange(newValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(localValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-container">
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
        
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        
        <button
          type="submit"
          className="search-submit"
          aria-label="Search"
        >
          🔍
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
