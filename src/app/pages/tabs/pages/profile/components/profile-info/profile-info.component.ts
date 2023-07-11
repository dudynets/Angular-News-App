import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {
  UserProfile,
  UserRole,
} from '../../../../../../shared/store/user/user.model';
import {
  DeleteAccount,
  SignOut,
} from '../../../../../../shared/store/user/user.actions';
import {Store} from '@ngxs/store';
import {ActionSheetController} from '@ionic/angular';
import {Article} from '../../../../../../shared/models/article/article.model';
import {Like} from '../../../../../../shared/models/like/like.model';
import {Comment} from '../../../../../../shared/models/comment/comment.model';
import {UserService} from '../../../../../../shared/services/auth/user.service';
import {FeedService} from '../../../../../../shared/services/feed/feed.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnChanges {
  @Input({required: true}) user!: UserProfile;

  likedArticles: Article[] = [];

  protected readonly UserRole = UserRole;

  get userArticles(): Article[] {
    return this.user?.articles || [];
  }

  get userLikes(): Like[] {
    return this.user?.likes || [];
  }

  get userComments(): Comment[] {
    return this.user?.comments || [];
  }

  constructor(
    private readonly store: Store,
    private readonly actionSheetController: ActionSheetController,
    private readonly userService: UserService,
    private readonly feedService: FeedService
  ) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (
      changes['user']?.currentValue?.likes !==
      changes['user']?.previousValue?.likes
    ) {
      if (this.user?.likes?.length) {
        this.likedArticles = await this.feedService.getLikedArticles(
          this.user.likes
        );
      } else {
        this.likedArticles = [];
      }
    }
  }

  async signOut(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Yes, sign me out',
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
        await this.store.dispatch(new SignOut());
      }
    });
  }

  async deleteAccount(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to delete your account?',
      buttons: [
        {
          text: 'Yes, delete my account',
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
        await this.store.dispatch(new DeleteAccount());
      }
    });
  }

  async deleteComment(comment: Comment): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to delete this comment?',
      subHeader: 'This action cannot be undone.',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: 'delete',
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: 'cancel',
        },
      ],
    });
    await actionSheet.present();
    const {data} = await actionSheet.onDidDismiss();

    if (data === 'delete') {
      await this.userService.deleteComment(comment.id);
    }
  }
}
