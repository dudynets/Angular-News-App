import {Component, OnInit} from '@angular/core';
import {FeedService} from '../../../../shared/services/feed/feed.service';
import {Article} from '../../../../shared/models/article/article.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  articles: Article[] = [];
  initialLoading = true;

  constructor(private readonly feedService: FeedService) {}

  async ngOnInit(): Promise<void> {
    this.articles = await this.feedService.getFeed();
    this.initialLoading = false;
  }

  async handleRefresh(event: any): Promise<void> {
    this.articles = await this.feedService.getFeed();
    await event.target.complete();
  }
}
