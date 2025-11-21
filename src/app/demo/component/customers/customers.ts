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
  locationname = '';
  paymentmethods = [];
  paymentmethod = 0;
  bookingID = '';
  customerID = '';
  methodName = '';
  '';
  transID = '';
  transDate = '';
  customerName = '';
  customerAddress = '';
  customerEmail = '';
  customerPhone = '';
  startDate = '';
  endDate = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base64: any = '';
  totalAmount = 0;
  totalPaid = 0;
  totalBalance = 0;
  selectedFile!: File;
  uploadedUrl = '';
  display: boolean = false;
  success: boolean = false;
  failed: boolean = false;
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

  payReservationForm = this.fb.group({
    amount: [null, [Validators.required, Validators.min(1)]],
    paymentMethod: [null, [Validators.required, Validators.min(1)]]
  });

  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('editmodal') editmodal!: ElementRef<HTMLDialogElement>;
  @ViewChild('viewreservations') viewreservemodal!: ElementRef<HTMLDialogElement>;
  @ViewChild('makereservations') makereservemodal!: ElementRef<HTMLDialogElement>;
  @ViewChild('payforreservations') payreservemodal!: ElementRef<HTMLDialogElement>;
  @ViewChild('receiptmodal') receiptmodal!: ElementRef<HTMLDialogElement>;

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private ds: Dashboard,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private fb: FormBuilder,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private supabase: SupabaseService
  ) {
    this.ReturnallCustomers();
  }
  ReturnallCustomers() {
    this.ds.ReturnAllCustomers().subscribe((d) => {
      this.customers = d;
    });
  }
  ReturnPaymentMethods() {
    this.ds.ReturnAllPaymentMethods().subscribe((d) => {
      this.paymentmethods = d;
    });
  }
  closeReceipt() {
    this.receiptmodal.nativeElement.close();
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      this.base64 = reader.result;
      //this.ApplyObj.invoice = this.base64;
      this.uploadedUrl = this.base64;
    };
  }
  async upload(transID: string) {
    if (!this.selectedFile) return;

    const filePath = `uploads/${transID}-${this.selectedFile.name}`;

    await this.supabase.uploadFile(this.selectedFile, filePath);

    this.uploadedUrl = await this.supabase.getPublicUrl(filePath);
  }
  async payReservation() {
    //alert('Am inside');
    /**if (this.bookingsForm.invalid) {
      this.bookingsForm.markAllAsTouched();
      alert('Error encountered');
      return;
    }*/
    //alert('Am inside
    if (window.confirm('Are you sure you want to proceed?')) {
      this.loading = true;
      const data = {
        bookingID: this.bookingID || '',

        amount: this.payReservationForm.value.amount || 0,

        enteredBy: localStorage.getItem('email'),
        paymentMethod: this.payReservationForm.value.paymentMethod || 0
      };

      const result = await this.supabase.PayReservations(data);

      if (result != null) {
        //alert('Payment Methods:' + data.paymentMethod + ' All' + JSON.stringify(this.paymentmethods));
        //alert('Results:  All' + JSON.stringify(result));

        this.totalPaid = data.amount;

        this.methodName = this.paymentmethods.find((m) => m.id === data.paymentMethod)?.name;
        this.customerName = this.customers.find((m) => m.customerID === this.customerID)?.name;
        this.customerAddress = this.customers.find((m) => m.customerID === this.customerID)?.address;
        this.customerEmail = this.customers.find((m) => m.customerID === this.customerID)?.email;
        this.customerPhone = this.customers.find((m) => m.customerID === this.customerID)?.phone;
        this.transDate = result[0].created_at;
        this.message = 'Booking successfull';
        this.success = true;
        await this.upload(result[0].transid);
        this.reservations = await this.supabase.getBookingsByCustomer(this.customerID);
        this.payreservemodal.nativeElement.close();
        this.receiptmodal.nativeElement.showModal();
        this.transID = result[0].transid;
      } else {
        this.message = 'Booking Failed';

        this.failed = true;
      }
      this.loading = false;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPrint(divName: any) {
    const printContents = document.getElementById(divName).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }
  handleUpload(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      this.base64 = reader.result;
      //this.ApplyObj.invoice = this.base64;
    };
  }
  get g() {
    return this.payReservationForm.controls;
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
  async OpenAddReservations() {
    this.makereservemodal.nativeElement.showModal();
  }
  async openPayReservation(amount, bookingsID, customerID) {
    this.payreservemodal.nativeElement.showModal();
    this.viewreservemodal.nativeElement.close();
    this.bookingID = bookingsID;
    this.customerID = customerID;
    this.payReservationForm.patchValue({
      amount: amount
    });
    this.ReturnPaymentMethods();
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

      //alert('Data:' + JSON.stringify(data) + 'Booking ID:' + bookingID + ' CustomerID:' + customerID);
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
  closeMakeReserve() {
    this.makereservemodal.nativeElement.close();
  }
}
