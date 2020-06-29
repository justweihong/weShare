import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { take, map, tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private userService: UserService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.auth.user.pipe(
        take(1),
        map(user => !!user),
        tap(loggedIn => {

          this.auth.getUser().pipe(take(1)).subscribe(user => {
            this.userService.getUser(user.uid).pipe(take(1)).subscribe(userdata => {
              if (!userdata["userContact"] || !userdata["roomDetails"]) {
                this.router.navigate(['/profile']);
              }
            });
          })

        })
    )
  }

}
