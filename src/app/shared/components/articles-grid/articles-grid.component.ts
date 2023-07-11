import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Article} from '../../models/article/article.model';

@Component({
  selector: 'app-articles-grid',
  templateUrl: './articles-grid.component.html',
  styleUrls: ['./articles-grid.component.scss'],
})
export class ArticlesGridComponent implements OnInit, OnChanges {
  @Input({required: true}) articles!: Article[];
  @Input({required: true}) showActions = true;

  filteredArticles: Article[] = [];

  isSearching = false;
  query = '';

  ngOnInit(): void {
    this.filteredArticles = this.articles;
  }

  ngOnChanges(): void {
    this.onSearch({detail: {value: this.query}});
  }

  onSearch(event: any) {
    const query = event.detail.value.trim().toLowerCase();
    this.query = query;

    if (query === '') {
      this.isSearching = false;
      this.filteredArticles = this.articles;
      return;
    }

    this.isSearching = true;
    this.filteredArticles = this.articles.filter((article) => {
      return article.title.toLowerCase().includes(query);
    });
  }
}
