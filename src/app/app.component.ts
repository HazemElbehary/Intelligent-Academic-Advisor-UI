import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-primeng-app';

  constructor(private authService: AuthService) {}

  logOut() {
   this.authService.logOut();
  }
}
