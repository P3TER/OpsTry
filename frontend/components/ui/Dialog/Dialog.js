import React, { useState } from 'react';

const Dialog = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleOpenChange = () => {
    setIsOpen(!isOpen);
    onOpenChange(!isOpen);
  };

  return (
    <div className={`dialog ${isOpen ? 'dialog-open' : ''}`}>
      <div className="dialog-content">
        {children}
      </div>
    </div>
  );
};

export default Dialog;