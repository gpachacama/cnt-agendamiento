import { appointmentData } from './../../models/appointmentData';
import { Component, EventEmitter, Output } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-my-appointments-modal',
  templateUrl: './my-appointments-modal.component.html',
  styleUrls: ['./my-appointments-modal.component.scss']
})
export class MyAppointmentsModalComponent {
  @Output() closed = new EventEmitter<void>();
  show = false;
  idNumber = '';
  results: appointmentData[] = [];

  // Variables para paginación
  paginatedResults: appointmentData[] = [];
  currentPage = 1;
  rowsPerPage = 5;
  totalRecords = 0;

  constructor(private svc: AppointmentService) { }

  open() {
    this.show = true;
    this.results = [];
    this.paginatedResults = [];
    this.idNumber = '';
    this.currentPage = 1;
    this.totalRecords = 0;
  }

  close() { this.show = false; this.closed.emit(); }

  async buscar() {
    if (!this.idNumber.trim()) {
      alert('Por favor, ingresa un número de documento.');
      return;
    }
    try {
      const data = await this.svc.searchByDocument(this.idNumber);
      this.results = data;
      this.totalRecords = this.results.length;
      this.updatePaginatedData();
      console.log("Resultados de búsqueda =>", this.results);
    } catch (err) {
      console.error('Error al buscar:', err);
      alert('Error al buscar. Verifica tu conexión o intenta más tarde.');
    }
  }

  limpiar() {
    this.idNumber = '';
    this.results = [];
    this.paginatedResults = [];
    this.currentPage = 1;
    this.totalRecords = 0;
  }

  // Métodos para paginación
  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.rowsPerPage = event.rows;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedResults = this.results.slice(startIndex, endIndex);
  }
}