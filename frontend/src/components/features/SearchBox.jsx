import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <Search 
        size={16} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] group-focus-within:text-[var(--accent)] transition-colors"
      />
      <input
        type="text"
        placeholder="Search verses or poets..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-[var(--bg-elev)] border border-[var(--line)] rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink)]"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
