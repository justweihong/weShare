import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  displayName: any;
  userID: any;

  constructor(
    private userService: UserService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {

    this.auth.user.subscribe(usr => {
      this.displayName = usr.displayName;
      this.userID = usr.uid;
    })

    this.userService.getUsers().subscribe(userList => {

      userList.forEach(user => {
        user['listingCount']
        user['completedListingCount']
      })
    })
  }

}
