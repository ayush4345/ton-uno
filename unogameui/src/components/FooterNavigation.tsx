import Link from 'next/link';
import React from 'react';

const FooterNavigation: React.FC = () => {
    return (
        <div className="bg-gray-50 rounded-2xl shadow-md p-4 flex justify-around items-center w-full mx-auto">

            <div className="flex flex-col items-center text-gray-500">
                <span className="inline-flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full">
                    <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                </span>
                <span className="text-xs mt-2">Market</span>
            </div>

            <div className="h-8 border-r border-gray-300"></div>

            <div className="flex flex-col items-center text-gray-500">
                <span className="inline-flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full">
                    <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                </span>
                <span className="text-xs mt-2">Coins</span>
            </div>

            <div className="h-8 border-r border-gray-300"></div>

            <Link href="/profile">
                <div className="flex flex-col items-center text-gray-500">
                    <span className="inline-flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full">
                        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                        </svg>
                    </span>
                    <span className="text-xs mt-2">Profile</span>
                </div>
            </Link >
        </div>
    );
};

export default FooterNavigation;