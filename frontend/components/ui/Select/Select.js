import React, { useState } from 'react';
import SelectTrigger from './SelectTrigger';
import SelectValue from './SelectValue';

const Select = ({ name, value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (newValue) => {
    onValueChange(newValue);
  };

  return (
    <div className="select">
      <SelectTrigger>
        <SelectValue value={value} />
      </SelectTrigger>
      {isOpen && (
        <SelectContent>
          {children}
        </SelectContent>
      )}
    </div>
  );
};

export default Select;