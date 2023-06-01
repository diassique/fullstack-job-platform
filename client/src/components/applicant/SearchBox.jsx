import React, { useState } from 'react';
import { Button, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBox = ({ onSearchChange = () => {} }) => {
  const [input, setInput] = useState('');

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSearch = () => {
    onSearchChange(input);
  };

  return (
    <div style={{ 
      width: '100%', 
      marginBottom: '20px', 
      background: 'white', 
      borderRadius: '15px', 
      padding: '20px', 
      boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)', 
      border: 'none' 
    }}>
      <TextField
        disableUnderline 
        value={input} 
        onChange={handleChange} 
        style={{ width: '100%' }} 
        placeholder="Search by Title, Company or any jobs keyword…"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
              >
                Find
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchBox;
