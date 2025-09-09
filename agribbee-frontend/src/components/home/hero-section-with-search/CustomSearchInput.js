import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InputAdornment, NoSsr, useTheme } from "@mui/material";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../custom-search/CustomSearch.style";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "use-debounce";
const CustomSearch = ({
  handleSearchResult,
  selectedValue,
  handleFocus,
  query,
  setFocused,
  setInputValue,
  placeholder,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce(value, 400);
  let languageDirection = undefined;
  if (typeof window !== "undefined") {
    languageDirection = localStorage.getItem("direction");
  }
  useEffect(() => {
    if (query) {
      setValue(query);
    } else {
      setValue("");
    }
  }, [query]);

  useEffect(() => {
    setInputValue(debouncedValue);
  }, [debouncedValue]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchResult(e.target.value);
      e.preventDefault();
      setFocused(false);
      setInputValue("");
    }
  };
  const handleChange = (value) => {
    if (value === "") {
      handleSearchResult("");
      //setFocused(false)
    }
    setValue(value);
    handleFocus();
  };
  const clearValue = () => {
    setValue("");
    setInputValue("");
  };

  return (
    <CustomStackFullWidth>
      <form onSubmit={handleKeyPress}>
        <Search>
          <NoSsr>
            <StyledInputBase
              onFocus={handleFocus}
              backgroundColor={theme.palette.neutral[100]}
              placeholder={placeholder}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              inputProps={{ "aria-label": "search" }}
              onKeyPress={(e) => handleKeyPress(e)}
              languageDirection={languageDirection}
              endAdornment={
                // Add startAdornment here
                <InputAdornment
                  position="end"
                  sx={{
                    marginInlineStart: "10px",
                    cursor: "pointer",
                    marginInlineEnd: "10px",
                  }}
                  // Add your content for the startAdornment here
                >
                  <SearchIcon fontSize="medium" />
                </InputAdornment>
              }
              startAdornment={
                value !== "" ? (
                  <InputAdornment
                    position="start"
                    onClick={() => clearValue()}
                    sx={{
                      marginInlineStart: "10px",
                      cursor: "pointer",
                      marginInlineEnd: "10px",
                    }}
                  >
                    <CloseIcon
                      fontSize="medium"
                      sx={{
                        borderRadius: "50%",
                        p: "3px",
                        backgroundColor: (theme) => theme.palette.neutral[400],
                        color: (theme) => theme.palette.whiteContainer.main,
                        fontWeight: "bold",
                      }}
                    />
                  </InputAdornment>
                ) : null
              }
            />
          </NoSsr>
          <SearchIconWrapper languageDirection={languageDirection}>
            <SearchIcon fontSize="medium" style={{ color: "white" }} />
          </SearchIconWrapper>
        </Search>
      </form>
    </CustomStackFullWidth>
  );
};

CustomSearch.propTypes = {};

export default CustomSearch;
