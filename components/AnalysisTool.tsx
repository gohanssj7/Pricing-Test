import React, { useState, useEffect } from 'react';
import { analyzePricingSensitivity } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BrainCircuit, Loader2, Info } from 'lucide-react';

const AnalysisTool: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Form State
  const [baseRate, setBaseRate] = useState(25.00);
  const [discount, setDiscount] = useState(12);
  const [competitorRate, setCompetitorRate] = useState(22.50);
  const [volume, setVolume] = useState(50000);
  const [segment, setSegment] = useState('E-commerce Retail');

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzePricingSensitivity(baseRate, discount, competitorRate, volume, segment);
      setResult(data);
    } catch (err) {
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-6rem)] overflow-hidden">
      {/* Left Input Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 text-[#4D148C]">
            <BrainCircuit size={24} />
            <h2 className="text-xl font-bold">Predictive Modeling</h2>
        </div>
        
        <div className="space-y-5 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Segment</label>
            <select 
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#4D148C] outline-none"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
            >
              <option>E-commerce Retail</option>
              <option>Healthcare / Pharma</option>
              <option>Manufacturing</option>
              <option>High Tech</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Shipping Rate ($)</label>
            <input 
              type="number" 
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4D148C] outline-none"
              value={baseRate}
              onChange={(e) => setBaseRate(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Discount (%)</label>
            <input 
              type="range" 
              min="0" max="50"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6600]"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
            />
            <div className="text-right text-xs font-bold text-gray-600 mt-1">{discount}%</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Competitor Avg Rate ($)</label>
            <input 
              type="number" 
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4D148C] outline-none"
              value={competitorRate}
              onChange={(e) => setCompetitorRate(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Volume (Pkgs)</label>
            <input 
              type="number" 
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4D148C] outline-none"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-6 w-full py-3 bg-[#4D148C] hover:bg-purple-900 text-white rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Analyzing...
            </>
          ) : (
            'Run Sensitivity Analysis'
          )}
        </button>
      </div>

      {/* Right Output Panel */}
      <div className="lg:col-span-2 space-y-6 h-full overflow-y-auto">
        {!result ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <BrainCircuit size={48} className="mb-4 opacity-20" />
            <p>Configure model parameters and run analysis to see AI predictions.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in pb-10">
            {/* Recommendation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#4D148C] to-purple-900 text-white p-5 rounded-xl shadow-md">
                <h3 className="text-purple-200 text-xs uppercase font-bold tracking-wider mb-2">AI Recommendation</h3>
                <p className="text-lg font-medium leading-relaxed">{result.recommendation}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-xs uppercase font-bold tracking-wider">Projected Margin</h3>
                    <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">Healthy</span>
                 </div>
                 <p className="text-3xl font-bold text-gray-900">{result.projectedMargin}</p>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                <div className="flex items-start gap-3">
                    <Info className="text-[#FF6600] mt-0.5 flex-shrink-0" size={20} />
                    <div>
                        <h4 className="font-bold text-[#FF6600] text-sm">Risk Assessment</h4>
                        <p className="text-sm text-gray-800 mt-1">{result.riskAssessment}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Price Elasticity & Revenue Sensitivity</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="discount" 
                      label={{ value: 'Discount %', position: 'insideBottom', offset: -5 }} 
                      tickFormatter={(val) => `${val}%`}
                    />
                    <YAxis yAxisId="left" label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Margin %', angle: 90, position: 'insideRight' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#4D148C" name="Revenue" strokeWidth={3} dot={{r: 4}} />
                    <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#FF6600" name="Margin %" strokeWidth={3} dot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Volume Impact</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.sensitivityData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="discount" tickFormatter={(val) => `${val}%`} />
                     <YAxis />
                     <Tooltip cursor={{fill: 'transparent'}} />
                     <Bar dataKey="volume" fill="#9CA3AF" name="Proj. Volume" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisTool;