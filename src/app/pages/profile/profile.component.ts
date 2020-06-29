import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { take } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userID:any;
  displayName:any;
  userEmail:any;
  userImg:any;
  userContact:any;
  roomDetails:any;
  faEdit = faEdit;

  // Updates on user details
  userForm: FormGroup;

  constructor(
    public auth: AuthService,
    private userService: UserService,
    public fb: FormBuilder,
  ) {
    // User update form
    this.userForm = this.fb.group({
      roomDetails: '',
      userContact: '',
  })
   }

  get newRoomDetails() { return this.userForm.get('roomDetails') }
  get newUserContact() { return this.userForm.get('userContact') }

  ngOnInit(): void {

    // Get user details.
    this.auth.getUser().pipe(take(1)).subscribe(user => {
      this.userID = user.uid;
      this.userService.getUser(this.userID).pipe(take(1)).subscribe(firebaseUser => {
          // console.log(firebaseUser);
          this.displayName = firebaseUser['displayName'];
          this.userEmail = firebaseUser['email'];
          this.userImg = firebaseUser['profileImg'];
          if (!firebaseUser['userContact'] || !firebaseUser['roomDetails'] ) {
              alert("Your profile is incompete, please complete them before viewing requests.");
          } else {
              this.userContact = firebaseUser['userContact'];
              this.roomDetails = firebaseUser['roomDetails'];
          }
      })
    })

    // Display profile content once everything is loaded
    $(document).ready(function() {
      $("#loading-header").hide();
      // $('#content').fadeIn(1000);

      $(".fade-right").animate({left:"-=20px", opacity:"show"}, 1000);

  })
  }

  // User details update methods
  updateUserInfo() {
    if (this.newRoomDetails.value) {}
    var formDetails = {
        // Input details
        roomDetails: (this.newRoomDetails.value) ? this.newRoomDetails.value : this.roomDetails,
        userContact: (this.newUserContact.value) ? this.newUserContact.value : this.userContact,
    }

    this.userService.updateDetails(this.userID, formDetails).then(() => {
        this.toggleUserDetailsDisplay();
        this.roomDetails = (this.newRoomDetails.value) ? this.newRoomDetails.value : this.roomDetails;
        this.userContact = (this.newUserContact.value) ? this.newUserContact.value : this.userContact;
        this.userForm.reset();
    });

}

// User details update methods
toggleUserDetailsDisplay() {

    $('#contact-display').show();
    $('#contact-edit').hide();

    $('#room-detail-display').show();
    $('#room-detail-edit').hide();

    $('#room-display').show();
    $('#room-edit').hide();


    $('#edit-icon').show();
    $('#update-button').hide();
}

// User details update methods
toggleUserDetailsEdit() {

    $('#contact-display').hide();
    $('#contact-edit').show();
    $('#contact-textarea').val(this.userContact);

    $('#room-detail-display').hide();
    $('#room-detail-edit').show();
    $('#room-detail-textarea').val(this.roomDetails);

    $('#room-display').hide();
    $('#room-edit').show();
    $('#room-textarea').val(this.roomDetails);


    $('#edit-icon').hide();
    $('#update-button').show();
}

trigger() {
    alert(" blur!");
}

}
