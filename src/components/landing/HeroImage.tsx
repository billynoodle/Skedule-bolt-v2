import React from 'react';

export function HeroImage() {
  return (
    <div className="relative mt-16 aspect-[4/3] max-w-3xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-2xl" />
      <img
        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80"
        alt="Construction plans review"
        className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-2xl" />
    </div>
  );
}