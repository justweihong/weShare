import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afs: AngularFirestore,
    private router: Router,
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

  //From request or marketplace.
  startChat(user1, user2) {
    if (confirm("start chatting?")) {
      this.checkIfChatExist(user1, user2).then(details => {
        if (details['answer'] == true) {
          this.router.navigate(["/chat/", details['chatID']])
        } else {
          this.createNewChat(user1, user2).then(chatID => {
            this.router.navigate(["/chat/", chatID])
          })
        }
      })
    }
  }

  createNewChat(user1, user2) {
    return new Promise((resolve, reject) => {
      this.checkIfChatExist(user1, user2).then(details => {
        if (details['answer'] == true) {
          alert("You already have an existing chat with this person!");
          reject("existing quest");
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
                    resolve(key.id);
                }
                // create empty messages collection
            );
          }

        }
      });
    })



  }
  removeChat(chatID) {
    this.afs.collection(`chat/${chatID}/messages`).valueChanges().pipe(take(1)).subscribe(messages => {
      var deleteMessages = [];
      messages.forEach(message => {
        var deleteMessage = new Promise((resolve) => {
          const messageID = message['ID']
          this.afs.doc(`chat/${chatID}/messages/${messageID}`).delete().then(() => {
            resolve("deleted message");
          });
        })
        deleteMessages.push(deleteMessage);
      })
      Promise.all(deleteMessages).then(() => {
        this.afs.doc(`chat/${chatID}`).delete();
      })
    })
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
