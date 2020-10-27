import { ChunkDB } from '../ChunkDB';
import { ChunkID } from '../common';
import { AbstractChunk } from '../chunks/AbstractChunk';
import { ScenarioContext } from './scenario.types';

export function call<ARGS extends any[], T extends any>(func: (db: ChunkDB, ...args: ARGS) => Promise<T>, ...args: ARGS) {
    return [func, ...args];
}

export function getChunk(context: ScenarioContext, chunk: ChunkID): Promise<AbstractChunk> {
    return context.storage.load(chunk);
}
