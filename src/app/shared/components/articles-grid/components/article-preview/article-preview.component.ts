import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Article} from '../../../../models/article/article.model';
import {ArticleService} from '../../../../services/article/article.service';
import {Router} from '@angular/router';
import {Select} from '@ngxs/store';
import {UserSelectors} from '../../../../store/user/user.selectors';
import {Observable, Subject, takeUntil} from 'rxjs';
import {UserProfile, UserRole} from '../../../../store/user/user.model';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.scss'],
})
export class ArticlePreviewComponent implements OnInit, OnDestroy {
  @Input({required: true}) article!: Article;
  @Input({required: true}) showActions = true;

  @Select(UserSelectors.getUser) user$!: Observable<UserProfile | null>;

  writerView = false;

  destroyed$ = new Subject<void>();

  constructor(
    private readonly articleService: ArticleService,
    private readonly router: Router,
    private readonly actionSheetController: ActionSheetController
  ) {}

  async view(): Promise<void> {
    await this.router.navigate(['/article', this.article.id]);
  }
  async edit(): Promise<void> {
    await this.router.navigate(['/editor', this.article.id]);
  }

  async delete(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to delete this article?',
      subHeader: 'This action cannot be undone',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
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

    const {data} = await actionSheet.onDidDismiss();

    if (data?.action === 'delete') {
      await this.articleService.deleteArticle(this.article);
    }
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroyed$)).subscribe((user) => {
      if (
        user?.uid === this.article.writerId &&
        user?.role === UserRole.WRITER
      ) {
        this.writerView = true;
      }
    });
  }

  async navigateToArticle(): Promise<void> {
    await this.router.navigate(['/article', this.article.id]);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
