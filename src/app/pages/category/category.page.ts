import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  ARTICLE_CATEGORIES,
  ArticleCategory,
} from '../../shared/models/article/category.model';
import {ActivatedRoute} from '@angular/router';
import {map, Observable, Subject, takeUntil} from 'rxjs';
import {Article} from '../../shared/models/article/article.model';
import {FeedService} from '../../shared/services/feed/feed.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit, OnDestroy {
  category: ArticleCategory | undefined;
  articles: Article[] = [];
  initialLoading = true;

  private route = inject(ActivatedRoute);

  slug$: Observable<string> = this.route.params.pipe(
    map((params) => params['slug'])
  );

  destroyed$ = new Subject<void>();

  constructor(private readonly feedService: FeedService) {}

  ngOnInit(): void {
    this.slug$.pipe(takeUntil(this.destroyed$)).subscribe(async (slug) => {
      await this.initCategory(slug);
    });
  }

  private async initCategory(slug: string): Promise<void> {
    this.category = ARTICLE_CATEGORIES.find(
      (category) => category.slug === slug
    );

    this.articles = await this.feedService.getFeed({
      category: this.category?.title,
    });
    this.initialLoading = false;
  }

  async handleRefresh(event: any): Promise<void> {
    this.articles = await this.feedService.getFeed({
      category: this.category?.title,
    });
    await event.target.complete();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
