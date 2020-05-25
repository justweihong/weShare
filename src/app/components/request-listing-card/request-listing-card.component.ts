import { Component, OnInit, Input } from '@angular/core';
import { RequestService } from "../../services/request/request.service";
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service'; 
import { take } from 'rxjs/operators';
declare var $: any;

@Component({
    selector: 'app-request-listing-card',
    templateUrl: './request-listing-card.component.html',
    styleUrls: ['./request-listing-card.component.css']
})
export class RequestListingCardComponent implements OnInit {
    @Input() requestDetails: any;
    displayName: any;
    



    constructor(
        public auth: AuthService,
        private requestService: RequestService,
        private userService: UserService,
    ) {
     }

    ngOnInit(): void {
        if (this.requestDetails) {
            var creatorID = this.requestDetails['createdBy'];
            this.userService.getUser(creatorID).pipe(take(1)).subscribe(user => {
                this.displayName = user['displayName'];
            })
        }
    }
    

    seeRequestDetails() {
        if (this.requestDetails) {
            this.requestService.sendRequestDetails(this.requestDetails);
            $('#request-details').modal('show');
        } else {
            alert("This request has incomplete details!");
        }

    }

    timeAgo() {
        var timestamp = this.requestDetails['timeStamp'];
        var delta = Date.now() - timestamp;
        var days =Math.floor(delta / (1000 * 60 * 60 * 24));
        var hours = Math.floor(delta / (1000 * 60 * 60));
        var min = Math.floor(delta / (1000 * 60 ));
        var sec = Math.floor(delta / (1000));
        
        if(days < 0){
          return `now`;
        }else if(days > 14){
    
          return `${new Date(timestamp).toLocaleDateString()}`;
        }else if(days){
    
          return `${days} days ago`;
        }else if (hours){
    
          return `${hours} hours ago`;
        }else if (min){
    
          return `${min} mins ago`;
        }else if (sec){
    
          return ` seconds ago`;
        }else{
          return `now`;
        }
    }

}
