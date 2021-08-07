import { IRecord } from './record.types';

export type IPart<T extends IRecord = IRecord> =
    | {
          type: 'find';
          value: FindQuery;
          withParams?: boolean;
      }
    | {
          type: 'filter';
          value: FilterQuery<T>;
          withParams?: boolean;
      }
    | {
          type: 'staticSort';
          value: SortQuery;
          withParams?: boolean;
      }
    | {
          type: 'dynamicSort';
          value: DynamicSortQuery<T>;
          withParams?: boolean;
      };

export type FindQuery = Record<string, any>;
export type SortQuery = Record<string, any>;
export type DynamicSortQuery<T> = (a: T, b: T, params: Record<string, any>) => number;
export type FilterQuery<T> = (record: T, params: Record<string, any>) => boolean;
