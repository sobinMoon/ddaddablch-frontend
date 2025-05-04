import React from 'react'
import './Donatetab.css'

export default function Donatetab({ categories, selectedCategory, onSelectCategory }) {
   return (
    <div className="tabs">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={cat === selectedCategory ? 'active-tab' : ''}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
