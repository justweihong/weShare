import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
      private afs: AngularFirestore,
  ) {}

  getValue() {
      return this.afs.collection(`requests`).valueChanges();
  }
}
