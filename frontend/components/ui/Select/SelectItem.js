// components/ui/SelectItem.js
import React from 'react';

const SelectItem = ({ value, children }) => {
  return (
    <div className="select-item" value={value}>
      {children}
    </div>
  );
};

export default SelectItem;