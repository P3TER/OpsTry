// components/ui/Select.js
import React, { useState } from 'react';

export const SelectContent = ({ children }) => {
  return <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">{children}</div>;
};

export const SelectItem = ({ value, children, onClick }) => {
  return (
    <div
      className="cursor-pointer hover:bg-gray-200 px-4 py-2"
      onClick={() => onClick(value)}
    >
      {children}
    </div>
  );
};

export const SelectTrigger = ({ children, onClick }) => {
  return (
    <div className="border border-gray-300 rounded-md px-4 py-2 cursor-pointer" onClick={onClick}>
      {children}
    </div>
  );
};

export const SelectValue = ({ value, placeholder }) => {
  return (
    <div className="text-gray-700">
      {value || placeholder}
    </div>
  );
};

export const Select = ({ value, onValueChange, placeholder, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSelect = (newValue) => {
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <SelectTrigger onClick={toggleOpen}>
        <SelectValue value={value} placeholder={placeholder} />
      </SelectTrigger>
      {isOpen && <SelectContent>{React.Children.map(children, (child) => React.cloneElement(child, { onClick: handleSelect }))}</SelectContent>}
    </div>
  );
};
