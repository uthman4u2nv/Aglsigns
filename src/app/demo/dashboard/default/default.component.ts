// angular import
import { Component, inject, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import tableData from 'src/fake-data/default-data.json';

//import { MonthlyBarChartComponent } from 'src/app/theme/shared/apexchart/monthly-bar-chart/monthly-bar-chart.component';
//import { IncomeOverviewChartComponent } from 'src/app/theme/shared/apexchart/income-overview-chart/income-overview-chart.component';
//import { AnalyticsChartComponent } from 'src/app/theme/shared/apexchart/analytics-chart/analytics-chart.component';
//import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';

// icons
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { Dashboard } from 'src/app/services/dashboard';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    CardComponent,
    IconDirective,
    GoogleMap

    //MonthlyBarChartComponent,
    //IncomeOverviewChartComponent,
    //AnalyticsChartComponent,
    //SalesReportChartComponent
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  private iconService = inject(IconService);
  totalSites: number = 0;
  totalCustomers: number = 0;
  totalBookings: number = 0;
  totalPayment: number = 0;
  sites = [];
  last5bookings: any = [];
  @Input() lat = 0;
  @Input() lng = 0;

  zoom = 14;
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  name = '';
  address = '';
  size = '';
  gps = '';
  price = '';
  status = '';
  date = '';
  // constructor
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private ds: Dashboard) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
    this.CountSites();
    this.CountCustomers();
    this.CountBookings();
    this.ReturnallSites();
    this.ReturnLast5Bookings();
  }
  get center() {
    return { lat: this.lat, lng: this.lng };
  }
  OpenLocationDetails(name, location, size, gps, price, status, date) {
    this.modal.nativeElement.showModal();
    this.name = name;
    this.address = location;
    this.size = size;
    this.gps = gps;
    this.price = price;
    this.status = status;
    this.date = date;

    const parts = gps.split(',');

    this.lat = parseFloat(parts[0]);
    this.lng = parseFloat(parts[1]);
    //alert('Lat:' + this.lat + ' Long:' + this.lng);
  }

  close() {
    this.modal.nativeElement.close();
  }

  recentOrder = tableData;

  /*AnalyticEcommerce = [
    {
      title: 'Total Page Views',
      amount: '4,42,236',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '59.3%',
      color: 'text-primary',
      number: '35,000'
    },
    {
      title: 'Total Users',
      amount: '78,250',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '70.5%',
      color: 'text-primary',
      number: '8,900'
    },
    {
      title: 'Total Order',
      amount: '18,800',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'fall',
      percentage: '27.4%',
      color: 'text-warning',
      number: '1,943'
    },
    {
      title: 'Total Sales',
      amount: '$35,078',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'fall',
      percentage: '27.4%',
      color: 'text-warning',
      number: '$20,395'
    }
  ];*/

  /*AnalyticEcommerce = [
    {
      title: 'Total Locations',
      amount: this.CountSites(),
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '59.3%',
      color: 'text-primary',
      number: '35,000'
    },
    {
      title: 'Total Users',
      amount: '78,250',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '70.5%',
      color: 'text-primary',
      number: '8,900'
    },
    {
      title: 'Total Order',
      amount: '18,800',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'fall',
      percentage: '27.4%',
      color: 'text-warning',
      number: '1,943'
    },
    {
      title: 'Total Sales',
      amount: '$35,078',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'fall',
      percentage: '27.4%',
      color: 'text-warning',
      number: '$20,395'
    }
  ];*/

  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'gift',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'message',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'setting',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    }
  ];

  CountSites(): number {
    let count = 0;
    this.ds.CountSites().subscribe((d) => {
      //alert('Count' + JSON.stringify(d[0].count));
      count = d[0].count;
      this.totalSites = count;
    });
    return count;
  }

  CountCustomers() {
    //let count = 0;
    this.ds.CountCustomers().subscribe((d) => {
      //alert('Count' + JSON.stringify(d[0].count));
      //count = d[0].count;
      this.totalCustomers = d[0].count;
    });
    // return count;
  }

  CountBookings() {
    //let count = 0;
    this.ds.CountBookings().subscribe((d) => {
      //alert('Count' + JSON.stringify(d[0].count));
      //count = d[0].count;
      this.totalBookings = d[0].count;
    });
    //return count;
  }

  TotalPayment() {
    //let count = 0;
    this.ds.TotalPayment().subscribe((d) => {
      this.totalPayment = d[0].count;
    });
    //return count;
  }

  ReturnallSites() {
    this.ds.ReturnAllSites().subscribe((d) => {
      this.sites = d;
    });
  }

  ReturnLast5Bookings() {
    this.ds.ReturnLastFiveBookings().subscribe((d) => {
      this.last5bookings = d;
    });
  }
}
