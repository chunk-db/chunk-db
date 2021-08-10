import { QueryOperators } from '../../ConditionValidator';
import { Primitive } from '../../common.types';

export type Condition = { [key in keyof typeof QueryOperators]?: any };

export type FindQuery = {
    [key: string]: Primitive | Condition;
};
