import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chatUserIDs = ["1grR7ziJIdTEp05Ph9pQn0LrBTh1", "9bYI7XvokiNmGwqkmKOA6pxklLI3", "AvY3ySEvwEY2W1ZDqnp1alRzIMy2"];
  chatUserData: any;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    //get user data
    this.userService.getUserDocFromList(this.chatUserIDs).pipe(take(1)).subscribe(userdata => {
      this.chatUserData = userdata;
    })

  }

}
