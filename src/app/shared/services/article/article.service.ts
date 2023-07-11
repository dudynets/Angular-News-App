import {inject, Injectable} from '@angular/core';
import {Article, ArticleImage} from '../../models/article/article.model';
import {generateId} from '../../helpers/idGenerator';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import {base64ToBlob, MimeType} from '../../helpers/base64ToBlob';
import {
  collectionGroup,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import {optimizeImage} from '../../helpers/optimizeImage';
import {Comment} from '../../models/comment/comment.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly storage: Storage = inject(Storage);
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  async getArticle(id: string): Promise<Article | null> {
    const articlesCollectionGroup = collectionGroup(this.firestore, 'articles');
    const querySnapshot = await getDocs(
      query(articlesCollectionGroup, where('id', '==', id))
    );
    if (!querySnapshot.empty) {
      const articleDoc = querySnapshot.docs[0];
      return articleDoc.data() as Article;
    }
    return null;
  }

  async getLikes(articleId: string): Promise<number> {
    const likesCollectionGroup = collectionGroup(this.firestore, 'likes');

    const likesQuery = query(
      likesCollectionGroup,
      where('articleId', '==', articleId)
    );

    const likesQuerySnapshot = await getDocs(likesQuery);

    return likesQuerySnapshot.size;
  }

  async getComments(articleId: string): Promise<Comment[]> {
    const commentsCollectionGroup = collectionGroup(this.firestore, 'comments');

    const commentsQuery = query(
      commentsCollectionGroup,
      where('articleId', '==', articleId)
    );

    const commentsQuerySnapshot = await getDocs(commentsQuery);

    return commentsQuerySnapshot.docs.map((commentDoc) => {
      return commentDoc.data() as Comment;
    });
  }

  async publishArticle(article: Article) {
    const modifiedThumbnailArticle = await this.uploadThumbnailImage(article);
    const modifiedContentArticle = await this.uploadContentImages(
      modifiedThumbnailArticle
    );

    const filteredImagesContent = await this.deleteUnusedContentImages(
      modifiedContentArticle
    );
    await this.uploadArticle(filteredImagesContent);
  }

  private async uploadThumbnailImage(article: Article): Promise<Article> {
    let base64Data = article.thumbnailURL;
    const validBase64 = !base64Data.startsWith('http');

    if (!base64Data || !validBase64) {
      return article;
    }

    // Delete old thumbnail
    if (article.thumbnailImage) {
      const oldThumbnailRef = ref(
        this.storage,
        `users/${article.writerId}/articles/${article.id}/thumbnail/${article.thumbnailImage.id}.png`
      );
      await deleteObject(oldThumbnailRef);
    }

    const id = generateId(); // Generate a random ID for the image
    const filePath = `users/${article.writerId}/articles/${article.id}/thumbnail/${id}.png`;

    base64Data = optimizeImage(base64Data, 1200, 1200, 0.8);
    const file = base64ToBlob(base64Data, MimeType.JPEG);

    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const downloadUrlPromise: Promise<string> = uploadTask.then(() => {
      return getDownloadURL(storageRef);
    }) as Promise<string>;

    article.thumbnailURL = await downloadUrlPromise;
    article.thumbnailImage = {
      id,
      downloadURL: article.thumbnailURL,
    };

    return article;
  }

  private async uploadContentImages(article: Article): Promise<Article> {
    const base64Regex = /data:image\/[^;]+;base64[^"]+/g;
    const images = article.content.match(base64Regex) || [];

    const uploadTasks = images.map((base64Image) => {
      const id = generateId(); // Generate a random ID for the image
      const filePath = `users/${article.writerId}/articles/${article.id}/images/${id}.jpeg`;

      // Optimize image
      const base64Data = optimizeImage(base64Image, 1200, 1200, 0.8);
      const file = base64ToBlob(base64Data, MimeType.JPEG);

      const storageRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const downloadUrlPromise = uploadTask.then(() => {
        return getDownloadURL(storageRef);
      });

      return {image: base64Image, urlPromise: downloadUrlPromise, id};
    });

    const results = await Promise.all(uploadTasks);

    for (const result of results) {
      const imageUrl = (await result.urlPromise) as string;
      article.content = article.content.replace(result.image, imageUrl);
      article.contentImages = [
        ...(article.contentImages || []),
        {
          id: result.id,
          downloadURL: imageUrl,
        },
      ];
    }

    return article;
  }

  private async uploadArticle(article: Article): Promise<void> {
    const articleRef = doc(
      this.firestore,
      'users',
      article.writerId,
      'articles',
      article.id
    );

    await setDoc(articleRef, article, {merge: true});
  }

  private async deleteUnusedContentImages(article: Article): Promise<Article> {
    const contentImages = article.contentImages || [];
    const filteredContentImages: ArticleImage[] = [];
    for (const image of contentImages) {
      if (!article.content.includes(image.downloadURL)) {
        const oldImageRef = ref(
          this.storage,
          `users/${article.writerId}/articles/${article.id}/images/${image.id}.png`
        );
        await deleteObject(oldImageRef);
      } else {
        filteredContentImages.push(image);
      }
    }
    return {
      ...article,
      contentImages: filteredContentImages,
    };
  }

  async deleteArticle(article: Article) {
    const articleRef = doc(
      this.firestore,
      'users',
      article.writerId,
      'articles',
      article.id
    );
    await deleteDoc(articleRef);

    if (article.thumbnailImage) {
      const thumbnailRef = ref(
        this.storage,
        `users/${article.writerId}/articles/${article.id}/thumbnail/${article.thumbnailImage.id}.png`
      );
      await deleteObject(thumbnailRef);
    }

    if (article.contentImages) {
      const imagesRef = ref(
        this.storage,
        `users/${article.writerId}/articles/${article.id}/images/`
      );
      for (const image of article.contentImages) {
        const imageRef = ref(imagesRef, `${image.id}.png`);
        await deleteObject(imageRef);
      }
    }
  }
}
