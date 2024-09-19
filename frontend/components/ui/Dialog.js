// components/ui/Dialog.js
import React, { useState } from 'react';

export const DialogContent = ({ children }) => {
  return <div className="p-6 bg-white rounded-md shadow-lg">{children}</div>;
};

export const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle = ({ children }) => {
  return <h2 className="text-xl font-bold">{children}</h2>;
};

export const DialogTrigger = ({ children, onClick }) => {
  return <button onClick={onClick} className="text-blue-600">{children}</button>;
};

export const Dialog = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = useState(open);

  const toggleDialog = () => {
    setIsOpen(!isOpen);
    onOpenChange && onOpenChange(!isOpen);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative bg-white rounded-lg overflow-hidden shadow-xl">
            <DialogContent>
              {children}
            </DialogContent>
          </div>
        </div>
      )}
    </>
  );
};
