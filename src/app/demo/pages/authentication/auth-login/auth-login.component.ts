// project import
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
//import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
export class AuthLoginComponent {
  email = '';
  password = '';
  loading = false;
  message = '';
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private supabase: SupabaseService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router
  ) {}

  async login() {
    this.loading = true;

    try {
      await this.supabase.signIn(this.email, this.password);
      this.message = 'Login successful!';
      this.router.navigate(['/dashboard/default']);
    } catch (err) {
      //alert(err.message);
      this.message = err.message;
    } finally {
      this.loading = false;
    }
  }
  async loginWithGoogle() {
    //await this.supabase.signInWithProvider('google');
    await this.supabase.signInWithGoogle();
  }
  // public method
  SignInOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];
}
