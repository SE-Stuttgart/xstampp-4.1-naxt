import { Subscription } from 'rxjs';

/**
 * Helper class for the subscription.
 * To add subscription/s to the internal array call plusOne/plusMany
 */
export class Subscriptions {
  private readonly _subscriptions: Subscription[] = [];
  private _active: boolean = false;

  get active(): boolean {
    return this._active;
  }

  /**
   * Adds the subscriptions to the internal array
   */
  set plusOne(v: Subscription) {
    this._subscriptions.push(v);
  }

  /**
   * Adds an array of subscriptions to the internal array
   */
  // set plusMany(v: Subscription[]) {
  //   // push is faster then concat!
  //   this._subscriptions.push(...v);
  // }

  private clear(): void {
    this._subscriptions.splice(0, this._subscriptions.length);
  }

  activate(): void {
    this._active = true;
  }

  deactivate(): void {
    this._active = false;
  }

  /**
   * unsubscribs all subscriptions
   */
  unsubscribe(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
    this.clear();
  }
}
