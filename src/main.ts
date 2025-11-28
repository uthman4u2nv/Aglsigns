import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';

import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { provideServiceWorker } from '@angular/service-worker';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule, AppRoutingModule, GoogleMapsModule), provideAnimations(), provideHttpClient(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })]
}).catch((err) => console.error(err));
