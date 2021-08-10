import { IRecord } from '../record.types';

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
          type: 'map';
          value: MapModifier<T, any>;
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

export type FilterQuery<T> = (record: T, params: Record<string, any>) => boolean;

export type MapModifier<T, R> = (record: T, params: Record<string, any>) => R;
export type SortQuery = Record<string, any>;
export type DynamicSortQuery<T> = (a: T, b: T, params: Record<string, any>) => number;

export interface PipeOperator<T, R> {
    (params: any): PipeOperation<T, R>;
}

export interface PipeOperation<T extends IRecord = IRecord, R = T> {
    (record: T, params: QueryParams): R | undefined;
}
