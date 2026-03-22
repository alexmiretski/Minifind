import React, { useState } from 'react';
import { Search, Filter, Folder, Plus, Trash2, DollarSign, Tag, ListFilter, ArrowUpDown } from 'lucide-react';
import { FilterState, Folder as FolderType } from '../types';
import { MinifigureHead } from './Logo';

interface Props {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  themes: string[];
  series: string[];
  folders: FolderType[];
  minifigures: any[];
  onAddFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  sortOrder: 'name' | 'price-asc' | 'price-desc' | 'year';
  onSortChange: (order: 'name' | 'price-asc' | 'price-desc' | 'year') => void;
  totalValue: number;
}

export const Sidebar: React.FC<Props> = ({ 
  filters, 
  onFilterChange, 
  themes, 
  series, 
  folders, 
  minifigures,
  onAddFolder, 
  onDeleteFolder,
  selectedFolderId,
  onSelectFolder,
  sortOrder,
  onSortChange,
  totalValue
}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [showAddFolder, setShowAddFolder] = useState(false);

  const rarities = ['Common', 'Uncommon', 'Rare', 'Ultra Rare'];

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim());
      setNewFolderName('');
      setShowAddFolder(false);
    }
  };

  return (
    <div className="w-80 flex-shrink-0 hidden lg:flex flex-col gap-6 p-6 border-r border-zinc-200 bg-white/50 backdrop-blur-sm sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-zinc-900 shadow-lg shadow-amber-200 border-2 border-zinc-900">
          <MinifigureHead className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 leading-none">Minifind</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Brick Tracker</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          type="text"
          placeholder="Search minifigures..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-100 border-transparent focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm outline-none"
        />
      </div>

      {/* Sort Order */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-zinc-400 px-1">
          <ArrowUpDown size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Sort By</span>
        </div>
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="w-full px-4 py-2 rounded-xl bg-zinc-100 border-transparent text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="name">Name</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Folders Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-zinc-400">
            <Folder size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Folders</span>
          </div>
          <button 
            onClick={() => setShowAddFolder(!showAddFolder)}
            className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {showAddFolder && (
          <form onSubmit={handleAddFolder} className="flex gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-zinc-100 text-xs outline-none border-2 border-transparent focus:border-amber-500"
            />
            <button type="submit" className="p-2 rounded-xl bg-zinc-900 text-white">
              <Plus size={14} />
            </button>
          </form>
        )}

        <div className="flex flex-col gap-1">
          <button
            onClick={() => onSelectFolder(null)}
            className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedFolderId === null ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'
            }`}
          >
            <span>All Minifigures</span>
            <span className="text-[10px] opacity-60">{minifigures.length}</span>
          </button>
          {folders.map(folder => (
            <div key={folder.id} className="group flex items-center gap-1">
              <button
                onClick={() => onSelectFolder(folder.id)}
                className={`flex-1 flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedFolderId === folder.id ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                <span className="truncate">{folder.name}</span>
                <span className="text-[10px] opacity-60">{folder.minifigIds.length}</span>
              </button>
              {folder.id !== 'my-collection' && folder.id !== 'wishlist' && (
                <button 
                  onClick={() => onDeleteFolder(folder.id)}
                  className="p-2 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-6">
        {/* Rarity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-400 px-1">
            <Tag size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Rarity</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {rarities.map(rarity => (
              <button
                key={rarity}
                onClick={() => onFilterChange({ ...filters, rarity: filters.rarity === rarity ? '' : rarity })}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                  filters.rarity === rarity 
                    ? 'bg-amber-400 text-zinc-900 shadow-lg shadow-amber-200' 
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {rarity}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-400 px-1">
            <DollarSign size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Max Price (${filters.maxPrice})</span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="50"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: parseInt(e.target.value) })}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-[10px] font-bold text-zinc-400">
            <span>$0</span>
            <span>$10,000+</span>
          </div>
        </div>

        {/* Theme Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-400 px-1">
            <ListFilter size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Theme</span>
          </div>
          <select
            value={filters.theme}
            onChange={(e) => onFilterChange({ ...filters, theme: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-zinc-100 border-transparent text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Themes</option>
            {themes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-auto pt-6 border-t border-zinc-200">
        <div className="p-4 rounded-2xl bg-zinc-900 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Total Value</p>
          <p className="text-2xl font-black">
            ${totalValue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};
