import {Component} from '@angular/core';
import {ARTICLE_CATEGORIES} from '../../../../shared/models/article/category.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {
  categories = ARTICLE_CATEGORIES;

  constructor(private readonly router: Router) {}

  async navigateToCategory(slug: string): Promise<void> {
    await this.router.navigate(['category', slug]);
  }
}
