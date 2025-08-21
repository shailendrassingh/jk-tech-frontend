import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="p-4">
      <h1 class="text-3xl font-bold">Welcome to the Dashboard!</h1>
      <p class="mt-4">This is a protected area. You can only see this if you are logged in.</p>
    </div>
  `
})
export class DashboardComponent { }