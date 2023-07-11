import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {EditorPage} from '../editor-page.component';
import {ActionSheetController} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<EditorPage> {
  constructor(private readonly actionSheetController: ActionSheetController) {}

  async canDeactivate(component: EditorPage): Promise<boolean> {
    if (!component.formModified) return true;

    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to leave this page?',
      subHeader: 'All your changes will be lost.',
      buttons: [
        {
          text: 'Yes, leave this page',
          role: 'destructive',
          data: {
            action: 'confirm',
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

    const isConfirmed =
      (await actionSheet.onDidDismiss()).data?.action === 'confirm';

    if (isConfirmed) {
      component.clearForm();
      return true;
    }

    return false;
  }
}
