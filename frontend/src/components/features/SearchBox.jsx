import { useState, useEffect, useRef } from 'react';
import { Search, X, User, FileText, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../../api/search.api';
import { useDebounce } from '../../hooks/useDebounce';
import { InitialsAvatar } from '../layout/Sidebar';

export default function SearchBox({ syncUrl = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = syncUrl ? searchParams.get('q') || '' : '';
  const [query, setQuery] = useState(urlQuery);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (syncUrl) {
      setQuery(urlQuery);
    }
  }, [urlQuery, syncUrl]);

  const debouncedQuery = useDebounce(query.trim(), 300);

  useEffect(() => {
    if (!syncUrl || !debouncedQuery) return;
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, { replace: true });
  }, [debouncedQuery, syncUrl, setSearchParams]);

  const { data: suggestions, isFetching } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => searchApi.search({ q: debouncedQuery, limit: 5 }),
    enabled: debouncedQuery.length >= 1,
    staleTime: 30_000,
  });

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown =
    open &&
    debouncedQuery.length >= 1 &&
    (isFetching || (suggestions && (suggestions.users.length > 0 || suggestions.posts.length > 0)));

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    if (syncUrl) {
      setSearchParams({ q: trimmed });
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const goToSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setOpen(false);
    if (syncUrl) {
      setSearchParams({ q: trimmed });
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const snippet = (body, max = 60) => {
    const flat = body.replace(/\s+/g, ' ').trim();
    return flat.length > max ? `${flat.slice(0, max)}…` : flat;
  };

  return (
    <div ref={containerRef} className="relative w-full min-w-0 z-20">
      <form onSubmit={handleSubmit} className="relative group">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] group-focus-within:text-[var(--accent)] transition-colors pointer-events-none"
        />
        <input
          type="search"
          enterKeyHint="search"
          placeholder="Search poets or verses..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full min-w-0 surface-card rounded-full pl-10 pr-10 py-3 text-base outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setOpen(false);
              if (syncUrl) setSearchParams({}, { replace: true });
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--ink-faint)] hover:text-[var(--ink)] min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 mt-2 surface-card rounded-[var(--radius-lg)] overflow-hidden shadow-lg border border-[var(--line)] max-h-[min(70vh,420px)] overflow-y-auto"
          role="listbox"
        >
          {isFetching && !suggestions ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--ink-faint)]">
              <Loader2 size={16} className="animate-spin" />
              Searching…
            </div>
          ) : (
            <>
              {suggestions?.users?.length > 0 && (
                <div className="py-2">
                  <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--ink-faint)] flex items-center gap-1.5">
                    <User size={12} /> Poets
                  </p>
                  {suggestions.users.map((u) => (
                    <Link
                      key={u.id}
                      to={`/u/${u.username}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--accent-soft)] transition-colors min-h-[48px]"
                      role="option"
                    >
                      <InitialsAvatar name={u.displayName} size={32} />
                      <div className="min-w-0 text-left">
                        <p className="text-sm font-semibold text-[var(--ink)] truncate">
                          {u.displayName}
                        </p>
                        <p className="text-xs text-[var(--ink-muted)] truncate">
                          @{u.username}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {suggestions?.posts?.length > 0 && (
                <div className="py-2 border-t border-[var(--line)]">
                  <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--ink-faint)] flex items-center gap-1.5">
                    <FileText size={12} /> Verses
                  </p>
                  {suggestions.posts.map((p) => (
                    <Link
                      key={p.id}
                      to={`/post/${p.id}`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 hover:bg-[var(--accent-soft)] transition-colors min-h-[48px]"
                      role="option"
                    >
                      <p className="text-sm font-semibold text-[var(--ink)] truncate">
                        {p.title || 'Untitled verse'}
                      </p>
                      <p className="text-xs text-[var(--ink-muted)] truncate">
                        @{p.author.username} · {snippet(p.body)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {!isFetching &&
                suggestions?.users?.length === 0 &&
                suggestions?.posts?.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-[var(--ink-faint)]">
                    No suggestions found
                  </p>
                )}

              <button
                type="button"
                onClick={() => goToSearch(debouncedQuery)}
                className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--accent)] border-t border-[var(--line)] hover:bg-[var(--accent-soft)] transition-colors"
              >
                See all results for &ldquo;{debouncedQuery}&rdquo;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
