import { Component, inject, ViewChild, ElementRef, Input } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { Dashboard } from 'src/app/services/dashboard';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-locations',
  imports: [CardComponent, CurrencyPipe, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './locations.html',
  styleUrl: './locations.scss'
})
export class Locations {
  sites = [];
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

  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('editmodal') editmodal!: ElementRef<HTMLDialogElement>;
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private ds: Dashboard,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private fb: FormBuilder
  ) {
    this.ReturnallSites();
  }
  ReturnallSites() {
    this.ds.ReturnAllSites().subscribe((d) => {
      this.sites = d;
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
  get f() {
    return this.siteForm.controls;
  }
  get e() {
    return this.editSiteForm.controls;
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
}

interface LocationReq {
  sitename: string;
  address: string;
  size: string;
  gps: string;
  price: number;
  status: number;
}
