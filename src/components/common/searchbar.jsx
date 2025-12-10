// src/components/common/SearchBar.jsx

import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Reusable Search Bar Component
 *
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.fullWidth - Full width (default: false)
 * @param {Object} props.sx - Additional styles
 */
const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  fullWidth = false,
  sx = {},
  ...otherProps
}) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size="small"
      sx={{ minWidth: 300, ...sx }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      {...otherProps}
    />
  );
};

export default SearchBar;
