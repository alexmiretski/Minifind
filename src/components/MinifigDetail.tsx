import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Hash, Tag, Layers, ExternalLink, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Minifigure } from '../types';

interface Props {
  minifig: Minifigure | null;
  onClose: () => void;
}

export const MinifigDetail: React.FC<Props> = ({ minifig, onClose }) => {
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (minifig) setImgSrc(minifig.imageUrl);
  }, [minifig]);

  if (!minifig) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Left: Image Section */}
          <div className="md:w-1/2 bg-white pt-16 pb-8 px-8 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <img
              src={imgSrc || minifig.imageUrl}
              onError={() => setImgSrc('https://www.lego.com/cdn/cs/set-config/assets/blt8706f36829705d97/minifigure-placeholder.png')}
              alt={minifig.name}
              className="w-full h-full object-contain relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right: Content Section */}
          <div className="md:w-1/2 p-8 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  {minifig.theme}
                </span>
                <span className="text-zinc-400 text-xs font-mono">#{minifig.id}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 text-[8px] font-black uppercase tracking-widest">Brickset Data</span>
              </div>
              <h2 className="text-3xl font-black text-zinc-900 leading-tight mb-2">
                {minifig.name}
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {minifig.description}
              </p>
              {minifig.verification && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 uppercase font-black tracking-widest mb-1">AI Verification Check</p>
                  <p className="text-[11px] text-emerald-800 italic leading-tight">
                    "{minifig.verification}"
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-100">
                <Calendar size={18} className="text-zinc-400" />
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Year</p>
                  <p className="text-sm font-bold text-zinc-900">{minifig.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-100">
                <Hash size={18} className="text-zinc-400" />
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Set #</p>
                  <p className="text-sm font-bold text-zinc-900">{minifig.setNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-100">
                <Layers size={18} className="text-zinc-400" />
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Parts Count</p>
                  <p className="text-sm font-bold text-zinc-900">{minifig.partsCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-100">
                <Tag size={18} className="text-zinc-400" />
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Rarity</p>
                  <p className="text-sm font-bold text-zinc-900">{minifig.rarity}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-100">
                <DollarSign size={18} className="text-zinc-400" />
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Market Price</p>
                  <p className="text-sm font-bold text-zinc-900">${minifig.marketPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-100">
                {minifig.priceChange >= 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-red-500" />}
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">24h Change</p>
                  <p className={`text-sm font-bold ${minifig.priceChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {minifig.priceChange >= 0 ? '+' : ''}{minifig.priceChange.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex flex-wrap gap-2 mb-6">
                {minifig.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-white text-zinc-600 border border-zinc-200 text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <a
                href={`https://brickset.com/minifigs/${minifig.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors"
              >
                View on Brickset
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
