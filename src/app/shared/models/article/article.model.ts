import {ArticleCategoryTitle} from './category.model';

export interface Article {
  id: string;
  writerId: string;
  thumbnailURL: string;
  title: string;
  category: ArticleCategoryTitle;
  content: string;
  thumbnailImage?: ArticleImage;
  contentImages?: ArticleImage[];
  createdAt: string;
  updatedAt?: string;
}

export interface ArticleImage {
  id: string;
  downloadURL: string;
}
