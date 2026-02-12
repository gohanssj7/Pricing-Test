import React, { useState } from 'react';
import { Calculator, Save, RefreshCw } from 'lucide-react';

const PricingEngine: React.FC = () => {
    // Simplified State
    const [weight, setWeight] = useState(10);
    const [zone, setZone] = useState(5);
    const [baseRate, setBaseRate] = useState(15.50);
    const [discountType, setDiscountType] = useState<'Percentage' | 'Flat'>('Percentage');
    const [discountValue, setDiscountValue] = useState(15);
    
    // Calculation
    const calculatedRate = baseRate * (1 + (zone * 0.1)) * (weight * 0.05 + 1);
    const finalPrice = discountType === 'Percentage' 
        ? calculatedRate * (1 - discountValue / 100)
        : Math.max(0, calculatedRate - discountValue);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Rapid Pricing Calculator</h2>
                <p className="text-gray-500 text-sm mt-1">Quick quote generation for spot pricing and ad-hoc requests.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                <div className="p-8 md:w-2/3 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
                            <input 
                                type="number" 
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4D148C] outline-none transition-all"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zone (1-8)</label>
                            <input 
                                type="number" max={8} min={1}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4D148C] outline-none transition-all"
                                value={zone}
                                onChange={(e) => setZone(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Base Rate ($)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input 
                                type="number" 
                                className="w-full p-3 pl-7 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4D148C] outline-none transition-all"
                                value={baseRate}
                                onChange={(e) => setBaseRate(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <label className="block text-sm font-bold text-gray-900 mb-4">Discount Configuration</label>
                        <div className="flex gap-4 mb-4">
                            <button 
                                onClick={() => setDiscountType('Percentage')}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${discountType === 'Percentage' ? 'bg-[#4D148C] text-white' : 'bg-white border text-gray-600'}`}
                            >
                                Percentage Off (%)
                            </button>
                            <button 
                                onClick={() => setDiscountType('Flat')}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${discountType === 'Flat' ? 'bg-[#4D148C] text-white' : 'bg-white border text-gray-600'}`}
                            >
                                Flat Amount ($)
                            </button>
                        </div>
                        <input 
                            type="number" 
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4D148C] outline-none transition-all"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="bg-[#4D148C] text-white p-8 md:w-1/3 flex flex-col justify-between">
                    <div>
                        <h3 className="text-purple-200 uppercase text-xs font-bold tracking-wider mb-1">Estimated Rate</h3>
                        <div className="text-4xl font-bold mb-1">${finalPrice.toFixed(2)}</div>
                        <div className="text-purple-300 text-sm">Gross: ${calculatedRate.toFixed(2)}</div>
                    </div>

                    <div className="space-y-3">
                         <div className="flex justify-between text-sm text-purple-200 border-b border-purple-700 pb-2">
                            <span>Zone Factor</span>
                            <span>x{1 + (zone * 0.1)}</span>
                         </div>
                         <div className="flex justify-between text-sm text-purple-200 border-b border-purple-700 pb-2">
                            <span>Weight Factor</span>
                            <span>x{(weight * 0.05 + 1).toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between text-sm text-white font-bold pt-2">
                            <span>Total Discount</span>
                            <span>-${(calculatedRate - finalPrice).toFixed(2)}</span>
                         </div>
                    </div>

                    <div className="space-y-3 mt-8">
                        <button className="w-full py-3 bg-[#FF6600] hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors">
                            <Save size={18} /> Save Quote
                        </button>
                         <button className="w-full py-3 bg-purple-800 hover:bg-purple-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <RefreshCw size={18} /> Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingEngine;