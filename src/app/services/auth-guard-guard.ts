import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from './supabase';

@Injectable({ providedIn: 'root' })
export class authGuardGuard implements CanActivate {
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private supabase: SupabaseService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router
  ) {}

  async canActivate() {
    const { data } = await this.supabase.client.auth.getSession();
    if (data.session) return true;
    this.router.navigate(['/login']);
    return false;
  }
}
