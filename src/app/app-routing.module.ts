import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'documents',
        loadChildren: () =>
        import('./features/documents/document.module').then((m) => m.DocumentModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'users',
        loadChildren: () =>
        import('./features/users/user.module').then((m) => m.UserModule),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'qna-chat',
        loadChildren: () =>
        import('./features/qa/qa.module').then((m) => m.QaModule),
        canActivate: [AuthGuard],
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
