import { Component, inject, ViewChild, ElementRef, Input } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { Dashboard } from 'src/app/services/dashboard';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase';

@Component({
  selector: 'app-transactions',
  imports: [CardComponent, CurrencyPipe, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions {
  sites = [];
  trans = [];
  customers = [];
  locationname = '';
  paymentmethods = [];
  paymentmethod = 0;
  methodName = '';
  amount = 0;
  transID = '';
  transDate = '';
  customerName = '';
  customerAddress = '';
  customerEmail = '';
  customerPhone = '';
  startDate = '';
  endDate = '';
  totalAmount = 0;
  totalPaid = 0;
  totalBalance = 0;
  selectedFile!: File;
  uploadedUrl = '';
  display: boolean = false;
  success: boolean = false;
  failed: boolean = false;
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
    this.ReturnAllTransactions();
    this.ReturnallCustomers();
  }

  async ReturnAllTransactions() {
    this.ds.ReturnAllTransactions().subscribe((d) => {
      //alert('Transactions:' + JSON.stringify(d));
      this.trans = d;
      this.totalPaid = this.trans.reduce((sum, t) => sum + Number(t.amount), 0);
    });
  }
  getTotalPaid(): number {
    return this.trans.reduce((sum, t) => sum + Number(t.amount), 0);
  }
  ReturnallCustomers() {
    this.ds.ReturnAllCustomers().subscribe((d) => {
      this.customers = d;
    });
  }
  closeReceipt() {
    this.receiptmodal.nativeElement.close();
  }

  OpenReceipt(transID, transDate, customerID, amount) {
    this.transID = transID;
    this.transDate = transDate;
    this.amount = amount;
    this.customerName = this.customers.find((m) => m.customerID === customerID)?.name;
    this.customerAddress = this.customers.find((m) => m.customerID === customerID)?.address;
    this.customerEmail = this.customers.find((m) => m.customerID === customerID)?.email;
    this.customerPhone = this.customers.find((m) => m.customerID === customerID)?.phone;
    this.receiptmodal.nativeElement.showModal();
  }
  onPrint(divName: any) {
    const printContents = document.getElementById(divName).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }
}
