export interface appointmentData {
    unidade: { nome: string };
    cliente: { telefone: string };
    servico: { nome: string };
    data: string;
    hora: string;
    dataConfirmacao: boolean;
}