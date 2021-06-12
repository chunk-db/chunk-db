import { IRecord } from './record.types';
import { SpaceReader } from './space-reader';

export class SpaceWriter<T extends IRecord = IRecord> extends SpaceReader<T> {}
