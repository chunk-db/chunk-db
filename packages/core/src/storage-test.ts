import { IGenericChunk } from './chunks/ChunkFactory';
import { ChunkID, SpaceID } from './common.types';
import { ISpace } from './space';
import { IStorageCacheDriver } from './storage.types';

export type ActionType = keyof IStorageCacheDriver;

interface IAction {
    type: ActionType;
    id: ChunkID | SpaceID | string | undefined;
    value: IGenericChunk | ISpace | undefined;
    resolve: (data: any) => void;
    reject: (error: any) => void;
}

export class StorageTestDriver implements IStorageCacheDriver {
    public actions: IAction[] = [];

    /**
     * Check only for 1 found actions
     * @param type
     * @param id
     */
    checkAction(type: ActionType, id?: IAction['id']): IAction {
        const found = this.actions.filter(action => action.type === type && (id == null ? true : action.id === id));
        if (!found.length)
            if (this.actions.length)
                throw new Error(`No found action "${type}". The first action is "${this.actions[0].type}"`);
            else throw new Error(`No found action "${type}". No any actions fired`);
        if (found.length > 1) throw new Error(`Found actions "${type}" more then one`);
        const index = this.actions.indexOf(found[0]);
        this.actions.splice(index, 1);
        return found[0];
    }

    /**
     * Check for 1 or more found actions
     */
    checkActions(type: ActionType, id?: IAction['id']): IAction[] {
        const found = this.actions.filter(action => action.type === type && (id == null ? true : action.id === id));
        if (!found.length) throw new Error(`No found action "${type}"`);
        found.forEach(item => this.actions.splice(this.actions.indexOf(item), 1));
        return found;
    }

    /**
     * Throw error if actions exists
     */
    verify(): void {
        if (!this.actions.length) return;

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
                resolve,
                reject,
            });
        });
    }

    loadSpace(id: SpaceID): Promise<ISpace | undefined> {
        return new Promise((resolve, reject) => {
            this.actions.push({
                type: 'loadSpace',
                id,
                value: undefined,
                resolve,
                reject,
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
                resolve,
                reject,
            });
        });
    }

    saveSpace(space: ISpace): Promise<ISpace> {
        return new Promise<ISpace>((resolve, reject) => {
            this.actions.push({
                type: 'saveSpace',
                id: space.id,
                value: space,
                resolve,
                reject,
            });
        });
    }
}
