import React from 'react';

const Loader: React.FC = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-transparent border-solid rounded-full animate-spin" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
);

export default Loader;
