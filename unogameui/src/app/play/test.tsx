'use client'

import StyledButton from '@/components/styled-button'
import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation';
import TokenInfoBar from '@/components/TokenBar'
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

    const socket = useRef<Socket | null>(null);

    const fetchGames = async () => {
        if (contract) {
            try {
                console.log('Fetching active games...')
                const activeGames = await contract.getActiveGames()
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
                router.push(`/room/${gameId.toString()}`)
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
        <div className='relative'>
            <TokenInfoBar />
            <div className='bg-white w-full max-w-[1280px] h-[720px] overflow-hidden mx-auto my-8 px-4 py-2 rounded-lg bg-cover bg-[url("/bg-2.jpg")] relative shadow-[0_0_20px_rgba(0,0,0,0.8)]'>
                <div className='absolute inset-0 bg-no-repeat bg-[url("/table-1.png")]'></div>
                <div className='absolute left-8 -right-8 top-14 -bottom-14 bg-no-repeat bg-[url("/dealer.png")] transform-gpu'>
                    <div className='absolute -left-8 right-8 -top-14 bottom-14 bg-no-repeat bg-[url("/card-0.png")] animate-pulse'></div>
                </div>
                <div className='absolute top-0 md:left-1/2 md:right-0 bottom-0 w-[calc(100%-2rem)] md:w-auto md:pr-20 py-12'>
                    {!userFriendlyAddress ?
                        <div className='relative text-center flex justify-center'>
                            <img src='/login-button-bg.png' />
                            <div className='left-1/2 -translate-x-1/2 absolute bottom-4'>
                                {/* <StyledButton disabled={!ready} data-testid="connect" roundedStyle='rounded-full' className='bg-[#ff9000] text-2xl' onClick={login}>{authenticated ? `Connected Wallet` : `Connect Wallet`}</StyledButton> */}
                                <TonConnectButton />
                            </div>
                        </div>
                        : <>
                            <StyledButton onClick={() => handleCompletePayment()} className='w-fit bg-[#00b69a] bottom-4 text-2xl my-3 mx-auto'>{createLoading == true ? 'Creating...' : 'Create Game Room'}</StyledButton>
                            <p className='text-white text-sm font-mono'>Note: Don't join the room where game is already started</p>
                            {joinLoading == true && <div className='text-white mt-2 text-2xl shadow-lg'>Wait, while we are joining your game room...</div>}
                            <h2 className="text-2xl font-bold mb-4 text-white">Active Game Rooms:</h2>
                            <ScrollArea className="h-[530px] rounded-md border border-gray-200 bg-white p-4">
                                <ul className="space-y-2">
                                    {games.toReversed().map(gameId => (
                                        <li key={gameId.toString()} className="mb-2 bg-gray-100 p-4 rounded-lg shadow flex flex-row justify-between items-center">
                                            <h2 className="text-xl font-semibold text-gray-800">Game {gameId.toString()}</h2>
                                            <StyledButton onClick={() => joinGame(gameId)} className='w-fit bg-[#00b69a] bottom-4 text-2xl'>Join Game </StyledButton>
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </>
                    }
                    {/* {"hello" &&
                        <div className='flex flex-col items-center'>
                            <StyledButton onClick={() => router.push("/create")} className='w-fit bg-[#00b69a] bottom-4 text-2xl mt-6'>Create Table </StyledButton>
                            <StyledButton onClick={() => router.push("/game/join")} className='w-fit bg-[#00b69a] bottom-4 text-2xl mt-6'>Join Game </StyledButton>
                            {loading &&
                                <div className='text-white mt-2 text-2xl shadow-lg'>
                                    Wait, while we are retriving your details...
                                </div>
                            }
                        </div>
                    } */}
                </div>
            </div>
        </div >
    )
}