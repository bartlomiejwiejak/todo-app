import React from "react"
import { InputAdornment, TextField } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"

interface Props {
  value: string
  onChange: (value: string) => void
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <TextField
      label="Search Todo"
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  )
}

export default SearchBar
