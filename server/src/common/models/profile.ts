import type { ICommonFields } from './misc';
import type { PersonasType } from '../config/constants';

import { Document } from 'mongodb'; //to allow other dynamic props

interface IProfile extends Document, ICommonFields {
  persona: PersonasType;
  accessories: number;
  apparel: number;
  'accessories:watches': number;
  'apparel:topwear': number;
  'apparel:bottomwear': number;
  avgCartPrice: number;
}

export type { IProfile };
