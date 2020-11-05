import { CollectionConfig, IChunkDBConfig, ICollectionTypes } from './db.types';
import { IChunkStorageDriver } from './storage.types';
import { ChunkStorage } from './ChunkStorage';
import {
    isCall,
    ScenarioAction,
    ScenarioContext,
} from './scenarios/scenario.types';
import { Collection } from './collection';
import { UUID } from './common';
import { Space } from './space';

export class ChunkDB<RECORDS extends ICollectionTypes> {
    public storage: ChunkStorage;
    public collections: { [NAME in keyof RECORDS]: Collection<RECORDS, NAME, RECORDS[NAME]> };
    private storageDriver: IChunkStorageDriver;
    public spaces: Map<UUID, Space<RECORDS>> = new Map();

    constructor(config: IChunkDBConfig<RECORDS>) {
        this.collections = {} as any;
        Object.entries(config.collections)
              .forEach(([name, cfg]) => {
                  this.collections[name as keyof RECORDS] = new Collection(this, name, new CollectionConfig(name, cfg));
              });
        this.storageDriver = config.storage;
        this.storage = new ChunkStorage(this.storageDriver);
    }

    public collection<NAME extends keyof RECORDS>(name: NAME): Collection<RECORDS, NAME, RECORDS[NAME]> {
        if (name in this.collections)
            return this.collections[name];

        throw new Error(`Invalid collection "${name}"`);
    }

    public run(scenario: any): any {
        const context: ScenarioContext = {
            storage: this.storage,
        };

        return scenarioRunner(context, scenario);

        // const gen = scenario.apply(context, args);
        //
        // let result: any;
        //
        // while (true) {
        //     const { done, value } = gen.next(result);
        //     if (done)
        //         return value as T;
        //
        //     const [action, ...callArgs] = value;
        //
        //     result = await action.apply(context, callArgs);
        // }
    }
}

export interface Runner<T> {
    next(): Promise<{ done: boolean, value: T }>;
}

function scenarioRunner<T>(context: ScenarioContext, scenario: Generator<ScenarioAction | T, ScenarioAction, ScenarioAction>): Runner<T> {
    async function next(result?: any): Promise<{ done: boolean, value: T }> {
        for (; ;) {
            const tmp = scenario.next(result);
            const done = !!tmp.done;
            const value: any = tmp.value;
            if (isCall(value)) {
                const { action, args } = value;
                result = await action.apply(context, args);
                if (done)
                    return { done, value: result };
            } else {
                return { done, value };
            }
        }
    }

    return { next };
}
