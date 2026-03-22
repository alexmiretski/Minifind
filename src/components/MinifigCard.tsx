import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Info, Star, FolderPlus, DollarSign, Trash2, Layers, TrendingUp, TrendingDown, Heart } from 'lucide-react';
import { Minifigure, Folder } from '../types';

interface Props {
  minifig: Minifigure;
  isOwned: boolean;
  isWishlisted?: boolean;
  onToggleOwned: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  onSelect: (minifig: Minifigure) => void;
  folders: Folder[];
  onAddToFolder: (folderId: string, minifigId: string) => void;
  onRemoveFromFolder?: (folderId: string, minifigId: string) => void;
  currentFolderId?: string;
}

export const MinifigCard: React.FC<Props> = ({ 
  minifig, 
  isOwned, 
  isWishlisted,
  onToggleOwned, 
  onToggleWishlist,
  onSelect, 
  folders, 
  onAddToFolder,
  onRemoveFromFolder,
  currentFolderId
}) => {
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [imgSrc, setImgSrc] = useState(minifig.imageUrl);
  const [fallbackCount, setFallbackCount] = useState(0);

  // Sync imgSrc when minifig.imageUrl changes
  React.useEffect(() => {
    setImgSrc(minifig.imageUrl);
    setFallbackCount(0);
  }, [minifig.imageUrl]);

  const handleImageError = () => {
    if (fallbackCount === 0) {
      // Try PNG version of Brickset
      if (imgSrc?.includes('.jpg')) {
        setImgSrc(imgSrc.replace('.jpg', '.png'));
      } else if (imgSrc?.includes('.png')) {
        setImgSrc(imgSrc.replace('.png', '.jpg'));
      } else {
        setImgSrc(`https://images.brickset.com/minifigs/large/${minifig.id}.jpg`);
      }
      setFallbackCount(1);
    } else if (fallbackCount === 1) {
      // Try Brickset PNG if we tried JPG
      if (imgSrc?.includes('.jpg')) {
        setImgSrc(`https://images.brickset.com/minifigs/large/${minifig.id}.png`);
      } else {
        setImgSrc(`https://img.bricklink.com/ItemImage/MN/0/${minifig.id}.png`);
      }
      setFallbackCount(2);
    } else if (fallbackCount === 2) {
      // Try BrickLink fallback
      setImgSrc(`https://img.bricklink.com/ItemImage/MN/0/${minifig.id}.png`);
      setFallbackCount(3);
    } else if (fallbackCount === 3) {
      // Try another BrickLink variant
      setImgSrc(`https://img.bricklink.com/ItemImage/MN/0/${minifig.id.toLowerCase()}.png`);
      setFallbackCount(4);
    } else {
      setImgSrc(null);
    }
  };

  const rarityColors = {
    'Common': 'bg-white text-zinc-600 border border-zinc-200',
    'Uncommon': 'bg-blue-50 text-blue-600',
    'Rare': 'bg-purple-50 text-purple-600',
    'Ultra Rare': 'bg-amber-50 text-amber-600 border border-amber-200'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${
        isOwned ? 'ring-2 ring-emerald-500 ring-offset-2' : 'hover:border-zinc-300'
      }`}
    >
      {/* Rarity Tag (Top Left) */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${rarityColors[minifig.rarity]}`}>
          {minifig.rarity}
        </span>
      </div>

      {/* Price Tag (Top Right) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-zinc-900/90 backdrop-blur-sm text-white flex items-center gap-1 shadow-md">
          <DollarSign size={10} />
          {minifig.marketPrice.toFixed(2)}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black flex items-center gap-0.5 shadow-sm backdrop-blur-sm ${
          minifig.priceChange >= 0 ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
        }`}>
          {minifig.priceChange >= 0 ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
          {Math.abs(minifig.priceChange).toFixed(1)}%
        </span>
      </div>

      {/* Wishlist Button (Top Right, below price) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist?.(minifig.id);
        }}
        className={`absolute top-16 right-3 z-10 p-2 rounded-full shadow-md transition-all ${
          isWishlisted 
            ? 'bg-rose-500 text-white' 
            : 'bg-white/80 backdrop-blur-sm text-zinc-400 hover:text-rose-500'
        }`}
      >
        <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Image Container */}
      <div 
        className="aspect-square bg-white flex items-center justify-center pt-12 pb-8 px-8 cursor-pointer overflow-hidden relative"
        onClick={() => onSelect(minifig)}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        {imgSrc ? (
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={imgSrc}
            onError={handleImageError}
            alt={minifig.name}
            className="w-full h-full object-contain relative z-10"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-300 gap-2">
            <div className="w-20 h-20 bg-zinc-100 rounded-full border-4 border-zinc-200 flex items-center justify-center relative">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-zinc-200 rounded-full" />
              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-zinc-200 rounded-full" />
              <div className="absolute bottom-1/4 w-8 h-1 bg-zinc-200 rounded-full" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Image Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-zinc-900 leading-tight group-hover:text-emerald-600 transition-colors">
            {minifig.name}
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-zinc-400">#{minifig.id}</span>
            <span className="text-[8px] font-black text-amber-500 uppercase tracking-tighter">Source: Brickset</span>
          </div>
        </div>
        
        <p className="text-xs text-zinc-500 mb-3 line-clamp-1">
          {minifig.theme} • {minifig.series}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <Layers size={12} className="text-zinc-300" />
            <span>{minifig.partsCount} Parts</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-200" />
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            {minifig.year}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => onToggleOwned(minifig.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
                isOwned 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {isOwned ? <Check size={14} /> : <Star size={14} />}
              {isOwned ? 'Owned' : 'Not Owned'}
            </button>
            
            <button
              onClick={() => onSelect(minifig)}
              className="p-2 rounded-xl bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              <Info size={16} />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFolderMenu(!showFolderMenu)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold transition-all"
            >
              <FolderPlus size={14} />
              Add to Folder
            </button>

            {showFolderMenu && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-zinc-200 rounded-xl shadow-xl z-20 overflow-hidden">
                <div className="p-2 max-h-40 overflow-y-auto">
                  {folders.length === 0 && (
                    <p className="text-[10px] text-zinc-400 text-center py-2">No folders yet</p>
                  )}
                  {folders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => {
                        onAddToFolder(folder.id, minifig.id);
                        setShowFolderMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold hover:bg-zinc-50 transition-colors flex justify-between items-center"
                    >
                      {folder.name}
                      {folder.minifigIds.includes(minifig.id) && <Check size={10} className="text-emerald-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {currentFolderId && onRemoveFromFolder && (
            <button
              onClick={() => onRemoveFromFolder(currentFolderId, minifig.id)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-all"
            >
              <Trash2 size={14} />
              Remove from Folder
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
