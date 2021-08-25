import { createContext } from 'react';

export const ChunkDBContext = createContext<ChunkDB>(null as any);

export const ChunkDBProvider = ChunkDBContext.Provider;

