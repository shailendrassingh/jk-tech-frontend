import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { JsonPipe, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, JsonPipe, NgClass, NgIf],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isCollapsed = false;

  constructor(public auth: AuthService) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
