import type { ICommonFields } from './misc';

import { Document } from 'mongodb';

interface IProfile extends Document, ICommonFields {
  persona:
    | 'GRANDMOTHER'
    | 'GRANDFATHER'
    | 'MOTHER'
    | 'FATHER'
    | 'SON'
    | 'DAUGHTER';
  accessories: number;
  apparel: number;
  'accessories:watches': number;
  'apparel:topwear': number;
  'apparel:bottomwear': number;
  avgCartPrice: number;
}

export type { IProfile };
