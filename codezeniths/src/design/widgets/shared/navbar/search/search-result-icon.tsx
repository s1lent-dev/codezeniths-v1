'use client';

import React, { useState } from 'react';
import { Code, Layers, Box, Tag, ShoppingBag, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@codezeniths/components';

interface SearchResultIconProps {
  collection: string;
  doc: any;
}

export const SearchResultIcon: React.FC<SearchResultIconProps> = ({ collection, doc }) => {
  const [imageError, setImageError] = useState(false);

  const slug = (doc.slug || doc.id || '').toString().toLowerCase().trim();

  if (collection === 'user' || collection === 'users') {
    const initials = (doc.name || doc.username || 'U')
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return (
      <Avatar className="w-10 h-10 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade3 shrink-0 overflow-hidden">
        {doc.image ? (
          <AvatarImage src={doc.image} alt={doc.name || 'User Avatar'} className="w-full h-full object-cover rounded-md" />
        ) : null}
        <AvatarFallback className="bg-info/15 text-info font-bold text-xs rounded-md flex items-center justify-center">
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  }

  let assetPath = '';
  if (collection === 'module' || collection === 'modules') assetPath = `/modules/module-${slug}.svg`;
  if (collection === 'topic' || collection === 'topics') assetPath = `/topics/topic-${slug}.svg`;
  if (collection === 'tag' || collection === 'tags') assetPath = `/tags/${slug}.svg`;
  if (collection === 'product' || collection === 'products') assetPath = `/products/${slug}.svg`;

  if (assetPath && !imageError) {
    return (
      <div className="w-10 h-10 rounded-md bg-foreground-light-shade1/80 dark:bg-foreground-dark-shade1/80 flex items-center justify-center p-1.5 border border-foreground-light-shade3/70 dark:border-foreground-dark-shade3/70 shrink-0 overflow-hidden">
        <img
          src={assetPath}
          alt={doc.title || doc.name || collection}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  switch (collection) {
    case 'problem':
    case 'problems':
      return (
        <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center border border-primary/25 shrink-0">
          <Code className="w-5 h-5" />
        </div>
      );
    case 'topic':
    case 'topics':
      return (
        <div className="w-10 h-10 rounded-md bg-purple/10 text-purple flex items-center justify-center border border-purple/25 shrink-0">
          <Layers className="w-5 h-5" />
        </div>
      );
    case 'module':
    case 'modules':
      return (
        <div className="w-10 h-10 rounded-md bg-blue/10 text-blue flex items-center justify-center border border-blue/25 shrink-0">
          <Box className="w-5 h-5" />
        </div>
      );
    case 'tag':
    case 'tags':
      return (
        <div className="w-10 h-10 rounded-md bg-teal/10 text-teal flex items-center justify-center border border-teal/25 shrink-0">
          <Tag className="w-5 h-5" />
        </div>
      );
    case 'product':
    case 'products':
      return (
        <div className="w-10 h-10 rounded-md bg-azure/10 text-azure flex items-center justify-center border border-azure/25 shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-md bg-info/10 text-info flex items-center justify-center border border-info/25 shrink-0">
          <UserIcon className="w-5 h-5" />
        </div>
      );
  }
};

