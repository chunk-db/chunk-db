import { ChunkStorage } from '../ChunkStorage';
import { Accessor } from '../accessor';
import { ChunkID, SpaceID, UUID } from '../common.types';
import { Refs } from '../space';
import { Spaces } from '../spaces';

export interface ScenarioAction {
    action: (...args: any[]) => any;
    args: any[];
}

export type Scenario<T, ARGS extends any[]> = (...args: ARGS) => Generator<any, T, unknown>;

export interface ScenarioContext {
    storage: ChunkStorage;
    activeTransactions: Accessor[];

    updateSpaceRef(spaceID: SpaceID, ref: ChunkID): void;

    spaces: Spaces;
}

const callSymbol = Symbol('Call');

export function call<ARGS extends any[], T extends any>(action: (this: ScenarioContext, ...args: ARGS) => Promise<T>, ...args: ARGS) {
    return { [callSymbol]: true, action, args };
}

export function isCall(value: any): value is ScenarioAction {
    return value && !!value[callSymbol];
}

export async function getStorage(this: ScenarioContext): Promise<ChunkStorage> {
    return this.storage;
}
