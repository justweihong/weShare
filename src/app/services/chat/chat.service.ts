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


  addMessage(chatID, messageDetails){
    if (navigator.onLine) {
      const collection = this.afs.collection(`chat/${chatID}/messages`)
      collection.add(messageDetails).then(
        key => {
          collection.doc(`${key.id}`).set({ ID: key.id }, { merge: true });
        }
      )
    }
  }

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
          latestChat: '',
          latestChatSender: '',
        }
        if (navigator.onLine) {
          return collection.add(chatDetails).then(
              key => {
                  collection.doc(`${key.id}`).set({ ID: key.id }, { merge: true });
              }
              // create empty messages collection
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

  getMessages(chatID) {
    return this.afs.collection(`chat/${chatID}/messages`, ref => ref.orderBy('timeStamp', 'desc')).valueChanges();
  }
  getChat(chatID) {
    return this.afs.collection(`chat/${chatID}`).valueChanges();
  }

  getChats(){
    return this.afs.collection(`chat`).valueChanges();
  }

  updateLatestChat(chatID, senderID, senderText) {
    const updateDetails = {
      latestChat: senderText,
      text2: senderText,
      latestChatSender: senderID,
    }
    this.afs.doc(`chat/${chatID}`).set(updateDetails, {merge: true});
  }
}
