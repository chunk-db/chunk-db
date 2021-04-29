import { IGenericChunk } from './chunks/ChunkFactory';
import { ChunkID, SpaceID } from './common.types';
import { ISpace, Refs } from './space';
import { IStorageCacheDriver } from './storage.types';

// export enum ActionType {
//     loadChunk = 'loadChunk',
//     saveChunk = 'saveChunk',
//     markDraftChunkAsUnused = 'markDraftChunkAsUnused',
//     loadSpace = 'loadSpace',
//     createSpace = 'createSpace',
//     updateSpace = 'updateSpace',
//     removeChunk = 'removeChunk',
//     clearChunks = 'clearChunks',
//     getAllSpaces = 'getAllSpaces',
//     clearSpaces = 'clearSpaces',
// }

export type ActionType = keyof IStorageCacheDriver;

interface IAction {
    type: ActionType;
    id: ChunkID | SpaceID | string | undefined;
    value: IGenericChunk | ISpace | undefined;
    resolve: (data: any) => Promise<void>;
    reject: (error: any) => Promise<void>;
}

export class StorageTestDriver implements IStorageCacheDriver {
    public actions: IAction[] = [];

    /**
     * Check only for 1 found actions
     * @param type
     * @param id
     */
    checkAction(type: ActionType, id?: IAction['id']): IAction {
        const found = this.actions.filter(
            action => action.type === type && (id == null ? true : action.id === id),
        );
        if (!found.length)
            throw new Error(`No found action "${type}"`);
        if (found.length > 1)
            throw new Error(`Found actions "${type}" more then one`);
        const index = this.actions.indexOf(found[0]);
        this.actions.splice(index, 1);
        return found[0];
    }

    /**
     * Check for 1 or more found actions
     */
    checkActions(type: ActionType, id?: IAction['id']): IAction[] {
        const found = this.actions.filter(
            action => action.type === type && (id == null ? true : action.id === id),
        );
        if (!found.length)
            throw new Error(`No found action "${type}"`);
        found.forEach(item =>
            this.actions.splice(this.actions.indexOf(item), 1),
        );
        return found;
    }

    /**
     * Throw error if actions exists
     */
    verify(): void {
        if (!this.actions.length)
            return;

        const list = this.actions.map((action, index) => ` #${index + 1}: action "${action.type}", id "${action.id}"`);
        throw new Error(`Not all actions checks.\n` + list.join('\n'));
    }

    clearChunks(): Promise<void> {
        return Promise.resolve(undefined);
    }

    clearSpaces(): Promise<void> {
        return Promise.resolve(undefined);
    }

    getAllSpaces(): Promise<ISpace[]> {
        return Promise.resolve([]);
    }

    loadChunk(id: ChunkID): Promise<IGenericChunk | undefined> {
        return new Promise((resolve, reject) => {
            this.actions.push({
                type: 'loadChunk',
                id,
                value: undefined,
                resolve: doAndWait(resolve, 'resolve loadChunk'),
                reject: doAndWait(reject, 'reject loadChunk'),
            });
        });
    }

    loadSpace(id: SpaceID): Promise<ISpace | undefined> {
        return new Promise((resolve, reject) => {
            this.actions.push({
                type: 'loadSpace',
                id,
                value: undefined,
                resolve: doAndWait(resolve, 'resolve loadSpace'),
                reject: doAndWait(reject, 'reject loadSpace'),
            });
        });
    }

    markDraftChunkAsUnused(id: ChunkID): Promise<void> {
        return Promise.resolve(undefined);
    }

    removeChunk(id: ChunkID): Promise<void> {
        return Promise.resolve(undefined);
    }

    saveChunk(chunk: IGenericChunk): Promise<IGenericChunk> {
        return new Promise((resolve, reject) => {
            this.actions.push({
                type: 'saveChunk',
                id: chunk.id,
                value: chunk,
                resolve: doAndWait(resolve, 'resolve saveChunk'),
                reject: doAndWait(reject, 'reject saveChunk'),
            });
        });
    }

    saveSpace(space: ISpace): Promise<ISpace> {
        return new Promise((resolve, reject) => {
            this.actions.push({
                type: 'saveSpace',
                id: space.id,
                value: space,
                resolve: doAndWait(resolve, 'resolve saveSpace'),
                reject: doAndWait(reject, 'reject saveSpace'),
            });
        });
    }
}

function doAndWait(fn: (...args: any[]) => void, message: string, timeout = 1) {
    return async () => new Promise<void>(resolve => {
        fn();
        console.log('doAndWait: ' + message);
        setTimeout(resolve, timeout);
    });
}
