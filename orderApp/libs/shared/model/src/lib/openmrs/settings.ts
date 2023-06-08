import { Location } from './location';
import { User } from './users';

export interface Settings {
  name: string;
}

export interface SessionInfo {
  authenticated: boolean;
  sessionId?: string;
  user?: User;
  locale: string;
  allowedLocales: string[];
  sessionLocation?: Location;
}
