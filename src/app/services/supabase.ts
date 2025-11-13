import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  apikey = environment.key;
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://jfdnxpajjpginywtzlwu.supabase.co', // Replace with your project URL
      this.apikey // Replace with your public anon key
    );
  }

  get client() {
    return this.supabase;
  }
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }
  async signInWithProvider(provider: 'google' | 'github') {
    const { data, error } = await this.supabase.auth.signInWithOAuth({ provider });
    if (error) throw error;
    return data;
  }
  async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard/default' // where user goes after login
      }
    });

    if (error) console.error('Google Sign-In error:', error);
    return { data, error };
  }
  async getUser(): Promise<User | null> {
    const {
      data: { user },
      error
    } = await this.supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }
    return user;
  }
  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
  async getBookingsByCustomer(customerId: string) {
    const { data, error } = await this.supabase.rpc('get_bookings_by_customer', { customer_id_input: customerId });

    if (error) {
      console.error('Supabase RPC Error:', error);
      throw error;
    }

    console.log('Fetched joined data:', data);
    return data;
  }
}
