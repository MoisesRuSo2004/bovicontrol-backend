export class CreateClientDto {
  // Finca
  farmName: string;
  farmLocation?: string;
  farmDepartment?: string;
  farmPhone?: string;
  farmEmail?: string;
  farmNotes?: string;
  // Usuario admin de la finca
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  password: string;
  phone?: string;
  // Suscripción (null = sin límite)
  subscriptionMonths?: number;
}
