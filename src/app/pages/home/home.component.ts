import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
declare var $ : any;
// import * as $ from 'jquery';

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

    //   $(function() {
    //     $('a[href*=\\#]:not([href=\\#])').on('click', function() {
    //         var target = $(this.hash);
    //         target = target.length ? target : $('[name=' + this.hash.substr(1) +']');
    //         if (target.length) {
    //             $('html,body').animate({
    //                 scrollTop: target.offset().top
    //             }, 1000);
    //             return false;
    //         }
    //     });
    // })


  })
  }

  playVid() {
    var vid = document.getElementById("walkthrough-video");

  }

  newTab(url) {
    window.open(url,'_blank');
  }

  scrollDown(navlocation, offset){
    console.log("scroll down")
    var target = $(`#${navlocation}`);
    var x = document.getElementById("myTopnav");
    // $('#home').animate({
    $('html, body').animate({
      scrollTop: target.offset().top - offset +1
    }, 1000);

  }
}
