import React from 'react';
import { LayoutDashboard, GitPullRequest, Calculator, TrendingUp, FileText, Settings, Package, Users } from 'lucide-react';
import { ViewState, User } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  currentUser: User;
  users: User[];
  onSwitchUser: (userId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentUser, users, onSwitchUser }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.WORKFLOW, label: 'Workflow Manager', icon: GitPullRequest },
    { id: ViewState.PRICING_ENGINE, label: 'Pricing Engine', icon: Calculator },
    { id: ViewState.ANALYSIS, label: 'Predictive Analysis', icon: TrendingUp },
    { id: ViewState.AGREEMENTS, label: 'Agreements', icon: FileText },
  ];

  const salesUsers = users.filter(u => u.role === 'SALES');
  const pricingUsers = users.filter(u => u.role === 'PRICING');

  return (
    <div className="w-64 bg-[#4D148C] text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 flex items-center gap-3 border-b border-purple-800">
        <Package className="h-8 w-8 text-[#FF6600]" />
        <div>
          <h1 className="font-bold text-lg tracking-wide">Pricing Org</h1>
          <p className="text-xs text-purple-300">Command Center</p>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-colors duration-200 ${
                isActive 
                  ? 'bg-purple-800 border-r-4 border-[#FF6600] text-white' 
                  : 'text-purple-200 hover:bg-purple-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Switcher Section */}
      <div className="p-4 border-t border-purple-800 bg-purple-900/50">
        <div className="mb-2 flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider">
            <Users size={12} /> Switch User Role
        </div>
        <select 
            className="w-full bg-purple-800 text-white text-sm rounded p-2 border border-purple-600 focus:outline-none focus:border-[#FF6600]"
            value={currentUser.id}
            onChange={(e) => onSwitchUser(e.target.value)}
        >
            <optgroup label="Sales Team">
                {salesUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </optgroup>
            <optgroup label="Pricing Team">
                {pricingUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </optgroup>
        </select>
      </div>

      <div className="p-4 border-t border-purple-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#FF6600] flex items-center justify-center font-bold text-white text-sm shadow-md">
            {currentUser.avatar}
          </div>
          <div>
            <p className="text-sm font-bold truncate w-32">{currentUser.name}</p>
            <p className="text-xs text-purple-300 flex items-center gap-1">
                {currentUser.role === 'SALES' ? 'Sales Representative' : 'Pricing Analyst'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;