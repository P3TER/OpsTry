import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', ...props }) => {
  const className = `btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${props.className}`;

  return (
    <button className={className} onClick={onClick} {...props}>
      {children}
    </button>
  );
};