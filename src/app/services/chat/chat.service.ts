import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afs: AngularFirestore,
  ) { }


  sendMessage(){}

  createNewChat(user1, user2) {

    this.checkIfChatExist(user1, user2).then(details => {
      if (details['answer'] == true) {
        alert("You already have an existing chat with this person!");
      } else {
        //Create new chat
        const collection = this.afs.collection(`chat`);
        const chatDetails = {
          timeStamp : Date.now(),
          hasRead: false,
          user1: user1,
          user2: user2,
          latestChat: null,
          latestChatSender: null,
        }
        if (navigator.onLine) {
          return collection.add(chatDetails).then(
              key => {
                  collection.doc(`${key.id}`).set({ ID: key.id }, { merge: true });
              }
          );
        }

      }
    });

  }

  checkIfChatExist(user1, user2) {
    return new Promise((resolve) => {
      this.afs.collection(`chat`).valueChanges().pipe(take(1)).subscribe(chats => {
        chats.forEach(chat => {
          if (chat['user1'] == user1 || chat['user2'] == user1) {
            if (chat['user1'] == user2 || chat['user2'] == user2) {
              resolve({answer: true, chatID: chat['ID']})
            }
          }
        })
        resolve({answer: false});
      })
    })
  }

  getChats(){
    return this.afs.collection(`chat`).valueChanges();
  }
}
