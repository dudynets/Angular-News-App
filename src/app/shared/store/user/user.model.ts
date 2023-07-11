import {Like} from '../../models/like/like.model';
import {Article} from '../../models/article/article.model';
import {Comment} from '../../models/comment/comment.model';

export interface UserStateModel {
  user: UserProfile | null;
  loading: boolean;
}

export interface UserProfile {
  // Properties from Firebase Auth
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;

  // Custom properties
  authProvider?: AuthProvider;
  role?: UserRole;
  likes?: Like[];
  comments?: Comment[];
  articles?: Article[];
}

export enum AuthProvider {
  GOOGLE = 'google',
}

export enum UserRole {
  WRITER = 'writer',
  READER = 'reader',
}

export const DEFAULT_USER_STATE_MODEL: UserStateModel = {
  user: null,
  loading: true,
};
