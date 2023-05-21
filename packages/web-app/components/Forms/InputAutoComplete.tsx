import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import { FaTimes, FaSearch, FaLayerGroup } from "react-icons/fa";
import { SubCategories } from "../../utils/classes/SubCategories";
import { useRouter } from "next/router";
import ShipIcon from "common/assets/svg/default-item-icon.svg"
import theme from "common/theme";
import { usePreviousSearch } from "common/hooks/usePreviousSearch";
import { useGlobalUserLocation } from "common/hooks/useGlobalUserLocation";

type AutoCompleteProps = {
  onSelect: (value: any, isSelection?: boolean, searchKey?: boolean) => void;
  onValueChange: (query: string) => void
  onFocusData: (value: boolean) => void;
  name: string;
  value: any;
  placeholder?: string;
  suggestions: any;
};

export function InputAutoComplete({
  onSelect,
  onFocusData,
  onValueChange,
  name,
  value,
  placeholder,
  suggestions,
}: AutoCompleteProps) {
  // const onFocusDataValues = onFocusData ? onFocusData : [];
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState(value ? value : "");
  const router = useRouter();
  const previousSearch = usePreviousSearch()

  useEffect(() => {
    if (typeof value === 'object') {
      setInput(value.title)
    } else {
      setInput(value)
    }

  }, [value])


  const onChange = (e: any) => {
    const userInput = e.target.value;
    onValueChange(e.target.value);
    setInput(e.target.value);
    onSelect(e.target.value, false);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };
  const onSuggestionClick = (suggestion: any, group: any) => {
    if (group !== 'suggested') {
      setInput(suggestion.title);
      router.push(`location/${suggestion.id}`);
    } else {
      onSelect(suggestion, true);
      setFilteredSuggestions([]);
      setInput(suggestion.title);
      setActiveSuggestionIndex(0);
    }

    setShowSuggestions(false);
  };

  const onClear = () => {
    setInput("");
    onSelect(null);
  };

  const onFocusInput = (s: boolean, e?: any) => {
    onFocusData(s)
    setShowSuggestions(s)
  };

  const _handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSelect(e.target.value, false, true);
    }
  }

  const SuggestionsList = () => {
    if (suggestions?.length > 0) {
      // let limitSuggestions = filteredSuggestions;
      // if (filteredSuggestions.length > 6) {
      //   limitSuggestions = filteredSuggestions.slice(0, 5);
      // }
      return (
        <ul className="suggestions" data-testid="suggestions-list">
          {suggestions.map((suggestion: any, index: number) => {
            return <div key={index}>
              <span className="suggestionGroup">{suggestion.title}</span>
              {suggestion.data.map((sugChildren: any, index: number) => {
                return (
                  <li
                    className={"suggestion"}
                    onMouseDown={(e) => e.preventDefault()}
                    key={index}
                    onClick={() => onSuggestionClick(sugChildren, suggestion.id)}
                  >
                    <div className="dropDownContainer">
                      {(suggestion.id === 'nearby' && sugChildren.leftIcon === 'ship') && <div className="iconDropdown"><ShipIcon style={{ width: 90 * .4, height: 40 * .4 }} /></div>}
                      {(suggestion.id === 'suggested') && <div className="iconDropdown"><FaLayerGroup style={{ color: `${theme.colors.brandGray}`, width: 90 * .4, height: 40 * .4 }} /></div>}
                      <div>{sugChildren.title}</div>
                    </div>

                  </li>
                );
              })}
            </div>
          })}

          <style jsx>{`
            .no-suggestions {
              color: #999;
              padding: 0.5rem;
            }
            .suggestionGroup{
              display:block;
              font-size: 12px;
              margin-bottom: 10px;
              margin-top: 10px;
              margin-left: 10px;
            }
            .suggestions {
              border: 1px solid #999;
              border-top-width: 0;
              list-style: none;
              margin-top: -10px;
              box-sizing: initial;
              max-height: 300px;
              font-size: 18px;
              padding-left: 0;
              width: 100%;
              z-index: 5;
              position: absolute;
              background-color: white;
              overflow-y:auto;
            }
            .suggestions li {
              padding: 0.5rem;
            }
            .suggestions li:hover {
              cursor: pointer;
            }
            .dropDownContainer{
              display: flex;
              flex-direction: row;
              align-items: center;
            }
            .iconDropdown{
              padding-right: 5px;
            }
          `}</style>
        </ul>
      );
    }
  };

  return (
    <div className="autoCompleteContent" style={{ position: 'relative' }}>
      <Input
        id="autoCompleteInput"
        data-testid="input-autocomplete"
        type="text"
        name={name}
        onFocus={onFocusInput}
        icon={<FaSearch style={{
          color: `${theme.colors.brandBlue}`,
        }} />}
        // icon={input && input !== "" ? <FaTimes /> : null}
        onChange={onChange}
        onIconPress={() => {
          if (previousSearch.prevSearch) {
            if (previousSearch.prevSearch.id) {
              const id = previousSearch.prevSearch.id;
              const title = input;
              onSelect({ id, title }, true)
            }
            else {
              onSelect(input, false, true)
            }
          }
          else {
            onSelect(input, false, true)
          }
        }}
        onKeyDown={_handleKeyDown}
        value={input}
        placeholder={placeholder}
      />
      {showSuggestions && SuggestionsList()}
    </div>
  );
}
