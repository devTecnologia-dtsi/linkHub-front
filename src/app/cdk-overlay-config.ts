import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

/**
 * OverlayContainer personalizado que agrega automáticamente el atributo nonce
 * a los <style> inyectados dinámicamente por Angular CDK / NG-ZORRO.
 */
@Injectable({ providedIn: 'root' })
export class CspOverlayContainer extends OverlayContainer {
  protected override _createContainer(): void {
    super._createContainer();

    const nonce = this._getCspNonce();

    if (nonce) {
      this._applyNonceToExistingStyles(nonce);

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLStyleElement) {
              node.setAttribute('nonce', nonce);
            }
          });
        }
      });

      observer.observe(this._containerElement, { childList: true });
    }
  }

  private _getCspNonce(): string {
    const el = document.querySelector('script[nonce]');
    return el?.getAttribute('nonce') ?? '';
  }

  private _applyNonceToExistingStyles(nonce: string): void {
    const styles = this._containerElement.querySelectorAll('style');
    styles.forEach((style) => style.setAttribute('nonce', nonce));
  }
}
