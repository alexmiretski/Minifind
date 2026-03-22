export interface Minifigure {
  id: string;
  name: string;
  series: string;
  theme: string;
  year: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';
  imageUrl: string;
  tags: string[];
  description: string;
  setNumber?: string;
  marketPrice: number;
  partsCount: number;
  priceChange: number;
  verification?: string;
}

export interface Folder {
  id: string;
  name: string;
  minifigIds: string[];
  createdAt: number;
}

export type FilterState = {
  search: string;
  theme: string;
  series: string;
  rarity: string;
  maxPrice: number;
  ownedOnly: boolean;
};
