import {Component, inject, OnInit} from '@angular/core';
import {
  ARTICLE_CATEGORIES,
  ArticleCategoryTitle,
} from '../../shared/models/article/category.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Select} from '@ngxs/store';
import {UserSelectors} from '../../shared/store/user/user.selectors';
import {map, Observable, Subject, takeUntil} from 'rxjs';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import Quill, {Delta} from 'quill';
import {UserProfile} from '../../shared/store/user/user.model';
import {QuillModules} from 'ngx-quill';
import BlotFormatter from 'quill-blot-formatter';
import {Article} from '../../shared/models/article/article.model';
import {generateId} from '../../shared/helpers/idGenerator';
import {ArticleService} from '../../shared/services/article/article.service';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ActionSheetController,
  IonRouterOutlet,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import {Capacitor} from '@capacitor/core';
import {CameraPermissionType} from '@capacitor/camera/dist/esm/definitions';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-editor',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.scss'],
})
export class EditorPage implements OnInit {
  @Select(UserSelectors.getUser) user$!: Observable<UserProfile | null>;
  user: UserProfile | null = null;

  private route = inject(ActivatedRoute);

  id$: Observable<string> = this.route.params.pipe(
    map((params) => params['articleId'])
  );

  editorForm: FormGroup = new FormGroup({
    title: new FormControl<string | undefined>(undefined, Validators.required),
    category: new FormControl<string | undefined>(
      undefined,
      Validators.required
    ),
    thumbnailImage: new FormControl<string | undefined>(
      undefined,
      Validators.required
    ),
    content: new FormControl<Delta | undefined>(undefined, Validators.required),
  });

  isEditMode: boolean = false;
  editableArticle: Article | undefined;

  categories = ARTICLE_CATEGORIES;

  quillModules: QuillModules = {};

  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private readonly articleService: ArticleService,
    private readonly router: Router,
    private readonly routerOutlet: IonRouterOutlet,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) {
    this.quillModules = {
      blotFormatter: {},
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{'header': 1}, {'header': 2}],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{'script': 'sub'}, {'script': 'super'}],
          ['link', 'image'],
        ],
      },
    };
  }

  get formModified(): boolean {
    return this.editorForm.dirty;
  }

  get formValid(): boolean {
    return this.editorForm.valid;
  }

  get thumbnailImage(): string | undefined {
    return this.editorForm.get('thumbnailImage')?.value;
  }

  get thumbnailImageUrl(): string {
    if (!this.thumbnailImage) return '';
    if (this.thumbnailImage?.startsWith('http')) return this.thumbnailImage;
    return `data:image/jpeg;base64,${this.thumbnailImage}`;
  }

  get editValid(): boolean {
    return (
      this.formModified &&
      (this.editableArticle?.title !== this.editorForm.get('title')?.value ||
        this.editableArticle?.category !==
          this.editorForm.get('category')?.value ||
        this.editableArticle?.thumbnailURL !==
          this.editorForm.get('thumbnailImage')?.value ||
        this.editableArticle?.content !==
          JSON.stringify(this.editorForm.get('content')?.value || ''))
    );
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroyed$)).subscribe((user) => {
      this.user = user;
    });

    this.id$.subscribe(async (id) => {
      if (!id) return;
      await this.initArticle(id);
    });
  }

  ionViewDidEnter() {
    this.routerOutlet.swipeGesture = false;
  }

  async publish(): Promise<void> {
    if (!this.formValid) return;
    if (!this.user) return;
    if (this.isEditMode && !this.editableArticle && !this.editValid) return;

    const loadingEl = await this.loadingController.create({
      message: this.isEditMode ? 'Saving article...' : 'Publishing article...',
      duration: 0,
    });
    await loadingEl.present();

    const id = this.isEditMode ? this.editableArticle?.id! : generateId();
    const writerId = this.user.uid;
    const thumbnailURL = this.editorForm.get('thumbnailImage')?.value;
    const title = this.editorForm.get('title')?.value;
    const category: ArticleCategoryTitle = this.editorForm.get('category')
      ?.value as ArticleCategoryTitle;
    const content = JSON.stringify(this.editorForm.get('content')?.value || '');
    const createdAt = this.isEditMode
      ? this.editableArticle!.createdAt
      : new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const article: Article = {
      id,
      writerId,
      thumbnailURL,
      title,
      category,
      content,
      createdAt,
      thumbnailImage: this.editableArticle?.thumbnailImage || undefined,
      contentImages: this.editableArticle?.contentImages || [],
    };

    if (this.isEditMode) {
      article.updatedAt = updatedAt;
    }

    await this.articleService.publishArticle(article);

    await loadingEl.dismiss();
    const toast = await this.toastController.create({
      message: this.isEditMode
        ? 'Article saved successfully!'
        : 'Article published successfully!',
      duration: 3000,
      position: 'top',
    });
    await toast.present();
    await this.clearForm();

    // await this.router.navigate(['/article', id]);
    // navigate as root to prevent back button from showing
    await this.router.navigate(['/article', id], {replaceUrl: true});
  }

  async selectThumbnailImage(): Promise<void> {
    // Ask user to select image from gallery or take a photo
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      subHeader: 'Select the source for the image',
      buttons: [
        {
          text: 'Load from Library',
          icon: 'image',
          data: {
            action: 'library',
          },
        },
        {
          text: 'Use Camera',
          icon: 'camera',
          data: {
            action: 'camera',
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

    const result = await actionSheet.onDidDismiss();
    const action = result.data?.action;

    if (action !== 'camera' && action !== 'library') return;

    const source =
      action === 'camera' ? CameraSource.Camera : CameraSource.Photos;

    const permissions: CameraPermissionType[] =
      action === 'camera' ? ['camera'] : ['photos'];
    if (Capacitor.isNativePlatform()) {
      await Camera.requestPermissions({
        permissions,
      });
    }

    const image = await Camera.getPhoto({
      quality: 90,
      width: 1200,
      height: 1200,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source,
    });

    if (!image) return;

    this.editorForm.patchValue({
      thumbnailImage: image.base64String,
    });
  }

  async removeThumbnailImage(): Promise<void> {
    // Ask if user wants to remove thumbnail image
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to remove the thumbnail image?',
      subHeader: 'This action cannot be undone',
      buttons: [
        {
          text: 'Yes, remove it',
          role: 'destructive',
          data: {
            action: 'remove',
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

    const result = await actionSheet.onDidDismiss();
    const action = result.data?.action;

    if (action !== 'remove') return;

    this.editorForm.patchValue({
      thumbnailImage: undefined,
    });
  }

  clearForm(): void {
    this.editorForm.reset();
  }

  private async initArticle(id: string): Promise<void> {
    const article = this.user?.articles?.find((article) => article.id === id);
    if (!article) {
      this.clearForm();
      await this.router.navigate(['/']);
      return;
    }
    this.editorForm.patchValue({
      title: article?.title,
      category: article?.category,
      thumbnailImage: article?.thumbnailURL,
      content: JSON.parse(article?.content || ''),
    });
    this.editableArticle = article;
    this.isEditMode = true;
  }
}
