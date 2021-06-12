import { Model } from './Model';
import { UUID } from './common.types';

class TestEntity {
    public id: UUID = '';
    public sid: UUID = '';
    public title: string = '';
    public index: number = 0;
    public category: UUID = '';

    constructor(data?: any) {
        if (data) Object.assign(this, data);
    }
}

describe('Model', () => {
    it('full initialization', () => {
        const scheme = new Model<TestEntity>('test', {
            uuid: 'id',
            sid: 'category',
            factory: data => new TestEntity(data),
            indexes: {
                index: 'auto',
            },
        });
    });
});
