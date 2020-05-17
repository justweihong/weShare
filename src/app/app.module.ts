import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import * as firebase from "firebase/app";
import { LoginComponent } from './pages/login/login.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RequestListingCardComponent } from './components/request/request-listing-card/request-listing-card.component';
import { HomeComponent } from './pages/home/home.component';
import { RequestPageComponent } from './pages/request-page/request-page.component';
import { from } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ExploreComponent,
    NavbarComponent,
    RequestListingCardComponent,
    HomeComponent,
    RequestPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
