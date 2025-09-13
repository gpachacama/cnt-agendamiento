import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentModalComponent } from './components/appointment-modal/appointment-modal.component';
import { MyAppointmentsModalComponent } from './components/my-appointments-modal/my-appointments-modal.component';
import { AppointmentService } from './services/appointment.service';

/* PrimeNG modules */
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import * as moment from 'moment';
@NgModule({
  declarations: [
    AppComponent,
    AppointmentModalComponent,
    MyAppointmentsModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    TableModule,
  ],
  providers: [AppointmentService],
  bootstrap: [AppComponent]
})
export class AppModule { }