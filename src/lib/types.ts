export type Asset = {
  id: string;
  name: string;
  location: 'Egypt' | 'Turkey';
  type: 'Apartment' | 'Villa' | 'Chalet' | 'Building' | 'Land' | 'Basement' | 'Administrative Unit' | 'Commercial Unit' | 'Hotel Unit' | 'Studio' | 'Cash' | 'Gold' | 'Receivable';
  rentalIncome: number; // in original currency
  marketValue: number; // in original currency
  currency: 'EGP' | 'USD' | 'KWD' | 'TRY';
};

export type Liability = {
  id: string;
  name: string;
  type: 'Real Estate' | 'Loan';
  totalAmount: number; // in original currency
  amountPaid: number; // in original currency
  monthlyInstallment: number; // in original currency
  currency: 'EGP' | 'KWD';
  dueDate: string;
};

export type UpcomingPayment = {
  id: string;
  name:string;
  amount: number; // in original currency
  currency: 'EGP' | 'KWD';
  dueDate: string;
};

export type UpcomingRent = {
  id: string;
  property: string;
  amount: number; // in original currency
  currency: 'EGP' | 'TRY';
  dueDate: string;
};

export type CashFlowItem = {
  name: string;
  amount: number; // in original currency
  currency: 'EGP' | 'KWD';
  type: 'Income' | 'Expense';
  category: 'Salary' | 'Rental' | 'Household' | 'Installments' | 'Other';
};

export type Currency = 'EGP' | 'USD' | 'KWD' | 'TRY';

export type ExchangeRates = {
  [key in Currency]: number;
};
