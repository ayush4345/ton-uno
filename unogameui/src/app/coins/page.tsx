"use client"

import FooterNavigation from '@/components/FooterNavigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import React, { useState } from 'react';

const coins = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC' },
    { id: 2, name: 'Ethereum', symbol: 'ETH' },
    { id: 3, name: 'Ripple', symbol: 'XRP' },
    { id: 4, name: 'Litecoin', symbol: 'LTC' },
    { id: 5, name: 'Cardano', symbol: 'ADA' },
];

const CoinList: React.FC = () => {

    const [jettons, setJettons] = useState<any[]>([])
    const userFriendlyAddress = useTonAddress();

    async function fetchAccountEvents() {
        if (!userFriendlyAddress) {
            return;
        }
        let balances;
        const address = userFriendlyAddress;
        const response = await fetch(`https://testnet.tonapi.io/v2/accounts/${address}/jettons`, {
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TONAPI_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            balances = data.balances;
            setJettons(balances);

        } else {
            console.error('Failed to fetch account events:', response);
        }

    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            fetchAccountEvents();
        }, 3000);

        return () => clearInterval(interval);
    }, [userFriendlyAddress]);

    return (
        <div className='h-screen mx-auto p-3 flex flex-col justify-between'>
            <div>
                <h1 className='font-bold text-3xl mb-3'>Coin List</h1>
                {userFriendlyAddress
                    ? <ScrollArea className='h-[calc(100vh-180px)] mt-3 rounded-2xl border-2 border-gray-200 bg-white p-4'>
                        <ul>
                            {jettons
                                ? (jettons.map(coin => (
                                    <li key={coin.jetton.name} className='bg-gray-100/50 mb-2 py-2 px-3 hover:bg-gray-100 shadow flex items-center w-full rounded-2xl justify-between'>
                                        <span className='flex items-center gap-2'>
                                            <img src={`/chips-blank-1.png`} className='w-10' data-value={coin} />
                                            <p className='font-normal'>{coin.jetton.name}</p>
                                        </span>
                                        <p className='font-bold'>$ {coin.balance / 1_000_000_000}</p>
                                    </li>
                                )))
                                : <div className="">
                                    <div className="w-10 h-10 border-4 border-[#000022] border-t-transparent rounded-full animate-spin"></div>
                                    <p>Loading...</p>
                                </div>
                            }
                        </ul>
                    </ScrollArea>
                    : <div className='relative text-center flex justify-center'>
                        <img src='/login-button-bg.png' />
                        <div className='left-1/2 -translate-x-1/2 absolute bottom-4'>
                            <TonConnectButton />
                        </div>
                    </div>
                }

            </div>
            <FooterNavigation />
        </div>
    );
};

export default CoinList;