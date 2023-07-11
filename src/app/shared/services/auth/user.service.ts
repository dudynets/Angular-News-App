import {inject, Injectable, OnDestroy} from '@angular/core';
import {AuthProvider, UserProfile} from '../../store/user/user.model';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import {
  catchError,
  combineLatest,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {Store} from '@ngxs/store';
import {ActionSheetController, ToastController} from '@ionic/angular';
import {SetLoading, UpdateUser} from '../../store/user/user.actions';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signInWithCredential,
  signInWithPopup,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import {Capacitor} from '@capacitor/core';
import {Article} from '../../models/article/article.model';
import {Comment} from '../../models/comment/comment.model';
import {Like} from '../../models/like/like.model';
import {ArticleService} from '../article/article.service';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private auth: Auth = inject(Auth);
  private authState$ = authState(this.auth);
  private firestore: Firestore = inject(Firestore);

  private destroyed$ = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly toastController: ToastController,
    private readonly actionSheetController: ActionSheetController,
    private readonly articleService: ArticleService
  ) {
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize();
    }
    this.initStateListener();
  }

  async getUserProfile(uid: string): Promise<UserProfile> {
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);

    return <UserProfile>docSnap.data();
  }

  async logIn(authProvider: AuthProvider): Promise<UserProfile> {
    switch (authProvider) {
      case AuthProvider.GOOGLE:
        return await this.signInWithGoogle();
      default:
        throw new Error('Invalid user provider');
    }
  }

  async signInWithGoogle(): Promise<UserProfile> {
    let userCredential: UserCredential | undefined;

    if (Capacitor.isNativePlatform()) {
      const googleUser = await GoogleAuth.signIn();
      const credential = GoogleAuthProvider.credential(
        googleUser.authentication.idToken
      );
      userCredential = await signInWithCredential(this.auth, credential);
    } else {
      userCredential = await signInWithPopup(
        this.auth,
        new GoogleAuthProvider()
      );
    }

    await this.updateFirestoreUser(userCredential.user, AuthProvider.GOOGLE);
    return <UserProfile>userCredential.user;
  }

  async updateFirestoreUser(
    user: UserProfile,
    authProvider: AuthProvider
  ): Promise<void> {
    const docRef = doc(this.firestore, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const data: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authProvider: authProvider,
      };

      await setDoc(docRef, data).catch((error) => {
        console.error('Error creating user', error, data, user);
      });
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);

    if (Capacitor.isNativePlatform()) {
      await GoogleAuth.signOut();
    }
  }

  async deleteAccount(userProfile: UserProfile): Promise<void> {
    const user = this.auth.currentUser;

    // Check if the user is signed in
    if (!user) {
      const toast = await this.toastController.create({
        message: 'You are not signed in. Please sign in and try again.',
        duration: 0,
        position: 'top',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ],
        layout: 'stacked',
      });
      await toast.present();
      return;
    }

    // Ask to reauthenticate
    const actionSheet = await this.actionSheetController.create({
      header:
        'You may be asked to re-authenticate in order to delete your account. Are you sure you want to continue?',
      buttons: [
        {
          text: 'Yes, proceed',
          role: 'destructive',
          data: {
            action: 'confirm',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
    await actionSheet.present();
    actionSheet.onDidDismiss().then(async (detail) => {
      if (detail?.data?.action === 'confirm') {
        try {
          // Reauthenticate the user
          if (Capacitor.isNativePlatform()) {
            const googleUser = await GoogleAuth.signIn();
            const credential = GoogleAuthProvider.credential(
              googleUser.authentication.idToken
            );
            await reauthenticateWithCredential(user, credential);
          } else {
            await reauthenticateWithPopup(user, new GoogleAuthProvider());
          }
        } catch (error) {
          const toast = await this.toastController.create({
            message: 'Re-authentication failed. Please try again.',
            duration: 3000,
            position: 'top',
          });
          await toast.present();
          return;
        }

        userProfile?.articles?.forEach((article) => {
          this.articleService.deleteArticle(article);
        });

        userProfile?.comments?.forEach((comment) => {
          this.deleteComment(comment.id);
        });

        userProfile?.likes?.forEach((like) => {
          this.unlikeArticle(like.articleId);
        });

        // Delete the user profile
        const userDoc = doc(this.firestore, 'users', user.uid);
        await deleteDoc(userDoc).catch((error) => {
          console.error('Error deleting user profile', error, user);
        });

        // Delete the user
        await user.delete();

        // Sign out
        await this.signOut();

        // Notify the user
        const toast = await this.toastController.create({
          message: 'Your account has been deleted.',
          duration: 3000,
          position: 'top',
        });
        await toast.present();
      }
    });
  }

  private initStateListener(): void {
    // Listen for user state changes and update the user profile in the store
    this.authState$
      .pipe(
        switchMap((user) => {
          if (!user) {
            return of(null);
          } else {
            // Listen for user profile changes and update the store
            const userProfileDoc = doc(this.firestore, 'users', user.uid);
            const userProfileData$ = docData(userProfileDoc);
            const userArticles$ = collectionData(
              collection(this.firestore, `users/${user.uid}/articles`)
            );
            const userComments$ = collectionData(
              collection(this.firestore, `users/${user.uid}/comments`)
            );
            const userLikes$ = collectionData(
              collection(this.firestore, `users/${user.uid}/likes`)
            );
            return combineLatest([
              userProfileData$,
              userArticles$,
              userComments$,
              userLikes$,
            ]).pipe(
              catchError(() => {
                return of(null);
              })
            );
          }
        }),
        tap((combinedData) => {
          this.store.dispatch(new SetLoading(false));

          if (!combinedData) {
            this.store.dispatch(new UpdateUser(null));
            return;
          }

          const [userProfile, articles, comments, likes] = combinedData as [
            UserProfile,
            Article[],
            Comment[],
            Like[]
          ];
          const updatedProfile: UserProfile = {
            ...userProfile,
            articles,
            comments,
            likes,
          };
          this.store.dispatch(new UpdateUser(updatedProfile || null));
        }),
        catchError(() => {
          return of(null);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  async likeArticle(article: Article): Promise<void> {
    const user = this.auth.currentUser;

    if (!user) {
      const toast = await this.toastController.create({
        message: 'You are not signed in. Please sign in and try again.',
        duration: 0,
        position: 'top',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ],
        layout: 'stacked',
      });
      await toast.present();
      return;
    }

    const like: Like = {
      articleId: article.id,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    const likeDoc = doc(this.firestore, `users/${user.uid}/likes`, article.id);
    await setDoc(likeDoc, like);
  }

  async unlikeArticle(articleId: string): Promise<void> {
    const user = this.auth.currentUser;

    if (!user) {
      const toast = await this.toastController.create({
        message: 'You are not signed in. Please sign in and try again.',
        duration: 0,
        position: 'top',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ],
        layout: 'stacked',
      });
      await toast.present();
      return;
    }

    const likeDoc = doc(this.firestore, `users/${user.uid}/likes`, articleId);
    await deleteDoc(likeDoc);
  }

  async addComment(comment: Comment): Promise<void> {
    const user = this.auth.currentUser;

    if (!user) {
      const toast = await this.toastController.create({
        message: 'You are not signed in. Please sign in and try again.',
        duration: 0,
        position: 'top',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ],
        layout: 'stacked',
      });
      await toast.present();
      return;
    }

    const commentDoc = doc(
      this.firestore,
      `users/${user.uid}/comments`,
      comment.id
    );
    await setDoc(commentDoc, comment);
  }

  async deleteComment(commentId: string): Promise<void> {
    const user = this.auth.currentUser;

    if (!user) {
      const toast = await this.toastController.create({
        message: 'You are not signed in. Please sign in and try again.',
        duration: 0,
        position: 'top',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ],
        layout: 'stacked',
      });
      await toast.present();
      return;
    }

    const commentDoc = doc(
      this.firestore,
      `users/${user.uid}/comments`,
      commentId
    );
    await deleteDoc(commentDoc);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
