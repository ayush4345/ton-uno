'use client'

import StyledButton from '@/components/styled-button'
import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation';
import { UnoGameContract } from '@/lib/types';
import { getContractNew } from '@/lib/web3';
import io, { Socket } from "socket.io-client";
import { ScrollArea } from "@/components/ui/scroll-area"
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonAddress } from '@tonconnect/ui-react';
import { decodeBase64To32Bytes } from '@/lib/utils';
import { useTonConnect } from '@/hooks/useTonConnect';
import { JettonMaster } from '@ton/ton';
import { JettonWallet } from '@/wrappers/jettonWallet';
import { calculateUsdtAmount } from '@/lib/common-helpers';
import { JETTON_TRANSFER_GAS_FEES } from '../../../constants/fees.constants';
import { INVOICE_WALLET_ADDRESS, USDT_MASTER_ADDRESS } from '../../../constants/common-constants';
import { Address } from '@ton/core';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FooterNavigation from '@/components/FooterNavigation';

const CONNECTION = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'https://unosocket-6k6gsdlfoa-el.a.run.app/';

export default function PlayGame() {

    const userFriendlyAddress = useTonAddress();
    const [open, setOpen] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [joinLoading, setJoinLoading] = useState(false)
    const [account, setAccount] = useState<string | null>(null)
    const [contract, setContract] = useState<UnoGameContract | null>(null)
    const [games, setGames] = useState<BigInt[]>([])
    const router = useRouter()
    const { sender, walletAddress, tonClient } = useTonConnect();
    const lp = useLaunchParams();

    const socket = useRef<Socket | null>(null);

    const fetchGames = async () => {
        if (contract) {
            try {
                console.log('Fetching active games...')
                const activeGames = await contract.getNotStartedGames()
                console.log('Active games:', activeGames)
                setGames(activeGames)
            } catch (error) {
                console.error('Failed to fetch games:', error)
            }
        }
    }

    useEffect(() => {
        if (!socket.current) {
            socket.current = io(CONNECTION, {
                transports: ["websocket"],
            }) as any; // Type assertion to fix the type mismatch

            console.log("Socket connection established");
        }

    }, [socket]);

    useEffect(() => {
        if (contract) {
            console.log("Contract initialized, calling fetchGames"); // Add this line
            fetchGames();

            if (socket.current) {
                console.log("Socket connection established");
                // Add listener for gameRoomCreated event
                socket.current.on("gameRoomCreated", () => {
                    console.log("Game room created event received"); // Add this line
                    fetchGames();
                });

                // Cleanup function
                return () => {
                    if (socket.current) {
                        socket.current.off("gameRoomCreated");
                    }
                };
            }
        } else {
            console.log("Contract not initialized yet"); // Add this line
        }
    }, [contract, socket])

    const handleCompletePayment = useCallback(async () => {
        try {
            if (!tonClient || !walletAddress) return;
            console.log(Address.isAddress(USDT_MASTER_ADDRESS), walletAddress);
            const jettonMaster = tonClient.open(JettonMaster.create(USDT_MASTER_ADDRESS));
            const usersUsdtAddress = await jettonMaster.getWalletAddress(walletAddress);

            // creating and opening jetton wallet instance.
            // First argument (provider) will be automatically substituted in methods, which names starts with 'get' or 'send'
            const jettonWallet = tonClient.open(JettonWallet.createFromAddress(usersUsdtAddress));

            await jettonWallet.sendTransfer(sender, {
                fwdAmount: 1n,
                comment: '',
                jettonAmount: calculateUsdtAmount(2),
                toAddress: INVOICE_WALLET_ADDRESS,
                value: JETTON_TRANSFER_GAS_FEES,
            });

            console.log(`See transaction at https://testnet.tonviewer.com/${usersUsdtAddress.toString()}`);
            createGame();
        } catch (error) {
            console.log('Error during transaction check:', error);
        }
    }, [tonClient, walletAddress, sender,]);

    const createGame = async () => {
        if (contract) {
            try {
                setCreateLoading(true)
                console.log('Creating game...')

                const bytesFromTonAddress = decodeBase64To32Bytes(userFriendlyAddress as string)

                const tx = await contract.createGame(bytesFromTonAddress as `0x${string}` | undefined)
                console.log('Transaction hash:', tx.hash)
                await tx.wait()
                console.log('Game created successfully')

                if (socket && socket.current) {
                    socket.current.emit("createGameRoom");
                }

                fetchGames()
                setCreateLoading(false)
            } catch (error) {
                console.error('Failed to create game:', error)
                setCreateLoading(false)
            }
        }
    }

    const joinGame = async (gameId: BigInt) => {
        if (contract) {
            try {
                setJoinLoading(true)
                console.log(`Joining game ${gameId.toString()}...`)
                const gameIdBigint = BigInt(gameId.toString())

                const bytesFromTonAddress = decodeBase64To32Bytes(userFriendlyAddress as string)

                const tx = await contract.joinGame(gameIdBigint, bytesFromTonAddress as `0x${string}` | undefined)
                console.log('Transaction hash:', tx.hash)
                await tx.wait()

                setJoinLoading(false)

                console.log('Joined game successfully')
                router.push(`test/room/${gameId.toString()}`)
            } catch (error) {
                console.error('Failed to join game:', error)
            }
        }
    }

    const setup = async () => {
        if (userFriendlyAddress) {
            try {
                const { contract } = await getContractNew()
                setContract(contract)
                setAccount(userFriendlyAddress)
            } catch (error) {
                console.error('Failed to setup contract:', error)
            }
        }
    }

    useEffect(() => {
        if (userFriendlyAddress) {
            setup()
        } else {
            setAccount(null)
            setContract(null)
        }
    }, [userFriendlyAddress])
    console.log('games', contract)

    return (
        <div className='relative p-3 h-screen flex flex-col justify-between'>
            <div>
                <div className='bg-white relative rounded-2xl flex gap-5 p-3 items-center'>
                    <span>
                        <Avatar>
                            <AvatarImage src={lp.initData?.user?.photoUrl} alt="@user" />
                            <AvatarFallback>{lp.initData?.user?.firstName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </span>
                    <span>
                        <div className='font-bold'>{lp.initData?.user?.firstName}</div>
                        <div className='font-light text-gray-500 text-sm'>Go to profile</div>
                    </span>
                    <TonConnectButton className='absolute right-3' />
                </div>
                {!userFriendlyAddress
                    ? <div className='relative text-center flex justify-center'>
                        <img src='/login-button-bg.png' />
                        <div className='left-1/2 -translate-x-1/2 absolute bottom-4'>
                            <TonConnectButton />
                        </div>
                    </div>
                    : <div>
                        <div>
                            <h2 className='mt-3 text-[#000022] font-bold text-3xl'>Games list</h2>
                            <ScrollArea className='h-[calc(100vh-320px)] mt-3 rounded-2xl border-[1px] shadow-md border-[#000022] bg-white p-4'>
                                {games.toReversed().map((gameId, index) => (
                                    <div key={index} className='bg-[#000022]/10 rounded-2xl p-3 mt-3 flex gap-3 items-center justify-around hover:bg-[#000022]/20'>
                                        <div>
                                            <span className='font-bold'>Game{" "}</span>
                                            <span className='font-bold'>{gameId.toString()}</span>
                                        </div>
                                        <StyledButton onClick={() => joinGame(gameId)} className='bg-[#FF7033] max-w-24'>Join</StyledButton>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                        <div className='flex mt-3'>
                            <StyledButton onClick={() => createGame()} className='bg-[#FF7033] w-full'>{createLoading ? 'Creating...' : 'Create game'}</StyledButton>
                        </div>
                    </div>
                }
            </div>
            <div className='w-full'>
                <FooterNavigation />
            </div>
        </div >
    )
}