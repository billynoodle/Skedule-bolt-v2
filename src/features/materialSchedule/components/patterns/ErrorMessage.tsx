import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-center py-8">
      <p className="text-red-600">{message}</p>
    </div>
  );
}