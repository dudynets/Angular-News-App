import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {UserService} from '../../services/auth/user.service';
import {ActionSheetController} from '@ionic/angular';
import {Comment} from '../../models/comment/comment.model';
import {UserProfile} from '../../store/user/user.model';
import {Select} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {UserSelectors} from '../../store/user/user.selectors';
import {Article} from '../../models/article/article.model';
import {ArticleService} from '../../services/article/article.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnDestroy {
  @Select(UserSelectors.getUser) user$!: Observable<UserProfile | null>;

  @Input({required: true}) comment!: Comment;
  @Input() showArticleLink = false;

  @Output() deleteComment: EventEmitter<void> = new EventEmitter<void>();

  user: UserProfile | null = null;
  article: Article | null = null;

  destroyed$ = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private readonly actionSheetController: ActionSheetController,
    private readonly articleService: ArticleService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getUserProfile(this.comment.userId);

    if (this.showArticleLink) {
      this.article = await this.articleService.getArticle(
        this.comment.articleId
      );
    }
  }

  async _deleteComment(): Promise<void> {
    this.deleteComment.emit();
  }

  isUsersComment(currentUser: UserProfile): boolean {
    return currentUser?.uid === this.comment.userId;
  }

  async ngOnDestroy(): Promise<void> {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
