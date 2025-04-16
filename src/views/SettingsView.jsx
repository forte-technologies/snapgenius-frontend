import React from 'react';
import PropTypes from 'prop-types';

function SettingsView({ user }) {
    return (
        <div className="p-4 md:p-6 h-full overflow-y-auto text-zinc-200">
            <div className="bg-zinc-800 shadow-lg rounded-lg p-4 md:p-6 max-w-md mx-auto">
                <h2 className="text-lg font-medium text-zinc-100 mb-4 border-b border-zinc-700 pb-2">Settings</h2>
                
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Email:</span>
                        <span className="font-medium text-zinc-100">{user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Status:</span>
                        <span className="inline-flex items-center rounded-full bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                             {user?.isAuthenticated ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    {/* Add more settings options here if needed in the future */}
                </div>
            </div>
        </div>
    );
}

SettingsView.propTypes = {
    user: PropTypes.shape({
        email: PropTypes.string,
        isAuthenticated: PropTypes.bool
    })
};

export default SettingsView; 