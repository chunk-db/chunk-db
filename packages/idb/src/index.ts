import {
    ChunkID,
    ISpace,
    IStorageDriver,
    Space,
    SpaceID,
} from '@chunk-db/core';
import { IGenericChunk } from '@chunk-db/core/dist/chunks';

interface IndexedDBDriverConfig {
    /**
     * Prefix for any collections
     */
    prefix?: string;
    /**
     * Specify collection for information about spaces
     */
    spacesCollection?: string;
}

export class IndexedDBDriver implements IStorageDriver {
    private indexedDB: IDBFactory;
    private db?: IDBDatabase;
    public readonly prefix: string;
    public readonly spacesCollection: string;

    constructor(public readonly dbName: string, config: IndexedDBDriverConfig = {}) {
        this.prefix = config.prefix || 'chunk-db-';
        this.spacesCollection = config.spacesCollection || 'chunk-db-spaces';

        this.indexedDB = window.indexedDB || (window as any)['mozIndexedDB'] || (window as any)['webkitIndexedDB'] || (window as any)['msIndexedDB'];
        if (!this.indexedDB)
            throw new Error(`Fatal error: Your platform not supports IndexedDB`);
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            const req = this.indexedDB.open(this.dbName, 1);
            req.addEventListener('success', () => {
                this.db = req.result;
                console.log('successful connect to DB');
                resolve();
            }, { once: true });
            req.addEventListener('error', reject, { once: true });
            req.addEventListener('upgradeneeded', (event) => {
                const db = (event.target as any).result;
                console.log('upgrade', db);
                db.createObjectStore(this.spacesCollection, { keyPath: 'id' });
                db.createObjectStore(this.chunkStorageName, { keyPath: 'id' });
            }, { once: true });
            req.addEventListener('blocked', () => reject(new Error('IndexedDB blocked')), { once: true });
        });
    }

    loadChunk(id: ChunkID): Promise<IGenericChunk | undefined> {
        console.log(`REAL LOAD CHUNK "${id}"`);
        return new Promise<IGenericChunk>((resolve, reject) => {
            if (!this.db)
                return reject(new Error('DB not init'));
            const tx = this.db.transaction(this.chunkStorageName, 'readwrite');
            const req = tx.objectStore(this.chunkStorageName)
                          .get(id);
            req.addEventListener('success', event => resolve(req.result), { once: true });
            req.addEventListener('error', reject, { once: true });
        });
    }

    saveChunk(chunk: IGenericChunk): Promise<IGenericChunk> {
        console.log(`SAVE CHUNK "${chunk.id}"`);
        return new Promise<IGenericChunk>((resolve, reject) => {
            if (!this.db)
                return reject(new Error('DB not init'));
            console.log('idb:', this.db);
            const tx = this.db.transaction(this.chunkStorageName, 'readwrite');
            tx.addEventListener('complete', () => resolve(chunk), { once: true });
            tx.addEventListener('error', () => reject(chunk), { once: true });
            const chunkCollection = tx.objectStore(this.chunkStorageName);
            chunkCollection.put(chunk);
        });
    }

    markDraftChunkAsUnused(id: ChunkID): Promise<void> {
        console.log(`MARK UNUSED CHUNK "${id}"`);
        return Promise.resolve(undefined);
    }

    loadSpace(id: SpaceID): Promise<ISpace | undefined> {
        console.log('LOAD SPACE ' + id);
        return new Promise<ISpace>((resolve, reject) => {
            if (!this.db)
                return reject(new Error('DB not init'));
            const tx = this.db.transaction([this.spacesCollection], 'readwrite');
            const req = tx.objectStore(this.spacesCollection)
                          .get(id);
            req.addEventListener('success', event => resolve(req.result), { once: true });
            req.addEventListener('error', reject, { once: true });
        });
    }

    saveSpace(space: ISpace): Promise<ISpace> {
        console.log('SAVE SPACE ' + space.id);
        if (!(space instanceof Space))
            space = new Space(space);
        return new Promise<ISpace>((resolve, reject) => {
            if (!this.db)
                return reject(new Error('DB not init'));
            console.log('idb:', this.db);
            const tx = this.db.transaction(this.spacesCollection, 'readwrite');
            tx.addEventListener('complete', () => resolve(space), { once: true });
            tx.addEventListener('error', () => reject(space), { once: true });
            const spaceCollection = tx.objectStore(this.spacesCollection);
            spaceCollection.put(space);
        });
    }

    private get chunkStorageName(): string {
        return this.prefix + 'chunks';
    }
}
