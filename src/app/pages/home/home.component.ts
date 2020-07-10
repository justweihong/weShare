import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
// declare var $ : any;
import * as $ from 'jquery';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
      public auth: AuthService,
      public router: Router,
  ) { }

  ngOnInit(): void {
    $(document).ready(function() {
      // $('#sidebarCollapse').on('click', function () {
      //     $('#sidebar').toggleClass('active');
      // });

      $("#request-feature").click(function (){
        console.log("hello")
        $('html, body').animate({
            scrollTop: $("#chat-feature").offset().top
        }, 2000);
        // $('html, body').animate({ scrollTop: 0 }, 600);
    });

  })
  }

  playVid() {
    var vid = document.getElementById("walkthrough-video");

  }

  scroll2(){
    console.log("hell2")
    var target = $(`#request-section2`)
    $('html, body').animate({
      scrollTop: target.offset().top - 50
    }, 1000);
  }
}
