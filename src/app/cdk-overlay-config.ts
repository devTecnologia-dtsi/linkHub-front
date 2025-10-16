import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NoncedOverlayContainer extends OverlayContainer {
  protected createContainer(): void {
    super._createContainer();
    const styles = this._containerElement.querySelectorAll('style');
    styles.forEach(style => {
      style.setAttribute('nonce', this._getCspNonce());
    });
  }

  private _getCspNonce(): string {
    // Angular no expone el nonce directamente; lo puedes leer del index.html
    const el = document.querySelector('script[nonce]');
    return el?.getAttribute('nonce') ?? '';
  }
}
