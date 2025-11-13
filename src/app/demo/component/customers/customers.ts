import { Component, inject, ViewChild, ElementRef, Input } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { Dashboard } from 'src/app/services/dashboard';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase';

@Component({
  selector: 'app-customers',
  imports: [CardComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './customers.html',
  styleUrl: './customers.scss'
})
export class Customers {
  customers = [];
  reservations: any = [];
  site = {
    name: '',
    address: '',
    email: '',
    phone: '',
    status: 0,
    contactPerson: ''
  };

  loading = false;
  message = '';
  customerName = '';
  customerForm = this.fb.group({
    name: ['', Validators.required],
    address: ['', [Validators.required, Validators.minLength(5)]],
    phone: ['', Validators.required],
    email: ['', Validators.required, Validators.email],
    contactPerson: ['', Validators.required]
  });
  editCustomerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    contactPerson: ['', Validators.required],
    address: ['', [Validators.required, Validators.minLength(5)]],
    status: ['', Validators.required],
    customerID: [null, [Validators.required]]
  });

  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('editmodal') editmodal!: ElementRef<HTMLDialogElement>;
  @ViewChild('viewreservations') viewreservemodal!: ElementRef<HTMLDialogElement>;

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private ds: Dashboard,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private fb: FormBuilder,
    private supabase: SupabaseService
  ) {
    this.ReturnallCustomers();
  }
  ReturnallCustomers() {
    this.ds.ReturnAllCustomers().subscribe((d) => {
      this.customers = d;
    });
  }
  OpenLocationDetails() {
    this.modal.nativeElement.showModal();
  }
  OpenEdit(name, location, email, phone, contact, status, customerID) {
    this.editmodal.nativeElement.showModal();
    this.editCustomerForm.patchValue({
      name: name,
      address: location,
      email: email,
      phone: phone,
      contactPerson: contact,
      status: status,
      customerID: customerID
    });
  }
  async OpenResevations(name, customerID) {
    this.customerName = name;
    this.viewreservemodal.nativeElement.showModal();
    this.reservations = await this.supabase.getBookingsByCustomer(customerID);
  }
  get f() {
    return this.customerForm.controls;
  }
  get e() {
    return this.editCustomerForm.controls;
  }
  submitForm() {
    //alert(JSON.stringify(this.siteForm.value.price || ''));
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const data = {
      name: this.customerForm.value.name || '',
      address: this.customerForm.value.address || '',
      email: this.customerForm.value.email || '',
      phone: this.customerForm.value.phone || '',
      contactPerson: this.customerForm.value.contactPerson || ''
    };
    this.ds.addCustomer(data).subscribe({
      next: (res) => {
        console.log('Status code:', res.status);
        this.ReturnallCustomers();
        this.message = 'Customer information saved successfully!';
      },
      error: (err) => {
        console.error('Error status:', err.status);
      }
    });
    this.loading = false;

    // simulate save or API call
    /*setTimeout(() => {
     
      this.loading = false;
    }, 1200);*/
  }

  updateForm() {
    //alert(JSON.stringify(this.siteForm.value.price || ''));
    if (this.editCustomerForm.invalid) {
      this.editCustomerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const data = {
      name: this.editCustomerForm.value.name || '',
      address: this.editCustomerForm.value.address || '',
      email: this.editCustomerForm.value.email || '',
      phone: this.editCustomerForm.value.phone || '',
      contactPerson: this.editCustomerForm.value.contactPerson || '',
      status: parseInt(this.editCustomerForm.value.status)
    };
    this.ds.updateCustomer(data, this.editCustomerForm.value.customerID).subscribe({
      next: (res) => {
        console.log('Status code:', res.status);
        this.ReturnallCustomers();
        this.message = 'Customer information updated successfully!';
      },
      error: (err) => {
        console.error('Error status:', err.status);
      }
    });
    this.loading = false;

    // simulate save or API call
    /*setTimeout(() => {
     
      this.loading = false;
    }, 1200);*/
  }

  updateBookingStatus(currentStatus: number, bookingID: string, customerID: string) {
    if (window.confirm('Are you sure you want to update')) {
      alert(currentStatus);
      let data = {
        status: 0
      };

      if (currentStatus > 0) {
        data.status = 0;
      } else {
        data.status = 1;
      }

      alert('Data:' + JSON.stringify(data) + 'Booking ID:' + bookingID + ' CustomerID:' + customerID);
      this.ds.updateReservationStatus(data, bookingID).subscribe({
        next: async (res) => {
          this.reservations = await this.supabase.getBookingsByCustomer(customerID);
          this.message = 'Booking information updated successfully!';
        },
        error: (err) => {
          console.error('Error status:', err.message);
          alert('Errors:' + JSON.stringify(err));
        }
      });
      this.loading = false;
    }
  }
  close() {
    this.modal.nativeElement.close();
  }
  closeEdit() {
    this.editmodal.nativeElement.close();
  }
  closeViewReserve() {
    this.viewreservemodal.nativeElement.close();
  }
}
