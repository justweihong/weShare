import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  getUser(userID) {
      return this.afs.doc(`user/${userID}`).valueChanges();
  }

  updateDetails(userID, data) {
      return this.afs.doc(`user/${userID}`).set(data, {merge: true});
  }
}
