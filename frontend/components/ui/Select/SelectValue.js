import React from 'react';

const SelectValue = ({ value, placeholder }) => {
  return (
    <div className="select-value">
      {value ? value : placeholder}
    </div>
  );
};

export default SelectValue;