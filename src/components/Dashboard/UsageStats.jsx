import React from 'react';
import { Link } from 'react-router-dom';

interface UsageStatsProps {
  usage: number;
  limit: number | null;
  isPremium: boolean;
}

const UsageStats: React.FC<UsageStatsProps> = ({ usage, limit, isPremium }) => {
  // Calculate percentage for progress bar
  const percentage = limit ? Math.min(Math.round((usage / limit) * 100), 100) : 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 w-full md:w-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isPremium ? 'Premium Usage' : 'Monthly Usage'}
        </h3>
        {!isPremium && limit && (
          <Link to="/pricing" className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Upgrade
          </Link>
        )}
      </div>
      
      <div className="mt-2 flex items-end justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">{usage}</span>
          {limit && (
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">/ {limit}</span>
          )}
        </div>
        
        {isPremium && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Unlimited
          </span>
        )}
      </div>
      
      {limit && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className={`h-2.5 rounded-full ${
                percentage < 70 
                  ? 'bg-green-500' 
                  : percentage < 90 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          {percentage >= 90 && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              Almost at limit! Upgrade for unlimited images.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UsageStats;
