import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupabaseService } from 'src/app/services/supabase';

@Injectable({
  providedIn: 'root'
})
export class Dashboard {
  key = environment.key;
  //headers = new HttpHeaders({ Authorization: 'Bearer ' + this.apikey });
  //headers = new HttpHeaders({ apikey: +this.apikey });
  private headers = new HttpHeaders({
    apikey: this.key,
    Authorization: 'Bearer ' + this.key
  });
  baseurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/';
  countsitesurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/sites?select=count';
  countcustomersurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/customers?select=count';
  countbookingsurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/bookings?select=count';
  totalpaymenturl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/bookings?select=total:paid.sum()';
  allsitesurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/sites';
  //lastfivebookingsurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/bookings?order=createddate.desc&limit=5';
  lastfivebookingsurl = `${this.baseurl}bookings?select=*,customers(*)&order=created_at.desc&limit=5`;
  addlocationurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/sites';
  updatelocationurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/sites?siteid=eq.';
  allcustomersurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/customers';
  addcustomerurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/customers';
  updatecustomerurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/customers?customerID=eq.';
  viewreservationsurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/bookings?customerID=eq.';
  updatereservationsstatusurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/bookings?bookingsID=eq.';
  allpaymentmethodsurl = 'https://jfdnxpajjpginywtzlwu.supabase.co/rest/v1/paymentMethod?status=eq.1';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(
    private http: HttpClient,
    private supabase: SupabaseService
  ) {}

  CountSites(): Observable<CountResultResp[]> {
    return this.http.get<CountResultResp[]>(this.countsitesurl, { responseType: 'json', headers: this.headers });
    //return this.http.get<{ count: number }[]>(this.countsitesurl, { responseType: 'json', headers: this.headers });
  }
  CountCustomers(): Observable<CountResultResp[]> {
    return this.http.get<CountResultResp[]>(this.countcustomersurl, { responseType: 'json', headers: this.headers });
  }
  CountBookings(): Observable<CountResultResp[]> {
    return this.http.get<CountResultResp[]>(this.countbookingsurl, { responseType: 'json', headers: this.headers });
  }
  TotalPayment(): Observable<CountResultResp[]> {
    return this.http.get<CountResultResp[]>(this.totalpaymenturl, { responseType: 'json', headers: this.headers });
  }
  ReturnAllSites(): Observable<allSiteResp[]> {
    return this.http.get<allSiteResp[]>(this.allsitesurl, { responseType: 'json', headers: this.headers });
  }
  ReturnLastFiveBookings(): Observable<Last5Bookings[]> {
    return this.http.get<Last5Bookings[]>(this.lastfivebookingsurl, { responseType: 'json', headers: this.headers });
  }
  ReturnAllCustomers(): Observable<AllCustomersResp[]> {
    return this.http.get<AllCustomersResp[]>(this.allcustomersurl, { responseType: 'json', headers: this.headers });
  }
  ReturnAllPaymentMethods(): Observable<allPaymentMethodResp[]> {
    return this.http.get<allPaymentMethodResp[]>(this.allpaymentmethodsurl, { responseType: 'json', headers: this.headers });
  }

  addLocation(data: LocationReq): Observable<{ status: number }> {
    return this.http
      .post<any>(this.addlocationurl, data, {
        headers: this.headers,
        responseType: 'json',
        observe: 'response' // 👈 get full HttpResponse
      })
      .pipe(
        map((response: HttpResponse<any>) => ({
          status: response.status, // HTTP status code
          body: response.body || [] // typed response body
        }))
      );
  }

  addCustomer(data: CustomerReq): Observable<{ status: number }> {
    return this.http
      .post<any>(this.addcustomerurl, data, {
        headers: this.headers,
        responseType: 'json',
        observe: 'response' // 👈 get full HttpResponse
      })
      .pipe(
        map((response: HttpResponse<any>) => ({
          status: response.status, // HTTP status code
          body: response.body || [] // typed response body
        }))
      );
  }

  updateLocation(data: LocationReq, siteid: string): Observable<{ status: number }> {
    return this.http
      .patch<any>(this.updatelocationurl + siteid, data, {
        headers: this.headers,
        responseType: 'json',
        observe: 'response' // 👈 get full HttpResponse
      })
      .pipe(
        map((response: HttpResponse<any>) => ({
          status: response.status, // HTTP status code
          body: response.body || [] // typed response body
        }))
      );
  }

  updateCustomer(data: UpdateCustomerReq, customerID: string): Observable<{ status: number }> {
    return this.http
      .patch<any>(this.updatecustomerurl + customerID, data, {
        headers: this.headers,
        responseType: 'json',
        observe: 'response' // 👈 get full HttpResponse
      })
      .pipe(
        map((response: HttpResponse<any>) => ({
          status: response.status, // HTTP status code
          body: response.body || [] // typed response body
        }))
      );
  }
  updateReservationStatus(data: UpdateBookingStatusReq, bookingID: string): Observable<{ status: number }> {
    return this.http
      .patch<any>(this.updatereservationsstatusurl + bookingID, data, {
        headers: this.headers,
        responseType: 'json',
        observe: 'response' // 👈 get full HttpResponse
      })
      .pipe(
        map((response: HttpResponse<any>) => ({
          status: response.status, // HTTP status code
          body: response.body || [] // typed response body
        }))
      );
  }

  async ReturnAllCustomersReservations(customerID: string) {
    return this.http.get<CustomerReservationsResp[]>(this.viewreservationsurl + customerID, {
      responseType: 'json',
      headers: this.headers
    });
    // const { data, error } = await this.supabase.rpc('get_bookings_by_customer', { customer_id_input: customerID });

    //if (error) console.error(error);
    //else console.log(data);
  }
}

interface UpdateBookingStatusReq {
  status: number;
}

interface CustomerReq {
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
}
interface UpdateCustomerReq {
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
  status: number;
}

interface LocationReq {
  sitename: string;
  address: string;
  size: string;
  gps: string;
  price: number;
  status: number;
}

interface CountResultResp {
  count: number;
}

interface allPaymentMethodResp {
  id: number;
  created_at: string;
  paymentID: string;
  name: string;
  status: number;
}

interface allSiteResp {
  id: number;
  siteid: string;
  created_at: string;
  sitename: string;
  address: string;
  size: string;
  gps: string;
  price: number;
  status: number;
}

interface Last5Bookings {
  id: number;
  created_at: string;
  bookingsID: string;
  customerID: string;
  sitesID: string;
  price: number;
  agreedprice: number;
  balance: number;
  startDate: string;
  endDate: string;
  status: number;
  paid: number;
  customers: CustomerData;
}
interface CustomerData {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: number;
  address: string;
  created_at: string;
  customerID: string;
  contactPerson: string;
}

interface AllCustomersResp {
  id: number;
  created_at: string;
  customerID: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
  status: number;
}

interface CustomerReservationsResp {
  id: number;
  created_at: string;
  bookingsID: string;
  customerID: string;
  sitesID: string;
  price: number;
  agreedprice: number;
  balance: number;
  startDate: string;
  endDate: string;
  status: number;
  paid: number;
}
