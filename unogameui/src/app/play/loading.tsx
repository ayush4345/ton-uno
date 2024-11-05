import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="loading-container">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Creating...</p>
        </div>
    );
};

export default Loading;