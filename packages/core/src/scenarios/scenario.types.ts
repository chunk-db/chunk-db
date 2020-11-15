import { ChunkStorage } from '../ChunkStorage';
import { Accessor } from '../accessor';
import { ICollectionTypes, UUID } from '../common.types';
import { Refs, Space } from '../space';

export interface ScenarioAction {
    action: (...args: any[]) => any;
    args: any[];
}

export type Scenario<T, ARGS extends any[]> = (...args: ARGS) => Generator<any, T, unknown>;

export interface ScenarioContext<RECORDS extends ICollectionTypes>  {
    storage: ChunkStorage;
    activeTransactions: Accessor<RECORDS>[];
    updateSpaceRefs(spaceID: UUID, refs: Refs<RECORDS>): void;
    spaces: ReadonlyMap<UUID, Space>;
}

const callSymbol = Symbol('Call');

export function call<ARGS extends any[], T extends any>(action: (this: ScenarioContext<any>, ...args: ARGS) => Promise<T>, ...args: ARGS) {
    return { [callSymbol]: true, action, args };
}

export function isCall(value: any): value is ScenarioAction {
    return value && !!value[callSymbol];
}

export async function getStorage(this: ScenarioContext<any>): Promise<ChunkStorage> {
    return this.storage;
}
