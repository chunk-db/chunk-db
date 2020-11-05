import { ChunkDB } from './ChunkDB';
import { ChunkID } from './common';
import { IQuery } from './ConditionValidator';
import { IRecord } from './record.types';
import { FindScenario, IFindResult } from './scenarios/find.types';
import { findBruteForce } from './scenarios/findBruteForce';

/**
 * Отвечает за создание выборки для конкретного пространства данных по конкретному запросу
 */
export class QuerySelector<T extends IRecord = IRecord> {
    private scenario: FindScenario<T>;
    #done = false;
    public get done() {
        return this.#done;
    }

    constructor(private readonly db: ChunkDB<any>,
                private readonly chunkID: ChunkID,
                private readonly query: IQuery) {
        this.scenario = this.db.run(findBruteForce(this.chunkID, this.query));
    }

    async next(): Promise<IFindResult<T>> {
        const { done, value } = await this.scenario.next();
        this.#done = !!done;
        return value;
    }
}
