import React, { useState, useRef } from "react";

interface MultiSelectInputProps {
  options: string[];
  placeholder: string;
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  options,
  placeholder,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null); // Ref for the input container

  const handleSelectOption = (option: string) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    }
    setInputValue("");
    setIsFocused(false);
  };

  const handleRemoveOption = (option: string) => {
    setSelectedOptions(selectedOptions.filter((o) => o !== option));
  };

  const filteredOptions = options.filter(
    (o) =>
      o.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedOptions.includes(o)
  );

  return (
    <div className="relative border p-2" ref={inputRef}>
      <div>
        {selectedOptions.map((option) => (
          <span
            key={option}
            className="inline-flex items-center bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            {option}
            <button
              onClick={() => handleRemoveOption(option)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 300)} // Delay to allow option selection before blur hides the list
        className="p-2 w-full"
      />
      {isFocused && inputValue && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleSelectOption(option)}
                className="cursor-pointer hover:bg-gray-200 p-2"
              >
                {option}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-700">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectInput;
