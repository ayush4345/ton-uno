import Link from 'next/link';
import React from 'react';
import { Coins, Joystick, Store, User2 } from 'lucide-react';

const FooterNavigation: React.FC = () => {
    return (
        <div className="bg-gray-50 rounded-2xl shadow-md p-4 flex justify-around items-center w-full mx-auto">

            <Link href="/play">
                <div className="flex flex-col items-center text-gray-500">
                    <span className="inline-flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full">
                        <Joystick className='text-[#000022]' />
                    </span>
                    <span className="text-xs mt-2 text-[#000022]">Play</span>
                </div>
            </Link>

            <div className="h-8 border-r border-[#000022]"></div>

            <Link href="/coins">
                <div className="flex flex-col items-center text-gray-500">
                    <span className="inline-flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full">
                        <Coins className='text-[#000022]' />
                    </span>
                    <span className="text-xs mt-2 text-[#000022]">Coins</span>
                </div>
            </Link>
            <div className="h-8 border-r border-[#000022]"></div>

            <Link href="/profile">
                <div className="flex flex-col items-center text-gray-500">
                    <span className="inline-flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full">
                        <User2 className='text-[#000022]' />
                    </span>
                    <span className="text-xs mt-2 text-[#000022]">Profile</span>
                </div>
            </Link >
        </div>
    );
};

export default FooterNavigation;