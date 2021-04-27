import { ChunkStorage } from './ChunkStorage';
import { Accessor } from './accessor';
import { Collection } from './collection';
import {
    CollectionConfig,
    IChunkDBConfig,
    ICollectionTypes, ITransactionConfig, SpaceID,
    Transaction,
} from './common.types';
import { SpaceNotFoundError } from './errors';
import { UpdateEvent } from './events';
import {
    isCall,
    ScenarioAction,
    ScenarioContext,
} from './scenarios/scenario.types';
import { ISpace, Refs, Space } from './space';
import { IStorageDriver } from './storage.types';

export class ChunkDB<RECORDS extends ICollectionTypes> {
    public storage: ChunkStorage;
    public collections: { [NAME in keyof RECORDS]: Collection<RECORDS, NAME, RECORDS[NAME]> };
    public spaces: Map<SpaceID, Space<RECORDS>> = new Map();

    private readonly storageDriver: IStorageDriver;
    private activeTransactions: Accessor<RECORDS>[] = [];
    public ready = false;
    public ready$: Promise<void>;

    constructor(config: IChunkDBConfig<RECORDS>) {
        this.collections = {} as any;
        Object.entries(config.collections)
              .forEach(([name, cfg]) => {
                  this.collections[name as keyof RECORDS] = new Collection(this, name, new CollectionConfig(name, cfg));
              });
        this.storageDriver = config.storage;
        this.storage = new ChunkStorage(this.storageDriver);

        const promises: Promise<void>[] = [];
        if (config.spaces)
            (config.spaces as SpaceID[]).forEach((spaceID: SpaceID) => {
                this.spaces.set(spaceID, {
                    id: spaceID,
                    description: '',
                    name: '',
                    refs: {} as any,
                });

                promises.push(
                    this.storage.loadSpace(spaceID)
                        .then(
                            data => this.spaces.set(spaceID, new Space(data)),
                        )
                        .then(
                            () => undefined,
                        ),
                );
            });
        this.ready$ = Promise.all(promises)
                             .then(() => {this.ready = true;});
    }

    public collection<NAME extends keyof RECORDS>(name: NAME): Collection<RECORDS, NAME, RECORDS[NAME]> {
        if (name in this.collections)
            return this.collections[name];

        throw new Error(`Invalid collection "${name}"`);
    }

    public run(scenario: any): any {
        const context: ScenarioContext<RECORDS> = {
            storage: this.storage,
            activeTransactions: this.activeTransactions,
            updateSpaceRefs: this.updateSpaceRefs,
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
    public async transaction(spaceID: SpaceID, transaction: Transaction<RECORDS>): Promise<UpdateEvent>;
    public async transaction(spaceID: SpaceID, config: ITransactionConfig, transaction: Transaction<RECORDS>): Promise<UpdateEvent>;
    public async transaction(spaceID: SpaceID, maybeConfig: ITransactionConfig | Transaction<RECORDS>, maybeTransaction?: Transaction<RECORDS>): Promise<UpdateEvent> {
        const space = this.spaces.get(spaceID);
        if (!space)
            throw new SpaceNotFoundError(spaceID);

        let transaction: Transaction<RECORDS>;
        const config: ITransactionConfig = {
            restartOnFail: false,
        };
        if (maybeTransaction) {
            transaction = maybeTransaction;
            Object.assign(config, maybeConfig as ITransactionConfig);
        } else {
            transaction = maybeConfig as Transaction<RECORDS>;
        }

        const accessor = new Accessor(this, space);
        await transaction(accessor);

        this.updateSpaceRefs(spaceID, accessor.refs);
        // const gen = this.run(this.applyTransaction(accessor));
        // console.log(gen);
        // const result = await gen.next();
        // console.log(result);
        // if (!result.done)
        //     throw new InnerDBError('Scenario applyTransaction must return only ones');

        return accessor.getStats();
    }

    private async updateSpaceRefs(spaceID: SpaceID, refs: Refs<RECORDS>): Promise<void> {
        this.spaces.set(spaceID, {
            ...this.spaces.get(spaceID)!,
            refs,
        });
        await this.storage.saveSpace(this.spaces.get(spaceID) as ISpace);
    }
}

export interface Runner<T> {
    next(): Promise<{ done: boolean, value: T }>;
}

function scenarioRunner<T>(context: ScenarioContext<any>, scenario: Generator<ScenarioAction | T, ScenarioAction, ScenarioAction>): Runner<T> {
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
