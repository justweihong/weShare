import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { take } from 'rxjs/operators';
import { ChatService } from '../services/chat/chat.service';
import { AuthService } from '../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

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

  myChats:any;
  // chatUserIDs = ["1grR7ziJIdTEp05Ph9pQn0LrBTh1", "9bYI7XvokiNmGwqkmKOA6pxklLI3", "AvY3ySEvwEY2W1ZDqnp1alRzIMy2"];
  // chatUserData: any;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    public chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // Update the request state
    this.chatState = this.activatedRoute.snapshot.url[1].path;
    if (!this.chatState) {
        this.chatState = "nil";
    }
    console.log(this.chatState)
      this.subscriptions.push(this.router.events.subscribe(val => {
        if (val instanceof NavigationEnd) {
          this.chatState = val.url.slice(6);
          // console.log(this.navstate);
          // this.chatState = this.activatedRoute.snapshot.url[1].path;
          // if (!this.chatState) {
          //     this.chatState = "nil";
          // }
        }
      }))


    // Get user details.
    this.auth.getUser().pipe(take(1)).subscribe(user => {
      this.userID = user.uid;


      //get my chats
      this.subscriptions.push(this.chatService.getChats().pipe().subscribe(chats => {
        var myChats = [];

        var getAllUserData = [];
        chats.forEach(chat => {

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

            }

          })
          getAllUserData.push(getUserData);
        })

        Promise.all(getAllUserData).then(() => {
          this.myChats = myChats;
          console.log(this.myChats)
        })

      }));

      //Get all users.
      this.userService.getUsers().pipe(take(1)).subscribe(users => {
        users.forEach(user => {
          if (user != this.userID) {
            this.allUsers.push(user);
          }
        })
      })



    })


  }
  checkIfChatExist(user1, user2) {
    this.chatService.checkIfChatExist(user1, user2).then(details => console.log(details['answer']));
  }

  startChat(user){
    this.chatService.checkIfChatExist(this.userID, user['uid']).then(details => {
      if (details['answer'] == true) {
        this.router.navigate(["/chat/", details['chatID']])

      } else {
        if (confirm("Start chat with " + user["displayName"] + "?")) {
          this.chatService.createNewChat(this.userID, user['uid']);
        }
      }
    });


  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
}


}
