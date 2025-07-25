import { apiService } from './api';

export interface CompanyAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Company {
  _id: string;
  name: string;
  address: CompanyAddress;
  phone: string;
  email: string;
  website: string;
  logo: string;
  taxId: string;
  registrationNumber: string;
  location: string;
  owner: string;
}

class CompanyService {
  // Get current company information
  // async getCurrentCompany(): Promise<Company> {
  //   return apiService.get<Company>('/companies/current');
  // }
}

export const companyService = new CompanyService(); 