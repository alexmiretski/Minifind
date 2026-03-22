import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Package, Search, Menu, X, Folder as FolderIcon, Loader2, Sparkles, Database } from 'lucide-react';
import { Minifigure, FilterState, Folder } from './types';
import { MinifigCard } from './components/MinifigCard';
import { MinifigDetail } from './components/MinifigDetail';
import { Sidebar } from './components/Sidebar';
import { MinifigureHead } from './components/Logo';
import { searchMinifigures } from './services/geminiService';

export default function App() {
  const [minifigures, setMinifigures] = useState<Minifigure[]>([]);
  const [ownedIds, setOwnedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('minifind_owned');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('minifind_folders');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'my-collection', name: 'My Collection', minifigIds: [], createdAt: Date.now() },
      { id: 'wishlist', name: 'Wishlist', minifigIds: [], createdAt: Date.now() + 1 }
    ];
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    theme: '',
    series: '',
    rarity: '',
    maxPrice: 10000,
    ownedOnly: false,
  });

  const [sortOrder, setSortOrder] = useState<'name' | 'price-asc' | 'price-desc' | 'year'>('name');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>('my-collection');
  const [selectedMinifig, setSelectedMinifig] = useState<Minifigure | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Initial Load Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic Search Handler with Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (filters.search.length > 2) {
        setIsSearching(true);
        // Automatically switch to "All Minifigures" view when searching globally
        setSelectedFolderId(null);
        try {
          const results = await searchMinifigures(filters.search);
          if (results && results.length > 0) {
            setMinifigures(prev => {
              const newFigs = [...prev];
              results.forEach(res => {
                if (!newFigs.find(f => f.id === res.id)) {
                  newFigs.push(res);
                }
              });
              return newFigs;
            });
          }
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [filters.search]);

  const handleGlobalSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  useEffect(() => {
    localStorage.setItem('minifind_owned', JSON.stringify(Array.from(ownedIds)));
  }, [ownedIds]);

  useEffect(() => {
    localStorage.setItem('minifind_folders', JSON.stringify(folders));
  }, [folders]);

  const themes = useMemo(() => Array.from(new Set(minifigures.map(m => m.theme))), [minifigures]);
  const series = useMemo(() => Array.from(new Set(minifigures.map(m => m.series))), [minifigures]);

  const filteredMinifigs = useMemo(() => {
    let list = minifigures;

    // Folder filter
    if (selectedFolderId) {
      const folder = folders.find(f => f.id === selectedFolderId);
      if (folder) {
        list = list.filter(m => folder.minifigIds.includes(m.id));
      }
    }

    list = list.filter(m => {
      const isOwned = ownedIds.has(m.id);
      const matchesSearch = !filters.search || 
                           m.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                           m.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                           m.tags.some(t => t.toLowerCase().includes(filters.search.toLowerCase()));
      
      // Owned items stay visible even if they don't match the search, 
      // but only if we are in "All Minifigures" or "My Collection" view
      const isMainView = !selectedFolderId || selectedFolderId === 'my-collection';
      const shouldShowBySearch = matchesSearch || (isMainView && isOwned);
      
      const matchesTheme = !filters.theme || m.theme === filters.theme;
      const matchesSeries = !filters.series || m.series === filters.series;
      const matchesRarity = !filters.rarity || m.rarity === filters.rarity;
      const matchesPrice = m.marketPrice <= filters.maxPrice;
      const matchesOwned = !filters.ownedOnly || isOwned;
      
      return shouldShowBySearch && matchesTheme && matchesSeries && matchesRarity && matchesPrice && matchesOwned;
    });

    // Sorting
    return [...list].sort((a, b) => {
      // If searching, prioritize matches
      if (filters.search) {
        const aMatches = a.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                        a.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                        a.tags.some(t => t.toLowerCase().includes(filters.search.toLowerCase()));
        const bMatches = b.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                        b.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                        b.tags.some(t => t.toLowerCase().includes(filters.search.toLowerCase()));
        
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
      }

      // Then prioritize owned items
      const aOwned = ownedIds.has(a.id);
      const bOwned = ownedIds.has(b.id);
      if (aOwned && !bOwned) return -1;
      if (!aOwned && bOwned) return 1;

      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      if (sortOrder === 'price-asc') return a.marketPrice - b.marketPrice;
      if (sortOrder === 'price-desc') return b.marketPrice - a.marketPrice;
      if (sortOrder === 'year') return b.year - a.year;
      return 0;
    });
  }, [filters, ownedIds, selectedFolderId, folders, sortOrder, minifigures]);

  const toggleOwned = (id: string) => {
    setOwnedIds(prev => {
      const next = new Set(prev);
      const isAdding = !next.has(id);
      
      if (isAdding) {
        next.add(id);
        // Automatically add to "My Collection" folder
        setFolders(current => current.map(f => {
          if (f.id === 'my-collection' && !f.minifigIds.includes(id)) {
            return { ...f, minifigIds: [...f.minifigIds, id] };
          }
          return f;
        }));
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const toggleWishlist = (id: string) => {
    setFolders(current => current.map(f => {
      if (f.id === 'wishlist') {
        const isIncluded = f.minifigIds.includes(id);
        return {
          ...f,
          minifigIds: isIncluded 
            ? f.minifigIds.filter(mid => mid !== id)
            : [...f.minifigIds, id]
        };
      }
      return f;
    }));
  };

  const addFolder = (name: string) => {
    const newFolder: Folder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      minifigIds: [],
      createdAt: Date.now()
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const deleteFolder = (id: string) => {
    if (id === 'my-collection' || id === 'wishlist') return;
    setFolders(prev => prev.filter(f => f.id !== id));
    if (selectedFolderId === id) setSelectedFolderId(null);
  };

  const addToFolder = (folderId: string, minifigId: string) => {
    setFolders(current => current.map(f => {
      if (f.id === folderId && !f.minifigIds.includes(minifigId)) {
        return { ...f, minifigIds: [...f.minifigIds, minifigId] };
      }
      return f;
    }));
  };

  const removeFromFolder = (folderId: string, minifigId: string) => {
    setFolders(current => current.map(f => {
      if (f.id === folderId) {
        return { ...f, minifigIds: f.minifigIds.filter(id => id !== minifigId) };
      }
      return f;
    }));
  };

  const { searchMatches, collectionOnly } = useMemo(() => {
    if (!filters.search) return { searchMatches: filteredMinifigs, collectionOnly: [] };
    
    const matches: Minifigure[] = [];
    const onlyCollection: Minifigure[] = [];
    
    filteredMinifigs.forEach(m => {
      const isMatch = m.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                     m.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                     m.tags.some(t => t.toLowerCase().includes(filters.search.toLowerCase()));
      
      if (isMatch) {
        matches.push(m);
      } else {
        onlyCollection.push(m);
      }
    });
    
    return { searchMatches: matches, collectionOnly: onlyCollection };
  }, [filteredMinifigs, filters.search]);

  const stats = {
    total: minifigures.length,
    owned: ownedIds.size,
    percentage: Math.round((ownedIds.size / Math.max(minifigures.length, 1)) * 100),
    value: filteredMinifigs.reduce((acc, fig) => acc + (ownedIds.has(fig.id) ? (fig.marketPrice || 0) : 0), 0)
  };

  const currentFolderName = selectedFolderId 
    ? folders.find(f => f.id === selectedFolderId)?.name 
    : 'All Minifigures';

  return (
    <div className="flex min-h-screen bg-[#F4F4F5]">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-3xl bg-amber-400 flex items-center justify-center text-zinc-900 border-4 border-zinc-900 shadow-2xl mb-6"
            >
              <MinifigureHead className="w-16 h-16" />
            </motion.div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight animate-pulse">
              Connecting to Brick Database...
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar for Desktop */}
      <Sidebar 
        filters={filters} 
        onFilterChange={setFilters} 
        themes={themes} 
        series={series}
        folders={folders}
        minifigures={minifigures}
        onAddFolder={addFolder}
        onDeleteFolder={deleteFolder}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        totalValue={filteredMinifigs.reduce((acc, m) => acc + (ownedIds.has(m.id) ? m.marketPrice : 0), 0)}
      />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-panel px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-zinc-900 border-2 border-zinc-900">
            <MinifigureHead className="w-6 h-6" />
          </div>
          <span className="font-black text-xl">Minifind</span>
        </div>
        <div className="flex items-center gap-2">
          {isSearching && <Loader2 className="animate-spin text-amber-500" size={18} />}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-100 text-zinc-600"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-30 lg:hidden bg-white p-6 pt-20 overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  placeholder="Search for ANY minifigure..."
                  value={filters.search}
                  onChange={(e) => handleGlobalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-100 outline-none font-medium"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Folders</p>
                {folders.map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFolderId(f.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border font-bold ${
                      selectedFolderId === f.id ? 'bg-amber-400 border-zinc-900' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    {f.name} ({f.minifigIds.length})
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 pt-24 lg:pt-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FolderIcon size={16} className="text-amber-500" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">{currentFolderName}</span>
            </div>
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">
              {selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name : 'The Collection'}
            </h2>
            
            <div className="relative max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search for ANY minifigure (e.g. 'Gold C-3PO', 'Boba Fett')..."
                className="w-full pl-12 pr-12 py-4 bg-white border-2 border-zinc-100 focus:border-amber-500 focus:ring-8 focus:ring-amber-500/5 rounded-2xl transition-all outline-none text-base font-bold shadow-sm"
                value={filters.search}
                onChange={(e) => handleGlobalSearch(e.target.value)}
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Loader2 className="animate-spin text-amber-500" size={20} />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest hidden sm:block">Searching Database...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 min-w-[160px] border-2 border-zinc-100">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Database size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Database Size</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-zinc-900">{stats.total}</span>
                  <span className="text-xs text-zinc-400 font-medium">Figures</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 min-w-[160px] border-2 border-zinc-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Collection Value</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-zinc-900">${stats.value.toFixed(0)}</span>
                  <span className="text-xs text-zinc-400 font-medium">{stats.owned} Owned</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Grid */}
        <div className="space-y-12">
          {filters.search && searchMatches.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-zinc-900 shadow-sm border border-amber-500/20">
                  <Search size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-zinc-900 tracking-tight">Search Results</h2>
                  <p className="text-sm text-zinc-500 font-medium">Found {searchMatches.length} matches in database</p>
                </div>
              </div>
              <div className="lego-grid">
                <AnimatePresence mode="popLayout">
                  {searchMatches.map((minifig) => (
                    <MinifigCard
                      key={minifig.id}
                      minifig={minifig}
                      isOwned={ownedIds.has(minifig.id)}
                      isWishlisted={folders.find(f => f.id === 'wishlist')?.minifigIds.includes(minifig.id)}
                      onToggleOwned={toggleOwned}
                      onToggleWishlist={toggleWishlist}
                      onSelect={setSelectedMinifig}
                      folders={folders}
                      onAddToFolder={addToFolder}
                      onRemoveFromFolder={removeFromFolder}
                      currentFolderId={selectedFolderId || undefined}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {(!filters.search || collectionOnly.length > 0) && (
            <section>
              {filters.search && collectionOnly.length > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Your Collection</h2>
                    <p className="text-sm text-zinc-500 font-medium">{collectionOnly.length} items you already own</p>
                  </div>
                </div>
              )}
              
              <div className="lego-grid">
                <AnimatePresence mode="popLayout">
                  {(filters.search ? collectionOnly : searchMatches).map((minifig) => (
                    <MinifigCard
                      key={minifig.id}
                      minifig={minifig}
                      isOwned={ownedIds.has(minifig.id)}
                      isWishlisted={folders.find(f => f.id === 'wishlist')?.minifigIds.includes(minifig.id)}
                      onToggleOwned={toggleOwned}
                      onToggleWishlist={toggleWishlist}
                      onSelect={setSelectedMinifig}
                      folders={folders}
                      onAddToFolder={addToFolder}
                      onRemoveFromFolder={removeFromFolder}
                      currentFolderId={selectedFolderId || undefined}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </div>

        {filteredMinifigs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-white border border-zinc-200 rounded-full flex items-center justify-center mb-6 text-zinc-300 shadow-sm">
              {selectedFolderId === 'my-collection' ? <FolderIcon size={48} /> : <Search size={48} />}
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-2">
              {selectedFolderId === 'my-collection' ? 'Your collection is empty' : 'Search for your collection'}
            </h3>
            <p className="text-zinc-500 max-w-sm font-medium mb-6">
              {selectedFolderId === 'my-collection' 
                ? 'Start by searching for minifigures and marking them as owned to build your collection.'
                : 'Type a theme, set number, or character name in the search bar above to find real minifigures from our database.'}
            </p>
            {(filters.search || selectedFolderId) && (
              <button 
                onClick={() => {
                  setFilters({ search: '', theme: '', series: '', rarity: '', maxPrice: 10000, ownedOnly: false });
                  setSelectedFolderId(null);
                }}
                className="px-6 py-3 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors"
              >
                {filters.search ? 'Clear Search' : 'View All Database'}
              </button>
            )}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <MinifigDetail 
        minifig={selectedMinifig} 
        onClose={() => setSelectedMinifig(null)} 
      />
    </div>
  );
}
