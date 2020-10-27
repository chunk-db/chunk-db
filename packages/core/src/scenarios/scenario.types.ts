import { ChunkStorage } from '../ChunkStorage';

export type Scenario<T, ARGS extends any[]> = (...args: ARGS) => Generator<unknown, T, unknown>;

export interface ScenarioContext {
    storage: ChunkStorage;
}
