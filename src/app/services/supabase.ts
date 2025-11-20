import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  apikey = environment.key;
  private supabase: SupabaseClient;
  private bucket = 'aglproofofpayment';

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
  async MakeReservations(d: MakeBookingsReq) {
    //customerID text,sitesID text,price numeric,agreedprice numeric,paid numeric,balance numeric,startDate date,endDate date,enterID
    //customerid text, sitesid text, price numeric, agreedprice numeric, paid numeric, balance numeric, startdate date, enddate date, enterid text
    const sDate = new Date(d.startDate);
    const eDate = new Date(d.endDate);
    /*const { data, error } = await this.supabase.rpc('make_reservations', {
      customerID: d.customerID,
      sitesID: d.sitesID,
      price: d.price,
      agreedprice: d.agreedprice,
      paid: d.price,
      balance: d.balance,
      startDate: sDate,
      endDate: eDate,
      enterID: d.enteredBy


      customerid: '9b650279-aa9b-464c-93ec-e029f3e3fe41',
      sitesid: '19c15404-3a1b-4414-b369-9f019f5c52b5',
      price: 20000000,
      agreedprice: 18000000,
      paid: 14000000,
      balance: 4000000,
      startdate: '2025-12-01',
      enddate: '2025-12-31',
      enterid: 'Ajagbe Uthman Olawale'
    });*/
    const { data, error } = await this.supabase.rpc('makereservations', {
      customerid: d.customerID,
      sitesid: d.sitesID,
      price: d.price,
      agreedprice: d.agreedprice,
      paid: d.paid,
      balance: d.balance,
      startdate: sDate,
      enddate: eDate,
      enterid: d.enteredBy,
      paymentmethod: d.paymentMethod
    });
    console.log('Data returned:' + JSON.stringify(data));
    if (error) {
      console.error('Supabase RPC Error:', error);

      throw error;
      return 0;
    }

    //console.log('Fetched joined data:', data);
    return data;
  }

  async uploadFile(file: File, path: string) {
    const { data, error } = await this.supabase.storage.from(this.bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

    if (error) throw error;
    return data;
  }

  async getPublicUrl(path: string) {
    return this.supabase.storage.from(this.bucket).getPublicUrl(path).data.publicUrl;
  }

  async listFiles(folder: string = '') {
    const { data, error } = await this.supabase.storage.from(this.bucket).list(folder, { limit: 100 });

    if (error) throw error;
    return data;
  }

  async downloadFile(path: string) {
    const { data, error } = await this.supabase.storage.from(this.bucket).download(path);

    if (error) throw error;
    return data;
  }

  async deleteFile(path: string) {
    const { error } = await this.supabase.storage.from(this.bucket).remove([path]);

    if (error) throw error;
    return true;
  }
}

interface MakeBookingsReq {
  customerID: string;
  sitesID: string;
  price: number;
  agreedprice: number;
  paid: number;
  balance: number;
  startDate: string;
  endDate: string;
  enteredBy: string;
  paymentMethod: number;
}
