import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { CalendarModule } from 'primeng/calendar';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss']
})
export class AppointmentModalComponent {
  @Output() closed = new EventEmitter<void>();
  show = false;
  form: FormGroup;
  idTypes = [{ label: 'CI', value: 'CI' }, { label: 'RUC', value: 'RUC' }];
  services: any[] = [];
  provinces: any[] = [];
  cities: any[] = [];
  agencies: any[] = [];
  availableHours: any[] = [];

  numA!: number;
  numB!: number;
  captchaInvalid = false;

  feriadosAjustados: any[] = [];

  constructor(private fb: FormBuilder, private svc: AppointmentService) {
    this.form = this.fb.group({
      idType: ['ID', Validators.required],
      idNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
      names: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      service: [null, Validators.required],
      province: [null, Validators.required],
      city: [null, Validators.required],
      agency: [null, Validators.required],
      date: [null, Validators.required],
      hour: ['', Validators.required],
      captcha: ['', Validators.required]
    });
  }

  async open() {
    this.form.get('province')?.disable();
    this.form.get('agency')?.disable();
    this.form.get('date')?.disable();
    this.form.get('hour')?.disable();
    this.show = true;
    this.generateCaptcha();
    try {
      const services = await this.svc.getServices();
      this.services = services.map(s => ({
        label: s.nome,
        value: s.id,
        image: s.image,
        color: s.color,
        descripcion: s.descricao
      }));
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  }

  generateCaptcha() {
    this.numA = Math.floor(Math.random() * 10) + 1;
    this.numB = Math.floor(Math.random() * 10) + 1;
    this.captchaInvalid = false;
  }

  close() {
    this.resetForm();
    this.show = false;
    this.closed.emit();
  }

  resetForm() {
    this.form.reset({
      idType: 'ID'
    });
    this.generateCaptcha();
    this.captchaInvalid = false;
    this.provinces = [];
    this.agencies = [];
    // Limpiar combo de horas y lista
    this.form.get('hour')?.setValue(null);
    this.availableHours = [];
  }

  async onService() {
    const serv = this.form.value.service;
    if (!serv) return;
    try {
      const provinces = await this.svc.getProvinces(serv);
      this.provinces = provinces.map(p => p);
      this.form.get('province')?.enable();
    } catch (err) {
      console.error("Error provincias:", err);
    }
  }

  getSelectedServiceDescription(): string {
    const selected = this.services.find(s => s.value === this.form.value.service);
    return selected ? selected.descripcion : '';
  }

  async onProvinceChange() {
    const prov = this.form.value.province;
    const serv = this.form.value.service;
    try {
      const agencies = await this.svc.getAgencies(prov, serv);
      this.agencies = agencies.map(a => ({ label: a.nome, value: a.id }));
      this.form.get('agency')?.enable();
    } catch (err) {
      console.error("Error agencias:", err);
    }
  }


  async onAgencyChange() {
    const agencyTemp = this.form.value.agency;
    try {
      if (agencyTemp || this.agencies.length > 0) {
        this.form.get('date')?.enable();
        this.obtenerFeriadosEcuador(2025);
      } else {
        return;
      };
    } catch (err) {
      console.error("Error agencias:", err);
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async onDateChange() {
    try {
      const hours = await this.svc.getAvailableHours(this.form.value.agency, this.form.value.date);
      console.log("hours", hours);
      // Convertir el objeto en un array [{label:'08:00', value:'08:00'}, ...]
      this.availableHours = Object.keys(hours as { [key: string]: any })
        .filter((h: any) => hours[h].enabled)
        .map((h) => ({ label: h, value: h }));
      this.form.get('hour')?.enable();
    } catch (err) {
      console.error("Error agencias:", err);
    }
  }


  async submit() {
    // Validar formulario
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // return;
    }

    // Validar captcha
    const captchaValue = parseInt(this.form.value.captcha, 10);
    if (captchaValue !== this.numA + this.numB) {
      this.captchaInvalid = true;
      return;
    }

    // Validar fecha (no puede ser anterior a hoy)
    const selectedDate = moment(this.form.value.date);
    if (selectedDate.isBefore(moment(), 'day')) {
      Swal.fire({
        title: 'Error',
        text: 'No puede agendar una cita para una fecha pasada',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      // return;
    }

    // Validar cédula/RUC
    const customerDoc = this.form.value.idNumber;
    if (!customerDoc || isNaN(Number(customerDoc)) || (customerDoc.length < 10 || customerDoc.length > 13)) {
      Swal.fire({
        title: 'Error',
        text: 'Ingrese una cédula o RUC válido',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      //return;
    }

    // Validar email
    if (!this.validateEmail(this.form.value.email)) {
      Swal.fire({
        title: 'Error',
        text: 'Ingrese un email válido',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      // return;
    }

    // Validar celular
    const customerMobile = this.form.value.cellphone;
    if (!customerMobile || isNaN(Number(customerMobile)) || customerMobile.length !== 10 || customerMobile.charAt(0) !== '0') {
      Swal.fire({
        title: 'Error',
        text: 'Ingrese un celular válido de 10 dígitos que comience con 0',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      // return;
    }

    // Mostrar confirmación
    const result = await Swal.fire({
      title: 'Atención',
      text: '¿Está seguro de agendar la cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      reverseButtons: true
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      // Preparar datos para enviar
      const selectedAgency = this.agencies.find(a => a.value === this.form.value.agency);
      const agencyName = selectedAgency ? selectedAgency.label : '';

      const data = {
        unidade: this.form.value.agency,
        servico: this.form.value.service,
        cliente: {
          documento: this.form.value.idNumber,
          nome: this.form.value.names,
          email: this.form.value.email,
          telefone: this.form.value.cellphone
        },
        data: moment(this.form.value.date).format('YYYY-MM-DD'),
        hora: moment(this.form.value.time).format('HH:mm')
      };

      console.log("Datos enviados:", data);

      // Enviar al servidor (simulado - reemplaza con tu API real)
      const response = await this.svc.scheduleAppointment(data);
      console.log("Response enviados:", response.data);
      if (response.data.pending) {
        let a = response.data.agendamento;
        response.message = "Ya tiene una cita pendiente para el " + a.data + " a las " + a.hora + " en " + a.unidade.nome;
        Swal.fire({
          title: 'Error',
          text: response.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        return;
      } else {
        if (response.success) {
          // Mostrar mensaje de éxito
          Swal.fire({
            title: '¡Éxito!',
            html: `
              <div class="compact-alert" style="text-align: left;">
                <p><strong>Identificación:</strong> ${data.cliente.documento}</p>
                <h3>Atención</h3>
                <p>Tu cita ha sido generada con éxito y enviada a tu correo electrónico, recuerda acudir puntualmente, seguir los protocolos de bioseguridad para prevenir un posible contagio y llevar tu cédula de identidad de manera obligatoria.</p>  //TODO hacerlo dimamico 
                <h4>Datos del agendamiento:</h4>
                <p><strong>CI:</strong> ${data.cliente.documento}</p>
                <p><strong>Nombres:</strong> ${data.cliente.nome}</p>
                <p><strong>Email:</strong> ${data.cliente.email}</p>
                <p><strong>Celular:</strong> ${data.cliente.telefone}</p>
                <p><strong>Provincia:</strong> ${this.form.value.province}</p>
                <p><strong>Agencia:</strong> ${agencyName}</p>
                <p><strong>Servicio:</strong> ${this.services.find(s => s.value === data.servico)?.label}</p>
                <p><strong>Fecha:</strong> ${data.data}</p>
                <p><strong>Hora:</strong> ${data.hora}</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'OK',
            width: 500,
            padding: '15px',
            customClass: {
              popup: 'swal2-popup',
              title: 'swal2-title',
              htmlContainer: 'swal2-html-container',
              confirmButton: 'swal2-confirm'
            },
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });

          this.resetForm();
          this.close();
        } else {
          throw new Error(response.message || 'Error al agendar la cita');
        }
      }
    } catch (err: any) {
      console.error('Error al enviar:', err);

      Swal.fire({
        title: 'Error',
        text: err.message || 'Ocurrió un error al agendar la cita. Por favor, intente nuevamente.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  }

  async obtenerFeriadosEcuador(anio: number) {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${anio}/EC`);
    const data = await response.json();
    // Ajustamos todos los feriados y convertimos a Date
    this.feriadosAjustados = data.map((feriado: any) => {
      const fechaAjustada = this.ajustarFeriado(feriado.date);
      return new Date(fechaAjustada);  // ⬅️ aquí convertimos a Date
    });
    console.log("Feriados Ajustados:", this.feriadosAjustados);
  }


  ajustarFeriado(fecha: string): string {
    const feriado = new Date(fecha);
    const diaSemana = feriado.getDay(); // 0=domingo, 1=lunes, ..., 6=sábado
    // Copiamos la fecha para no modificar el objeto original
    let fechaAjustada = new Date(feriado);
    if (diaSemana === 0) {
      // Domingo -> Lunes siguiente
      fechaAjustada.setDate(feriado.getDate() + 1);
    } else if (diaSemana === 6) {
      // Sábado -> Viernes anterior
      fechaAjustada.setDate(feriado.getDate() - 1);
    } else if (diaSemana === 2) {
      // Martes -> Lunes
      fechaAjustada.setDate(feriado.getDate() - 1);
    } else if (diaSemana === 3 || diaSemana === 4) {
      // Miércoles o jueves -> Viernes
      fechaAjustada.setDate(feriado.getDate() + (5 - diaSemana));
    }
    return fechaAjustada.toISOString().split('T')[0]; // Devuelve en formato YYYY-MM-DD
  }
}