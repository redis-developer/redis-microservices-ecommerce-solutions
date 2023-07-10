import type { ICommonFields } from './misc';

import { Document } from 'mongodb'; //to allow other dynamic props

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
