import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  createDefaultObject<T>(defaults: T): T {
    return { ...defaults };
  }
}
