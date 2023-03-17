import type { ICommonFields } from './misc';

import { Document } from 'mongodb';


interface IDigitalIdentity extends Document, ICommonFields {
  action?: string;
  browserFingerprint?: string;
  ipAddress?: string;
  userId?: string;
  sessionId?: string;
  identityScore?: string;
  //others?: any
}


export type { IDigitalIdentity };
