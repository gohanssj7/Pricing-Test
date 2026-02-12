export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  WORKFLOW = 'WORKFLOW',
  PRICING_ENGINE = 'PRICING_ENGINE',
  ANALYSIS = 'ANALYSIS',
  AGREEMENTS = 'AGREEMENTS'
}

export type UserRole = 'SALES' | 'PRICING';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string; // initials
}

export interface PricingRequest {
  id: string;
  customerName: string;
  status: 'Draft' | 'Sales Review' | 'Pricing Review' | 'Approved' | 'In Agreement' | 'Published' | 'Rejected';
  type: 'New' | 'Renewal' | 'Spot Quote';
  value: number;
  submittedDate: string;
  region: string;
  salesRepId: string;
  pricingAnalystId?: string;
  comments?: { user: string; text: string; date: string }[];
  // Agreement specific fields
  effectiveDate?: string;
  expirationDate?: string;
  serviceLevel?: string;
}

export interface SensitivityData {
  discount: number;
  margin: number;
  volume: number;
  revenue: number;
}

export interface AnalysisResult {
  recommendation: string;
  riskAssessment: string;
  projectedMargin: string;
  sensitivityData: SensitivityData[];
}

export interface Agreement {
  id: string;
  customer: string;
  effectiveDate: string;
  expirationDate: string;
  status: 'Active' | 'Expired' | 'Pending';
  serviceLevel: string;
}