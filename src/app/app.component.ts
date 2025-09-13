import { Component, ViewChild } from '@angular/core';
import { AppointmentModalComponent } from './components/appointment-modal/appointment-modal.component';
import { MyAppointmentsModalComponent } from './components/my-appointments-modal/my-appointments-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('appt') appt!: AppointmentModalComponent;
  @ViewChild('myappts') myappts!: MyAppointmentsModalComponent;

  openNew() { this.appt.open(); }
  openMy() { this.myappts.open(); }
}