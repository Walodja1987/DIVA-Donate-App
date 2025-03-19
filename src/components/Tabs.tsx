import { useWallets } from '@privy-io/react-auth';
import { useState } from 'react';
import { AdminTab } from './AdminTab.js';
import { ADMIN_ADDRESS } from '../constants';

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState('main');
  const { wallets } = useWallets();
  const connectedAddress = wallets[0]?.address?.toLowerCase();
  
  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <a
            href="#"
            className={`
              whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
              ${
                activeTab === 'main'
                  ? 'border-[#042940] text-[#042940]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
            onClick={() => setActiveTab('main')}
          >
            Main
          </a>
          
          {/* Only show admin tab for admin address */}
          {connectedAddress === ADMIN_ADDRESS && (
            <a
              href="#"
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                ${
                  activeTab === 'admin'
                    ? 'border-[#042940] text-[#042940]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              `}
              onClick={() => setActiveTab('admin')}
            >
              Create Pool
            </a>
          )}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'admin' && <AdminTab />}
      {/* Other tab contents */}
    </div>
  );
}; 