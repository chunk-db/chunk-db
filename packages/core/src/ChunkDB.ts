import { Branch } from './branch';
import { IChunkDBConfig, IRefCollection } from './db.types';
import { Tag } from './Tag';
import { IChunkStorageDriver } from './storage.types';
import { ChunkStorage } from './ChunkStorage';
import { Scenario, ScenarioContext } from './scenarios/scenario.types';

export class ChunkDB {
    public storage: ChunkStorage;
    private storageDriver: IChunkStorageDriver;

    // private readonly config: IChunkDBConfig;
    private readonly refs: IRefCollection = { branches: {}, tags: {} };

    constructor(config: IChunkDBConfig) {
        // this.config = config;
        this.storageDriver = config.storage;
        this.storage = new ChunkStorage(this.storageDriver);
    }

    public tag(name: string): Tag {
        if (name in this.refs.tags)
            return new Tag(this, name);
        else
            return new Tag(this, name);
    }

    public branch(name: string): Branch {
        return new Branch(this, name);
    }

    public async run<T, ARGS extends any[]>(scenario: Scenario<T, ARGS>, ...args: ARGS): Promise<T> {
        console.log(scenario, args, this.storage);
        const gen = scenario(...args);

        const context: ScenarioContext = {
            storage: this.storage
        };

        let result: any;

        while (true) {
            const { done, value } = gen.next(result);
            console.log(done, value);
            if (done)
                return value as T;

            if (!Array.isArray(value))
                throw new Error('Invalid return');

            const [action, ...callArgs] = value;

            result = await action(context, ...callArgs);
        }
    }
}
