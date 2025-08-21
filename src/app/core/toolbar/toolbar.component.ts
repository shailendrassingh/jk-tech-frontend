import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  isLoggedIn$: Observable<boolean>;
  
  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$; // We will add this to the service
  }

  logout(): void {
    this.authService.logout();
  }
}