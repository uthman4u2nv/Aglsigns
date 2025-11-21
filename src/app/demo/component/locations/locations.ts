import { Component, inject, ViewChild, ElementRef, Input } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { Dashboard } from 'src/app/services/dashboard';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase';

@Component({
  selector: 'app-locations',
  imports: [CardComponent, CurrencyPipe, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './locations.html',
  styleUrl: './locations.scss'
})
export class Locations {
  sites = [];
  customers = [];
  locationname = '';
  paymentmethods = [];
  paymentmethod = 0;
  methodName;
  '';
  transID = '';
  transDate = '';
  customerName = '';
  customerAddress = '';
  customerEmail = '';
  customerPhone = '';
  startDate = '';
  endDate = '';
  totalAmount = 0;
  base64: any = '';
  totalPaid = 0;
  totalBalance = 0;
  selectedFile!: File;
  uploadedUrl = '';
  display: boolean = false;
  success: boolean = false;
  failed: boolean = false;
  siteid = '';
  site = {
    sitename: '',
    address: '',
    size: '',
    gps: '',
    status: '',
    price: null
  };

  loading = false;
  message = '';
  siteForm = this.fb.group({
    sitename: ['', Validators.required],
    address: ['', [Validators.required, Validators.minLength(5)]],
    size: [null, [Validators.required, Validators.min(1)]],
    gps: ['', Validators.required],
    status: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0)]]
  });
  editSiteForm = this.fb.group({
    sitename: ['', Validators.required],
    address: ['', [Validators.required, Validators.minLength(5)]],
    size: [null, [Validators.required, Validators.min(1)]],
    gps: ['', Validators.required],
    status: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0)]],
    siteid: [null, [Validators.required]]
  });
  bookingsForm = this.fb.group({
    customerID: ['', Validators.required],
    // sitesID: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0)]],
    agreedprice: [null, [Validators.required, Validators.min(0)]],
    paid: [null, [Validators.required, Validators.min(0)]],
    //balance: [null, [Validators.required, Validators.min(0)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    paymentMethod: [null, [Validators.required, Validators.min(0)]]
  });

  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('editmodal') editmodal!: ElementRef<HTMLDialogElement>;
  @ViewChild('addmodal') addmodal!: ElementRef<HTMLDialogElement>;
  @ViewChild('receiptmodal') receiptmodal!: ElementRef<HTMLDialogElement>;
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private ds: Dashboard,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private supabase: SupabaseService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private fb: FormBuilder
  ) {
    this.ReturnallSites();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /*onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }*/
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
  ReturnallSites() {
    this.ds.ReturnAllSites().subscribe((d) => {
      this.sites = d;
    });
  }
  ReturnAllCustomers() {
    this.ds.ReturnAllCustomers().subscribe((d) => {
      this.customers = d;
    });
  }
  ReturnPaymentMethods() {
    this.ds.ReturnAllPaymentMethods().subscribe((d) => {
      this.paymentmethods = d;
    });
  }
  OpenLocationDetails() {
    this.modal.nativeElement.showModal();
  }
  OpenEdit(name, location, size, gps, price, status, siteid) {
    this.editmodal.nativeElement.showModal();
    this.editSiteForm.patchValue({
      sitename: name,
      address: location,
      size: size,
      gps: gps,
      price: price,
      status: status,
      siteid: siteid
    });
  }

  OpenAddReservation(name, location, size, gps, price, status, siteid) {
    this.addmodal.nativeElement.showModal();
    this.locationname = name;
    this.siteid = siteid;
    this.ReturnAllCustomers();
    this.ReturnPaymentMethods();
    this.bookingsForm.patchValue({
      price: price
    });
  }
  async makeReservation() {
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
        customerID: this.bookingsForm.value.customerID || '',
        sitesID: this.siteid || '',
        price: this.bookingsForm.value.price || 0,
        agreedprice: this.bookingsForm.value.agreedprice || 0,
        paid: this.bookingsForm.value.paid || 0,
        balance: parseFloat(this.bookingsForm.value.agreedprice) - parseFloat(this.bookingsForm.value.paid) || 0,
        startDate: this.bookingsForm.value.startDate || '',
        endDate: this.bookingsForm.value.endDate || '',
        enteredBy: localStorage.getItem('email'),
        paymentMethod: this.bookingsForm.value.paymentMethod || 0
      };
      //alert('Bookings Data:' + JSON.stringify(data));
      const result = await this.supabase.MakeReservations(data);
      //alert('Result:' + JSON.stringify(result));
      if (result != null) {
        //alert('Payment Methods:' + data.paymentMethod + ' All' + JSON.stringify(this.paymentmethods));
        //alert('Customers:' + data.customerID + ' All' + JSON.stringify(this.customers));
        this.totalAmount = data.agreedprice;
        this.totalPaid = data.paid;
        this.totalBalance = data.balance;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.methodName = this.paymentmethods.find((m) => m.id === data.paymentMethod)?.name;
        this.customerName = this.customers.find((m) => m.customerID === data.customerID)?.name;
        this.customerAddress = this.customers.find((m) => m.customerID === data.customerID)?.address;
        this.customerEmail = this.customers.find((m) => m.customerID === data.customerID)?.email;
        this.customerPhone = this.customers.find((m) => m.customerID === data.customerID)?.phone;
        this.transDate = result[0].created_at;
        this.message = 'Booking successfull';
        this.success = true;
        await this.upload(result[0].transid);
        this.ReturnallSites();
        this.addmodal.nativeElement.close();
        this.receiptmodal.nativeElement.showModal();
        this.transID = result[0].transid;
      } else {
        this.message = 'Booking Failed';
        this.ReturnallSites();
        this.failed = true;
      }
      this.loading = false;
    }
  }
  get f() {
    return this.siteForm.controls;
  }
  get e() {
    return this.editSiteForm.controls;
  }
  get g() {
    return this.bookingsForm.controls;
  }
  submitForm() {
    //alert(JSON.stringify(this.siteForm.value.price || ''));
    if (this.siteForm.invalid) {
      this.siteForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const data = {
      sitename: this.siteForm.value.sitename || '',
      address: this.siteForm.value.address || '',
      size: this.siteForm.value.size || '',
      gps: this.siteForm.value.gps || '',
      price: this.siteForm.value.price || 0,
      status: parseInt(this.siteForm.value.status)
    };
    this.ds.addLocation(data).subscribe({
      next: (res) => {
        console.log('Status code:', res.status);
        this.ReturnallSites();
        this.message = 'Site information saved successfully!';
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
    if (this.editSiteForm.invalid) {
      this.editSiteForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const data = {
      sitename: this.editSiteForm.value.sitename || '',
      address: this.editSiteForm.value.address || '',
      size: this.editSiteForm.value.size || '',
      gps: this.editSiteForm.value.gps || '',
      price: this.editSiteForm.value.price || 0,
      status: parseInt(this.editSiteForm.value.status)
    };
    this.ds.updateLocation(data, this.editSiteForm.value.siteid).subscribe({
      next: (res) => {
        console.log('Status code:', res.status);
        this.ReturnallSites();
        this.message = 'Site information updated successfully!';
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

  close() {
    this.modal.nativeElement.close();
  }
  closeEdit() {
    this.editmodal.nativeElement.close();
  }
  closeAddReservation() {
    this.addmodal.nativeElement.close();
  }
  closeReceipt() {
    this.receiptmodal.nativeElement.close();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPrint(divName: any) {
    const printContents = document.getElementById(divName).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }
}

interface LocationReq {
  sitename: string;
  address: string;
  size: string;
  gps: string;
  price: number;
  status: number;
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
}
