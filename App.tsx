import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WorkflowBoard from './components/WorkflowBoard';
import PricingEngine from './components/PricingEngine';
import AnalysisTool from './components/AnalysisTool';
import AgreementLibrary from './components/AgreementLibrary';
import { ViewState, User, PricingRequest } from './types';

// Mock Data Configuration
const USERS: User[] = [
    // 5 Sales Users
    { id: 'S1', name: 'Sarah Sales', role: 'SALES', avatar: 'SS' },
    { id: 'S2', name: 'Steve Seller', role: 'SALES', avatar: 'SS' },
    { id: 'S3', name: 'Sam Strategist', role: 'SALES', avatar: 'SS' },
    { id: 'S4', name: 'Sandy Spot', role: 'SALES', avatar: 'SS' },
    { id: 'S5', name: 'Saul Closer', role: 'SALES', avatar: 'SC' },
    // 5 Pricing Users
    { id: 'P1', name: 'Pat Pricing', role: 'PRICING', avatar: 'PP' },
    { id: 'P2', name: 'Penny Profit', role: 'PRICING', avatar: 'PP' },
    { id: 'P3', name: 'Peter Planner', role: 'PRICING', avatar: 'PP' },
    { id: 'P4', name: 'Polly Predictor', role: 'PRICING', avatar: 'PP' },
    { id: 'P5', name: 'Paul Process', role: 'PRICING', avatar: 'PP' },
];

const INITIAL_REQUESTS: PricingRequest[] = [
    { id: 'PR-2024-001', customerName: 'Globex Logistics', status: 'Sales Review', type: 'Renewal', value: 450000, submittedDate: '2023-10-24', region: 'APAC', salesRepId: 'S1', serviceLevel: 'International Priority' },
    { id: 'PR-2024-002', customerName: 'Soylent Corp', status: 'Draft', type: 'New', value: 120000, submittedDate: '2023-10-25', region: 'NAM', salesRepId: 'S1' },
    { id: 'PR-2024-003', customerName: 'Umbrella Inc', status: 'Pricing Review', type: 'Spot Quote', value: 25000, submittedDate: '2023-10-25', region: 'EMEA', salesRepId: 'S2', pricingAnalystId: 'P1' },
    { id: 'PR-2024-004', customerName: 'Initech', status: 'In Agreement', type: 'Renewal', value: 890000, submittedDate: '2023-10-23', region: 'NAM', salesRepId: 'S3', pricingAnalystId: 'P2', serviceLevel: 'Priority Overnight', effectiveDate: '2023-11-01', expirationDate: '2026-11-01' },
    { id: 'PR-2024-005', customerName: 'Cyberdyne', status: 'Published', type: 'New', value: 2100000, submittedDate: '2023-10-20', region: 'APAC', salesRepId: 'S1', pricingAnalystId: 'P1', serviceLevel: 'Ground', effectiveDate: '2023-10-20', expirationDate: '2025-10-20' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]); // Default to first Sales user
  const [requests, setRequests] = useState<PricingRequest[]>(INITIAL_REQUESTS);

  const handleSwitchUser = (userId: string) => {
    const user = USERS.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const handleCreateRequest = (newReq: Omit<PricingRequest, 'id' | 'submittedDate'>) => {
    const id = `PR-2024-${(requests.length + 1).toString().padStart(3, '0')}`;
    const req: PricingRequest = {
        ...newReq,
        id,
        submittedDate: new Date().toISOString().split('T')[0],
    };
    setRequests([req, ...requests]);
  };

  const handleUpdateStatus = (id: string, newStatus: PricingRequest['status'], analystId?: string) => {
    setRequests(requests.map(req => {
        if (req.id === id) {
            return {
                ...req,
                status: newStatus,
                pricingAnalystId: analystId || req.pricingAnalystId
            };
        }
        return req;
    }));
  };

  const handleUpdateRequest = (updatedReq: PricingRequest) => {
      setRequests(requests.map(req => req.id === updatedReq.id ? updatedReq : req));
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard requests={requests} />;
      case ViewState.WORKFLOW:
        return (
            <WorkflowBoard 
                currentUser={currentUser} 
                requests={requests} 
                onUpdateStatus={handleUpdateStatus}
                onCreateRequest={handleCreateRequest}
                onUpdateRequest={handleUpdateRequest}
            />
        );
      case ViewState.PRICING_ENGINE:
        return <PricingEngine />;
      case ViewState.ANALYSIS:
        return <AnalysisTool />;
      case ViewState.AGREEMENTS:
        return <AgreementLibrary requests={requests} />;
      default:
        return <Dashboard requests={requests} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        currentUser={currentUser}
        users={USERS}
        onSwitchUser={handleSwitchUser}
      />
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;