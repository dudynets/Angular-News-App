import {Component, Input} from '@angular/core';
import {ArticleCategory} from '../../../../../../shared/models/article/category.model';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent {
  @Input({required: true}) category!: ArticleCategory;
  constructor() {}
}
