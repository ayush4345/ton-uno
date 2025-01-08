"use client"

import FooterNavigation from '@/components/FooterNavigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import React, { useState } from 'react';
import { TonClient, toNano } from "@ton/ton";
import { DEX, pTON } from "@ston-fi/sdk";
import StyledButton from '@/components/styled-button';

const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
});

const dex = client.open(new DEX.v1.Router());

const CoinList: React.FC = () => {

    const [jettons, setJettons] = useState<any[]>([])
    const userFriendlyAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

    // swap 1 TON to Enertime but not less than 0.1 nano Enertime
    const swapTonToEnertime = async () => {
        const txParams = await dex.getSwapTonToJettonTxParams({
            offerAmount: toNano("1"), // swap 1 TON
            askJettonAddress: "EQAWqZE17MQgawh-Jo_Z8Wh_dGc1zpo7rL6r2w4L7XK_HygW", // Enertime
            minAskAmount: toNano("0.1"), // but not less than 0.1 STON
            proxyTon: new pTON.v1(),
            userWalletAddress: userFriendlyAddress,
        });

        await tonConnectUI.sendTransaction({
            validUntil: Date.now() + 1000000,
            messages: [
                {
                    address: txParams.to.toString(),
                    amount: txParams.value.toString(),
                    payload: txParams.body?.toBoc().toString("base64"),
                },
            ],
        });
    }


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
                <div className='rounded-2xl shadow bg-white py-5 px-3'>
                    <div className="flex flex-col items-start space-y-4">
                        <div className="text-4xl font-bold tabular-nums text-gray-900 dark:text-gray-100 mb-3">
                            0.00
                            <span className="text-2xl ml-2 text-gray-600 dark:text-gray-400">Enertime</span>
                        </div>
                        <StyledButton style={{width:"100%"}} onClick={swapTonToEnertime}>Swap Ton to Enertime</StyledButton>
                    </div>
                </div>
                {userFriendlyAddress
                    ? <ScrollArea className='h-[calc(100vh-330px)] mt-3 rounded-2xl border-2 border-gray-200 bg-white p-4'>
                        <ul>
                            {jettons
                                ? (jettons.map(coin => (
                                    <li key={coin.jetton.name} className='bg-gray-100/50 mb-2 py-2 px-3 hover:bg-gray-100 shadow flex items-center w-full rounded-2xl justify-between'>
                                        <span className='flex items-center gap-2'>
                                            <img src={`/chips-blank-1.png`} className='w-10' data-value={coin} />
                                            <p className='font-normal'>{coin.jetton.name}</p>
                                        </span>
                                        <p className='font-bold'>{coin.balance / 1_000_000_000}</p>
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