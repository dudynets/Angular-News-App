import {inject, Injectable} from '@angular/core';
import {Article} from '../../models/article/article.model';
import {
  collectionGroup,
  Firestore,
  getDocs,
  limit,
  query,
  where,
} from '@angular/fire/firestore';
import {ArticleCategoryTitle} from '../../models/article/category.model';
import {Like} from '../../models/like/like.model';

export interface FeedConfig {
  querySize?: number;
  category?: ArticleCategoryTitle;
}

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private firestore: Firestore = inject(Firestore);

  async getFeed(config?: FeedConfig): Promise<Article[]> {
    let articlesCollectionGroup;

    if (config?.category) {
      articlesCollectionGroup = query(
        collectionGroup(this.firestore, 'articles'),
        where('category', '==', config.category)
      );
    } else {
      articlesCollectionGroup = collectionGroup(this.firestore, 'articles');
    }

    if (config?.querySize) {
      articlesCollectionGroup = query(
        articlesCollectionGroup,
        limit(config.querySize)
      );
    }

    const articlesQuerySnapshot = await getDocs(articlesCollectionGroup);

    const articles: Article[] = [];
    articlesQuerySnapshot.forEach((articleDoc) => {
      const articleData = articleDoc.data() as Article;
      articles.push(articleData);
    });

    return articles;
  }

  async getLikedArticles(likes: Like[]): Promise<Article[]> {
    const articlesCollectionGroup = collectionGroup(this.firestore, 'articles');
    const articlesQuerySnapshot = await getDocs(articlesCollectionGroup);
    const articles: Article[] = [];
    articlesQuerySnapshot.forEach((articleDoc) => {
      const articleData = articleDoc.data() as Article;
      articles.push(articleData);
    });
    const likedArticles: Article[] = articles.filter((article) => {
      return likes.some((like) => like.articleId === article.id);
    });
    return likedArticles;
  }
}
