// Angular core modules.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ExploreComponent } from './explore/explore.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'explore', component: ExploreComponent},
    //{ path: 'explore', redirectTo: '/explore'},
    //testing
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
