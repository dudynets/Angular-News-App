import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {map, Observable, Subject, takeUntil} from 'rxjs';
import {ArticleService} from '../../shared/services/article/article.service';
import {Article} from '../../shared/models/article/article.model';
import {UserService} from '../../shared/services/auth/user.service';
import {UserProfile} from '../../shared/store/user/user.model';
import {Select} from '@ngxs/store';
import {UserSelectors} from '../../shared/store/user/user.selectors';
import {Delta} from 'quill';
import {Comment} from '../../shared/models/comment/comment.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {generateId} from '../../shared/helpers/idGenerator';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit, OnDestroy {
  @Select(UserSelectors.getUser) user$!: Observable<UserProfile | null>;

  article: Article | null = null;
  writer: UserProfile | null = null;

  likesCount = 0;
  comments: Comment[] = [];

  commentForm: FormGroup = new FormGroup({
    comment: new FormControl('', [Validators.required]),
  });

  loaded = false;

  private route = inject(ActivatedRoute);

  id$: Observable<string> = this.route.params.pipe(
    map((params) => params['id'])
  );
  destroyed$ = new Subject<void>();

  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly actionSheetController: ActionSheetController,
    private readonly router: Router,
  ) {}

  get validComment(): boolean {
    return (
      this.commentForm.valid &&
      this.commentForm.get('comment')?.value.trim() !== ''
    );
  }

  async ngOnInit(): Promise<void> {
    this.id$.pipe(takeUntil(this.destroyed$)).subscribe(async (id) => {
      await this.initArticle(id);
    });
  }

  private async initArticle(id: string): Promise<void> {
    this.article = await this.articleService.getArticle(id);

    if (!this.article) {
      await this.router.navigate(['/']);
      return;
    }

    if (this.article?.writerId) {
      this.writer = await this.userService.getUserProfile(
        this.article?.writerId
      );
    }

    this.likesCount = await this.articleService.getLikes(id);
    this.comments = await this.articleService.getComments(id);

    this.loaded = true;
  }

  get articleContent(): Delta | undefined {
    const content = this.article?.content;
    if (!content) return undefined;
    return JSON.parse(content);
  }

  async like(): Promise<void> {
    if (!this.article) return;
    await this.userService.likeArticle(this.article);
    this.likesCount = await this.articleService.getLikes(this.article.id);
  }

  async unlike(): Promise<void> {
    if (!this.article) return;
    await this.userService.unlikeArticle(this.article.id);
    this.likesCount = await this.articleService.getLikes(this.article.id);
  }

  isLikedByUser(user: UserProfile): boolean {
    return (
      user.likes?.find((like) => like.articleId === this.article?.id) !==
      undefined
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  async submitComment(user: UserProfile | null): Promise<void> {
    if (!this.article) return;
    if (!user) return;
    if (!this.validComment) return;

    const comment: Comment = {
      id: generateId(),
      articleId: this.article.id,
      content: this.commentForm.value.comment.trim(),
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    await this.userService.addComment(comment);
    this.commentForm.reset();
    this.comments = await this.articleService.getComments(this.article.id);
  }

  async deleteComment(comment: Comment): Promise<void> {
    if (!this.article) return;

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
    this.comments = await this.articleService.getComments(this.article.id);
  }

  async handleRefresh($event: any): Promise<void> {
    if (!this.article) {
      await $event.target.complete();
      return;
    }

    await this.initArticle(this.article.id);
    await $event.target.complete();
  }
}
