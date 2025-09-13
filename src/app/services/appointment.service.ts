import { Injectable } from '@angular/core';
import axios from 'axios';
import { Appointment } from '../models/appointment';
import { appointmentData } from '../models/appointmentData';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private API_BASE = 'http://127.0.0.1:8000/web/api';
  constructor() { }
  async createAppointment(appt: Appointment): Promise<any> {
    try {
      const response = await axios.post(`${this.API_BASE}/realizar/agendamento`, appt, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data; // Devuelve solo el JSON
    } catch (err) {
      console.error('Error en createAppointment:', err);
      throw err;
    }
  }

  async scheduleAppointment(data: any): Promise<any> {
    try {
      // Reemplaza con tu endpoint real de agendamiento
      const response = await axios.post(`${this.API_BASE}/realizar/agendamento`, data);
      return response.data;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  }

  async searchByDocument(documento: string): Promise<appointmentData[]> {
    try {
      const response = await axios.post(`${this.API_BASE}/cliente/agendamentos`, {
        cliente: { documento }
      });

      // Mapear la respuesta a la estructura esperada
      return response.data.data.map((item: any) => ({
        agency: item.unidade.nome,
        cellphone: item.cliente.telefone,
        service: item.servico.nome,
        date: item.data,
        time: item.hora,
        confirmation: item.dataConfirmacao ? 'Cita confirmada' : this.formatDate(item.data)
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  private formatDate(dateString: string): string {
    const today = new Date();
    const appointmentDate = new Date(dateString);

    if (appointmentDate.toDateString() === today.toDateString()) {
      return "Hoy";
    }

    return appointmentDate.toLocaleDateString();
  }

  async getServices(): Promise<any[]> {
    try {
      const response = await axios.post(`${this.API_BASE}/servicios`);
      return response.data.data;
    } catch (err) {
      console.error('Error en getServices:', err);
      throw err;
    }
  }

  async getProvinces(service: string): Promise<any[]> {
    try {
      const response = await axios.post(`${this.API_BASE}/provincias`, {
        service
      });
      console.log("getProvinces=> ", response.data.data);
      return response.data.data;
    } catch (err) {
      console.error('Error en getProvinces:', err);
      throw err;
    }
  }


  async getAgencies(provincia: string, service: string): Promise<any[]> {
    try {
      const response = await axios.post(`${this.API_BASE}/agencias`, {
        provincia,
        service
      })
      return response.data.data;
    } catch (err) {
      console.error('Error en getAgencies:', err);
      throw err;
    }
  }
}
