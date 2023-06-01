import React, { useState } from 'react';
import { Button, TextField, InputAdornment, FormControl, FormControlLabel, RadioGroup, Radio, Select, MenuItem, Slider, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const categories = [
  "IT / Software Development",
  "Design / Creative",
  "Architecture / Building / Construction",
  "Engineering / Electronics",
  "Accounting / Finance",
  "Education / Training",
  "Automotive"
];

const FilterBox = ({ onFilterChange = () => {} }) => {
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [salaryRange, setSalaryRange] = useState([0, 100000]);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleApplyFilters = () => {
    onFilterChange({ type, location, category, salaryRange });
  };

  const handleClearFilters = () => {
    setType('');
    setLocation('');
    setCategory('');
    setSalaryRange([0, 100000]);
    onFilterChange({ type: '', location: '', category: '', salaryRange: [0, 100000] });
  };

  return (
    <div style={{ 
      width: '100%', 
      marginBottom: '20px', 
      background: 'white', 
      borderRadius: '15px', 
      padding: '20px', 
      boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)', // Add box-shadow
      border: 'none' // Remove border
    }}>
      <Typography variant="h6" gutterBottom>
        Filter
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup value={type} onChange={handleChange(setType)}>
          <FormControlLabel value="On Site" control={<Radio />} label="On Site" />
          <FormControlLabel value="Remote" control={<Radio />} label="Remote" />
          <FormControlLabel value="Hybrid" control={<Radio />} label="Hybrid" />
        </RadioGroup>
      </FormControl>
      <TextField 
        label="Location" 
        value={location} 
        onChange={handleChange(setLocation)} 
        style={{ marginTop: '20px', width: '100%' }} 
        placeholder="Search by location"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Select 
        value={category} 
        onChange={handleChange(setCategory)} 
        style={{ marginTop: '20px', width: '100%' }}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Choose category
        </MenuItem>
        {categories.map(cat => (
          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
      </Select>
      <Typography id="range-slider" gutterBottom style={{ marginTop: '20px' }}>
        Salary Range
      </Typography>
      <Slider
        value={salaryRange}
        onChange={(_, newValue) => setSalaryRange(newValue)}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        min={0}
        max={100000}
        style={{ marginTop: '10px' }}
      />
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px', marginTop: '20px'}}>
        <Button variant="contained" style={{ backgroundColor: '#4CAF50', color: 'white' }} color="primary" onClick={handleApplyFilters}>Apply Filters</Button>
        <Button variant="contained" style={{ backgroundColor: '#D9D9D9', color: '#878787' }} color="error" onClick={handleClearFilters}>Clear Filters</Button>
      </div>
    </div>
  );
};

export default FilterBox;
