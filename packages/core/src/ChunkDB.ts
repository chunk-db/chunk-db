import { ChunkStorage } from './ChunkStorage';
import { Model } from './Model';
import { Accessor } from './accessor';
import { AbstractChunk, ChunkType } from './chunks';
import { Collection } from './collection';
import { makeSubscription } from './common';
import {
    ChunkID,
    IChunkDBConfig,
    ITransactionConfig,
    SpaceID,
    Subscription,
    Transaction,
} from './common.types';
import { DataSpace } from './data-space';
import { SpaceNotFoundError } from './errors';
import { UpdateEvent } from './events';
import { IRecord } from './record.types';
import {
    isCall,
    ScenarioAction,
    ScenarioContext,
} from './scenarios/scenario.types';
import { Space } from './space';
import { Spaces } from './spaces';
import { IStorageDriver } from './storage.types';

export class ChunkDB {
    public storage: ChunkStorage;
    public collections: { [key: string]: Collection<IRecord> };
    public readonly spaces: Spaces;

    public ready = false;

    private readonly storageDriver: IStorageDriver;
    private activeTransactions: Accessor[] = [];
    private storeSubscriptions: Array<() => void> = [];

    constructor(config: IChunkDBConfig) {
        this.collections = {} as any;
        config.collections
              .forEach(scheme => {
                  this.collections[scheme.name] = new Collection(this, scheme);
              });
        this.storageDriver = config.storage;
        this.storage = new ChunkStorage(this.storageDriver);

        this.spaces = new Spaces(this.storage);
    }

    public connect(): Promise<ChunkDB> {
        return this.storage.connect()
                   .then(() => {this.ready = true;})
                   .then(() => this);
    }

    /**
     * Subscribe for any changes
     *
     * @deprecated
     * @param cb Callback
     */
    public subscribe(cb: () => void): Subscription;
    /**
     * Subscribe for any changes on space
     *
     * @deprecated
     * @param spaceID Space identifier
     * @param cb Callback
     */
    public subscribe(spaceID: SpaceID, cb: () => void): Subscription;
    public subscribe(spaceID: SpaceID | (() => void), cb?: () => void): Subscription {
        if (typeof spaceID === 'function') {
            this.storeSubscriptions.push(spaceID);

            return makeSubscription(() => this.storeSubscriptions = this.storeSubscriptions.filter(
                item => item !== spaceID,
            ));
        }

        return this.spaces.subscribe(spaceID, cb as (() => void));
    }

    /**
     * Get [[DataSpace]]
     */
    public space(space: SpaceID | Space): DataSpace {
        let spaceID: SpaceID;
        if (!space)
            throw new Error(`Invalid space ""`);
        if (typeof space === 'object')
            spaceID = (space as Space).id;
        else
            spaceID = space;

        return new DataSpace(this, spaceID);
    }

    public collection<T extends IRecord>(scheme: Model<T>): Collection<T> {
        if (scheme.name in this.collections)
            return this.collections[scheme.name] as any;

        throw new Error(`Invalid collection "${scheme.name}"`);
    }

    public run(scenario: any): any {
        const context: ScenarioContext = {
            storage: this.storage,
            activeTransactions: this.activeTransactions,
            updateSpaceRefs: this.spaces.updateSpaceRefs,
            spaces: this.spaces,
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

    /**
     * Getting data only from accessor for isolation
     *
     * Транзакция может быть выполнена в любое время.
     * В одно и тоже время могут выполняться несколько транзакций.
     * В пределах одной транзакции данные не меняются, что обеспечивается
     * доступом только через accessor
     * В общий доступ данные попадают только по завершению транзакции
     * Если несколько транзакций изменили одни и те же данные, то последующие
     * конфликтующие будут перезапущены
     *
     * @param spaceID
     * @param transaction
     */
    public async transaction(spaceID: SpaceID, transaction: Transaction): Promise<UpdateEvent>;
    public async transaction(spaceID: SpaceID, config: ITransactionConfig, transaction: Transaction): Promise<UpdateEvent>;
    public async transaction(spaceID: SpaceID, maybeConfig: ITransactionConfig | Transaction, maybeTransaction?: Transaction): Promise<UpdateEvent> {
        let transaction: Transaction;
        const config: ITransactionConfig = {
            restartOnFail: false,
        };
        if (maybeTransaction) {
            transaction = maybeTransaction;
            Object.assign(config, maybeConfig as ITransactionConfig);
        } else {
            transaction = maybeConfig as Transaction;
        }

        const space = await this.spaces.load(spaceID);
        const accessor = new Accessor(this, space);
        await transaction(accessor);

        await this.applyTransaction(spaceID, accessor);

        return accessor.getStats();
    }

    public async getFlatChain(head: ChunkID, maxDepth = 3): Promise<AbstractChunk[]> {
        if (!maxDepth || !head)
            return [];

        const chain = [];
        let lastChunksIds: ChunkID[] = [head];
        for (let depth = 0; depth < maxDepth && lastChunksIds.length; depth++) {
            const chunksIds: ChunkID[] = [];

            for (const chunkId of lastChunksIds) {
                const chunk = await this.storage.loadChunk(chunkId);
                chain.push(chunk);
                chunksIds.push(...chunk.parents);
            }

            lastChunksIds = chunksIds;
        }

        return chain;
    }

    /**
     * Подготовка нового чанка данных и
     * сохранение транзакции в пространстве данных
     * @param spaceID
     * @param accessor
     * @private
     */
    private async applyTransaction(spaceID: SpaceID, accessor: Accessor): Promise<void> {
        const chunks: AbstractChunk<IRecord>[] = Object.keys(accessor.chunks).map(key => accessor.chunks[key]!);
        if (!chunks)
            return;

        const space = this.spaces.getLoaded(spaceID);
        if (!space)
            throw new SpaceNotFoundError(spaceID);

        const isFirstChunk = chunks.some(chunk => !chunk.parents.length);

        if (isFirstChunk) {
            chunks.forEach(chunk => chunk.type = ChunkType.Snapshot);
        } else {
            chunks.forEach(chunk => chunk.type = ChunkType.Incremental);
        }

        await Promise.all(chunks.map(chunk => this.storage.saveChunk(chunk)));
        chunks.forEach(chunk => this.storage.removeTemporalChunk(chunk.id));

        return this.spaces.updateSpaceRefs(space.id, accessor.refs);
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
