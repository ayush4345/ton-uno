import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="h-screen w-screen">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Loading...</p>
        </div>
    );
};

export default Loading;