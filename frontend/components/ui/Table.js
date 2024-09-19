// components/ui/Table.js
import React from 'react';

export const Table = ({ children }) => {
  return <table className="min-w-full bg-white">{children}</table>;
};

export const TableBody = ({ children }) => {
  return <tbody className="divide-y divide-gray-200">{children}</tbody>;
};

export const TableCell = ({ children }) => {
  return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{children}</td>;
};

export const TableHead = ({ children }) => {
  return <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>;
};

export const TableHeader = ({ children }) => {
  return <thead className="bg-gray-50">{children}</thead>;
};

export const TableRow = ({ children }) => {
  return <tr className="bg-white hover:bg-gray-100">{children}</tr>;
};
