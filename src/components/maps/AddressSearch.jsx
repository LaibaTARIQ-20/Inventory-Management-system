// src/components/maps/AddressSearch.jsx
// OPTIONAL: Google Places Autocomplete for address search

import { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { TextField, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Address Search Component (OPTIONAL)
 * Uses Google Places Autocomplete to search addresses
 *
 * @param {Function} onPlaceSelect - Called when place is selected
 * @param {string} placeholder - Input placeholder text
 */
const AddressSearch = ({
  onPlaceSelect,
  placeholder = "Search address...",
}) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || "",
          name: place.name || "",
        };

        setSearchValue(place.formatted_address || "");

        if (onPlaceSelect) {
          onPlaceSelect(location);
        }
      }
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <TextField
          fullWidth
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />
      </Autocomplete>
    </Box>
  );
};

export default AddressSearch;
