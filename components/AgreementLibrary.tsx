import React, { useState } from 'react';
import { PricingRequest } from '../types';
import { Search, Download, Eye, FileText } from 'lucide-react';
import { jsPDF } from "jspdf";

interface AgreementLibraryProps {
    requests: PricingRequest[];
}

const AgreementLibrary: React.FC<AgreementLibraryProps> = ({ requests }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter requests that are in agreement phase or published
    const agreements = requests.filter(r => 
        (r.status === 'Published' || r.status === 'In Agreement' || r.status === 'Approved') &&
        (r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const generatePDF = (agr: PricingRequest) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(77, 20, 140); // #4D148C
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Pricing Agreement", 20, 25);
        doc.setFontSize(10);
        doc.text("FedEx Confidential", 170, 25);

        // Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`Agreement Reference: ${agr.id}`, 20, 60);
        
        doc.setFontSize(12);
        doc.text(`Customer: ${agr.customerName}`, 20, 75);
        doc.text(`Region: ${agr.region}`, 20, 85);
        doc.text(`Total Contract Value: $${agr.value.toLocaleString()}`, 20, 95);
        doc.text(`Status: ${agr.status}`, 20, 105);
        
        if (agr.serviceLevel) {
             doc.text(`Service Level: ${agr.serviceLevel}`, 20, 115);
        }

        doc.text(`Effective Date: ${agr.effectiveDate || new Date().toISOString().split('T')[0]}`, 20, 125);
        doc.text(`Expiration Date: ${agr.expirationDate || '2025-12-31'}`, 20, 135);

        // Body
        doc.setFontSize(10);
        doc.text("Terms and Conditions:", 20, 155);
        const dummyText = "This pricing agreement is entered into between FedEx and the Customer identified above. The rates and discounts set forth herein are confidential and subject to the Master Transportation Services Agreement. This agreement supersedes all prior agreements regarding the services specified.";
        const splitText = doc.splitTextToSize(dummyText, 170);
        doc.text(splitText, 20, 165);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 280);
        doc.text("Page 1 of 1", 180, 280);

        doc.save(`Agreement_${agr.id}.pdf`);
    };

    return (
        <div className="space-y-6">
             <div>
                <h2 className="text-2xl font-bold text-gray-900">Agreement Library</h2>
                <p className="text-gray-500 text-sm mt-1">Centralized repository for all pricing contracts and addendums.</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search agreements by customer, ID or service..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C]"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agreements.length === 0 && (
                    <div className="col-span-3 text-center p-12 text-gray-400">
                        No agreements found. Approve or Publish proposals to see them here.
                    </div>
                )}
                {agreements.map(agr => (
                    <div key={agr.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg text-[#4D148C]">
                                <FileText size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                agr.status === 'Published' ? 'bg-green-100 text-green-700' : 
                                agr.status === 'In Agreement' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                                {agr.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{agr.customerName}</h3>
                        <p className="text-xs text-gray-500 mb-4">{agr.id}</p>
                        
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Service:</span>
                                <span className="font-medium text-gray-900">{agr.serviceLevel || 'Standard'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Expires:</span>
                                <span className="font-medium text-gray-900">{agr.expirationDate || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2">
                                <Eye size={16} /> Preview
                            </button>
                            <button 
                                onClick={() => generatePDF(agr)}
                                className="flex-1 py-2 text-sm font-medium text-[#4D148C] bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Download size={16} /> PDF
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgreementLibrary;