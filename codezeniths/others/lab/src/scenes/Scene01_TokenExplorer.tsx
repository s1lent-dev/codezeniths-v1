import { useState } from 'react';
import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import { TokenSwatch } from '../components/common/TokenSwatch.tsx';
import { ROLE_TOKENS } from '../lib/tokens.ts';
import { Search } from 'lucide-react';

export function Scene01_TokenExplorer() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'background', 'surface', 'ink', 'line', 'glass', 'scrim'];

  const filteredTokens = ROLE_TOKENS.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.utility.toLowerCase().includes(search.toLowerCase()) ||
      token.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || token.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section>
      <SceneHeader
        number={1}
        title="Token Explorer"
        purpose="Complete catalogue of every atomic color role in globals.css with live swatch previews, utility names, and exact OKLCH coordinates."
        tokens={[
          '--background-*',
          '--surface-*',
          '--ink-*',
          '--line-*',
          '--glass-*',
          '--glow-*',
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-8 p-4 rounded-xl bg-surface border border-line">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-on font-semibold'
                  : 'bg-surface-chip text-ink-base hover:bg-surface-chip-hover border border-line-subtle'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tokens, utilities..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg text-xs bg-surface-input text-ink-base placeholder:text-ink-subtle border border-line-strong hover:border-line-hover focus:border-primary focus:outline-none focus:ring-1 focus:ring-focus"
          />
        </div>
      </div>

      {/* Swatch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTokens.map((token) => (
          <TokenSwatch key={token.name} token={token} isDark={false} />
        ))}
      </div>

      {filteredTokens.length === 0 && (
        <div className="text-center py-12 rounded-xl bg-surface border border-line">
          <p className="text-sm text-ink-muted">No tokens matched your search query.</p>
        </div>
      )}
    </section>
  );
}
