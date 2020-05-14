import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import * as firebase from "firebase/app";
import { LoginComponent } from './pages/login/login.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RequestListingCardComponent } from './components/request/request-listing-card/request-listing-card.component';
import { HomeComponent } from './pages/home/home.component'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ExploreComponent,
    NavbarComponent,
    RequestListingCardComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
