import React, { useState } from 'react';
import { PricingRequest, User } from '../types';
import { Search, Filter, Plus, Check, X, User as UserIcon, Send, AlertCircle, Edit2, Save, XCircle } from 'lucide-react';

interface WorkflowBoardProps {
  currentUser: User;
  requests: PricingRequest[];
  onUpdateStatus: (id: string, newStatus: PricingRequest['status'], analystId?: string) => void;
  onCreateRequest: (req: Omit<PricingRequest, 'id' | 'submittedDate'>) => void;
  onUpdateRequest: (updatedReq: PricingRequest) => void;
}

const StatusBadge: React.FC<{ status: PricingRequest['status'] }> = ({ status }) => {
  const colors = {
    'Draft': 'bg-gray-100 text-gray-700',
    'Sales Review': 'bg-blue-100 text-blue-700',
    'Pricing Review': 'bg-[#FF6600]/10 text-[#FF6600]',
    'Approved': 'bg-purple-100 text-purple-700',
    'In Agreement': 'bg-indigo-100 text-indigo-700',
    'Published': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700'
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>{status}</span>;
};

const WorkflowBoard: React.FC<WorkflowBoardProps> = ({ currentUser, requests, onUpdateStatus, onCreateRequest, onUpdateRequest }) => {
  const [filter, setFilter] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<PricingRequest | null>(null);
  
  // New Request Form State
  const [newCustomer, setNewCustomer] = useState('');
  const [newValue, setNewValue] = useState(0);
  const [newRegion, setNewRegion] = useState('NAM');
  const [newType, setNewType] = useState<PricingRequest['type']>('New');

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.customerName.toLowerCase().includes(filter.toLowerCase()) || 
                          r.id.toLowerCase().includes(filter.toLowerCase());
    
    // Role-based visibility
    if (currentUser.role === 'SALES') {
        // Sales sees their own requests
        return matchesSearch && r.salesRepId === currentUser.id;
    } else {
        // Pricing sees requests not in Draft, or requests assigned to them
        return matchesSearch && r.status !== 'Draft'; 
    }
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRequest({
        customerName: newCustomer,
        value: newValue,
        region: newRegion,
        type: newType,
        status: 'Draft',
        salesRepId: currentUser.id
    });
    setShowNewForm(false);
    setNewCustomer('');
    setNewValue(0);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRequest) {
        onUpdateRequest(editingRequest);
        setEditingRequest(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Manager</h2>
          <p className="text-gray-500 text-sm mt-1">
            {currentUser.role === 'SALES' ? 'Manage your deal pipeline and submit to pricing.' : 'Review and approve incoming pricing requests.'}
          </p>
        </div>
        {currentUser.role === 'SALES' && (
            <button 
                onClick={() => setShowNewForm(!showNewForm)}
                className="bg-[#FF6600] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2"
            >
            <Plus size={18} /> New Request
            </button>
        )}
      </div>

      {/* Edit Modal */}
      {editingRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Edit Proposal: {editingRequest.id}</h3>
                    <button onClick={() => setEditingRequest(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <form onSubmit={handleEditSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Customer Name</label>
                        <input type="text" className="w-full p-2 border rounded-lg" value={editingRequest.customerName} onChange={e => setEditingRequest({...editingRequest, customerName: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Value ($)</label>
                            <input type="number" className="w-full p-2 border rounded-lg" value={editingRequest.value} onChange={e => setEditingRequest({...editingRequest, value: Number(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
                            <input type="text" className="w-full p-2 border rounded-lg" value={editingRequest.region} onChange={e => setEditingRequest({...editingRequest, region: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select 
                            className="w-full p-2 border rounded-lg bg-gray-50"
                            value={editingRequest.status}
                            onChange={e => setEditingRequest({...editingRequest, status: e.target.value as any})}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Sales Review">Sales Review</option>
                            <option value="Pricing Review">Pricing Review</option>
                            <option value="Approved">Approved</option>
                            <option value="In Agreement">In Agreement</option>
                            <option value="Published">Published</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    
                    {/* Agreement Fields */}
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Service Level (For Agreement)</label>
                        <select 
                             className="w-full p-2 border rounded-lg"
                             value={editingRequest.serviceLevel || ''}
                             onChange={e => setEditingRequest({...editingRequest, serviceLevel: e.target.value})}
                        >
                             <option value="">Select Service...</option>
                             <option value="Priority Overnight">Priority Overnight</option>
                             <option value="Standard Overnight">Standard Overnight</option>
                             <option value="Ground">Ground</option>
                             <option value="International Priority">International Priority</option>
                             <option value="Freight">Freight</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button type="submit" className="flex-1 bg-[#4D148C] text-white py-2 rounded-lg font-medium hover:bg-purple-800 flex items-center justify-center gap-2">
                            <Save size={18} /> Save Changes
                        </button>
                        <button type="button" onClick={() => setEditingRequest(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* New Request Form for Sales */}
      {showNewForm && currentUser.role === 'SALES' && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 animate-fade-in mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Create New Pricing Request</h3>
              <form onSubmit={handleSubmitNew} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Customer Name</label>
                      <input required type="text" className="w-full p-2 border rounded-lg text-sm" value={newCustomer} onChange={e => setNewCustomer(e.target.value)} />
                  </div>
                  <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Est. Value ($)</label>
                      <input required type="number" className="w-full p-2 border rounded-lg text-sm" value={newValue} onChange={e => setNewValue(Number(e.target.value))} />
                  </div>
                  <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select className="w-full p-2 border rounded-lg text-sm" value={newType} onChange={e => setNewType(e.target.value as any)}>
                          <option>New</option>
                          <option>Renewal</option>
                          <option>Spot Quote</option>
                      </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-[#4D148C] text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-800">Create Draft</button>
                    <button type="button" onClick={() => setShowNewForm(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                  </div>
              </form>
          </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Customer or ID..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C] focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Request Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">Request ID</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">Customer</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">Owner</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">Region</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">Est. Value</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">Status</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors group">
                <td className="py-4 px-6 text-sm font-medium text-[#4D148C]">{req.id}</td>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium">{req.customerName}</td>
                <td className="py-4 px-6 text-sm text-gray-500 flex items-center gap-2">
                    {req.pricingAnalystId ? (
                         <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full text-xs">
                            <UserIcon size={12} /> {req.pricingAnalystId}
                         </span>
                    ) : (
                        <span className="text-gray-400 text-xs italic">Unassigned</span>
                    )}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">{req.region}</td>
                <td className="py-4 px-6 text-sm text-gray-900 text-right font-mono">${req.value.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <StatusBadge status={req.status} />
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => setEditingRequest(req)}
                        className="text-gray-500 hover:text-[#4D148C] px-2 py-1 rounded-md"
                        title="Edit Proposal"
                    >
                        <Edit2 size={16} />
                    </button>

                    {/* SALES ACTIONS */}
                    {currentUser.role === 'SALES' && req.status === 'Draft' && (
                        <button 
                            onClick={() => onUpdateStatus(req.id, 'Sales Review')}
                            className="text-white bg-[#4D148C] hover:bg-purple-800 px-3 py-1 rounded-md text-xs flex items-center gap-1"
                        >
                            Submit <Send size={12} />
                        </button>
                    )}
                    
                    {/* PRICING ACTIONS */}
                    {currentUser.role === 'PRICING' && (
                        <>
                            {req.status === 'Sales Review' && (
                                <button 
                                    onClick={() => onUpdateStatus(req.id, 'Pricing Review', currentUser.id)}
                                    className="text-white bg-[#FF6600] hover:bg-orange-600 px-3 py-1 rounded-md text-xs"
                                >
                                    Start Review
                                </button>
                            )}
                            {req.status === 'Pricing Review' && req.pricingAnalystId === currentUser.id && (
                                <>
                                    <button 
                                        onClick={() => onUpdateStatus(req.id, 'Approved')}
                                        className="text-green-700 bg-green-100 hover:bg-green-200 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                                    >
                                        <Check size={14} />
                                    </button>
                                    <button 
                                        onClick={() => onUpdateStatus(req.id, 'Rejected')}
                                        className="text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            )}
                        </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRequests.length === 0 && (
            <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                <AlertCircle size={48} className="mb-4 opacity-20" />
                <p>No active requests found for your queue.</p>
                {currentUser.role === 'SALES' && <p className="text-sm mt-2">Create a new request to get started.</p>}
            </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBoard;