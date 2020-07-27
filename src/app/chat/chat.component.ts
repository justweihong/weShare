import { Component, OnInit, OnDestroy, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { take, timestamp } from 'rxjs/operators';
import { ChatService } from '../services/chat/chat.service';
import { AuthService } from '../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { text } from '@fortawesome/fontawesome-svg-core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as autosize from 'autosize';
import { NotificationService } from '../services/notification/notification.service';
// import { time } from 'console';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  userID: any;
  allUsers:any = [];
  chatState:any;
  navstate:any;
  displayName: any;

  currentChat:any;
  currentChatMessages:any;
  newMessage: FormGroup;

  myChats:any;
  // chatUserIDs = ["1grR7ziJIdTEp05Ph9pQn0LrBTh1", "9bYI7XvokiNmGwqkmKOA6pxklLI3", "AvY3ySEvwEY2W1ZDqnp1alRzIMy2"];
  // chatUserData: any;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    public chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {

    alert("READ THIS: if you are currently on mobile version, the chat input area and scrolling will have some display issues when keyboard is up. We are still currently working on it, and we apologise for the inconvenience caused! For better experience, please use our app on desktop!");
    this.createEmptyForm();

    // Chat textarea.
    var self = this;
    // $(".chat-message-list").css("height", 'calc( 100vh - 60px - 5em - ' + $(".chat-form2").height() + 'px' );
    $( document ).ready(function() {
      // console.log( "document loaded" );

      // Autosize textarea.
      // var textarea = document.querySelector('textarea')
      // autosize(textarea);

      // Adjust chat message list height accordingly.
      // $(".chat-message-list").css("height", 'calc( 100vh - 60px - 5em - ' + $(".chat-form2").height() + 'px' );
      // textarea.addEventListener('autosize:resized', function(){
      //   $(".chat-message-list").css("height", 'calc( 100vh - 60px - 5em - ' + $(".chat-form2").height() + 'px');
      // });

      // 'Enter' to send mesasge.
      $('#textarea').keypress(function(e){
        if(e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        self.sendMessage();
        }
      });


  });




    //Get all users.
    this.userService.getUsers().pipe(take(1)).subscribe(users => {
      users.sort((a,b) => a['timeStamp'] - b['timeStamp'])
      this.allUsers = users;
    })

    // Get the initial chat state.
    this.chatState = this.activatedRoute.snapshot.url[1].path;
    if (!this.chatState) {
        this.chatState = "nil";
    }
    // console.log("initial", this.chatState);

    // Get user details.
    this.auth.getUser().pipe(take(1)).subscribe(user => {
      this.userID = user.uid;
      this.displayName = user.displayName;


      //get my chats
      this.subscriptions.push(this.chatService.getChats().pipe().subscribe(chats => {

        // console.log("chat");
        var myChats = [];

        var getAllUserData = [];
        chats.forEach(chat => {
          // console.log(chat);

          var getUserData = new Promise((resolve) => {
            if (chat['user1'] == this.userID || chat['user2'] == this.userID) {

              var otherUserID;
              if (chat['user1'] == this.userID) {
                // chatUserIDs.push(chat['user2'])
                otherUserID = chat['user2'];
              } else {
                // chatUserIDs.push(chat['user1']);
                otherUserID = chat['user1'];
              }
                this.userService.getUser(otherUserID).pipe(take(1)).subscribe(userdata => {
                  chat['otherUserData'] = userdata;
                  myChats.push(chat);

                  resolve("done!");
              })

            } else {
              resolve("not added.");
            }
          })
          getAllUserData.push(getUserData);

        })
        // console.log(getAllUserData)

        Promise.all(getAllUserData).then(() => {
          this.myChats = myChats;
          this.createEmptyForm();
          this.getCurrentChatData();
        })

      }));

      // Within same component route to different chats/find-users.
      this.subscriptions.push(this.router.events.subscribe(val => {
        if (val instanceof NavigationEnd) {
          this.chatState = val.url.slice(6); //chatID

          if (this.chatState == '') {
            this.chatState = 'find-users';

          }
          this.createEmptyForm();
          this.getCurrentChatData();



          // Autosize textarea.
          // autosize.destroy(document.querySelectorAll('textarea'));
          // autosize(document.querySelectorAll('textarea'));
        }
      }))


    })
  }

  get text() { return this.newMessage.get('text') }

  /**ngOnInit Helper methods START **/
  createEmptyForm() {
    this.newMessage = this.fb.group({
      'text': '',
    });
  }
  getCurrentChatData() {
    if (this.chatState != 'find-users' || this.chatState != '' && this.chatState) {

      // Get current chat.
      for (let chat of this.myChats) {
        if (chat['ID'] == this.chatState) {
          this.currentChat = chat;
        }
      }

      // Get chat messages.
      this.subscriptions.push(this.chatService.getMessages(this.chatState).pipe().subscribe(messages => {
        this.currentChatMessages = messages;
      }));
    }
  }
  /**ngOnInit Helper methods END **/

  datetime12H(timestamp) {
    const day = new Date(timestamp).getDate();
    const monthNo = new Date(timestamp).getMonth();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    const month = months[monthNo];
    var year = new Date(timestamp).getFullYear();
    var hour24:any = new Date(timestamp).getHours();
    var min:any = new Date(timestamp).getMinutes();

    // Set to 12H timing.
    var hour12 = hour24;
    var ampm = "am";
    if (hour24 > 12) {
      hour12 = hour24 - 12;
      ampm = "pm";
    }
    if (hour24 == 0 || hour24 == 24) {
      hour12 = 12;
      ampm = "am"
    }

    // Add 0 padding for single digits.
    if (min < 10) {
        min = "0" + min;
    }
    if (hour12 < 10) {
        hour12 = "0" + hour12;
    }

    return day + " " + month + " " + year + ", " + hour12 + "." + min + " " +  ampm ;
 }


  checkIfChatExist(user1, user2) {
    return new Promise((resolve) => {
      this.chatService.checkIfChatExist(user1, user2).then(details => {resolve(details['answer'])});
    })

  }

  startChat(user){
    if (user['uid'] == this.userID) {
      alert("You can't start a chat with yourself!");
    } else {
      this.chatService.checkIfChatExist(this.userID, user['uid']).then(details => {
        if (details['answer'] == true) {
          this.router.navigate(["/chat/", details['chatID']])

        } else {
          if (confirm("Start chat with " + user["displayName"] + "?")) {
            this.chatService.createNewChat(this.userID, user['uid']).then(chatID => {
              this.router.navigate(["/chat/", chatID])
            });
          }
        }
      });
    }

  }

  sendMessage() {
    // console.log(this.currentChat['otherUserData']);
    this.checkIfChatExist(this.userID, this.currentChat['otherUserData']['uid']).then(answer => {
      if (answer == true) {
        if (this.text.value != "") { // don't send empty message
          var messageDetails = {
            text: this.text.value,
            senderID: this.userID,
            timeStamp: Date.now(),
          };

          this.chatService.addMessage(this.chatState, messageDetails);
          this.chatService.updateLatestChat(this.chatState, this.userID, this.text.value);
          this.newMessage.reset();

          // console.log('targetID: ',this.currentChat['otherUserData']);

          //send notification to user
          var data = {
            'title': 'New Message!',
            'description': this.displayName + ' has sent you a message!',
            'createdBy': this.userID,
            'status': 'new notification',
            'ID': this.userID + this.currentChat['otherUserData']['uid'],
            'timeStamp': Date.now(),
          }
          this.notificationService.notifyUser(this.currentChat['otherUserData']['uid'], this.userID + this.currentChat['otherUserData']['uid'], data)

          //reset autosize
          // autosize.destroy(document.querySelectorAll('textarea'));
          // autosize(document.querySelectorAll('textarea'));
        }

      } else {
        alert("This chat does not exist anymore!");
        this.router.navigate(["/chat/find-users"]);
      }
    })

  }

  deleteChat(currentChat) {
    if(confirm("Are you sure you want to delete chat with " + currentChat['otherUserData']['displayName'] + "? It will be deleted for both parties.")) {
      this.chatService.removeChat(currentChat['ID']);
      this.router.navigate(["/chat/find-users"]);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
}


}
