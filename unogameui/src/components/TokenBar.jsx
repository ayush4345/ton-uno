
'use client'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import StyledButton from "./styled-button";
import { useEffect, useState } from "react";
import AddFundPopUp from "./AddFund";
import Link from "next/link";
import { useTonAddress } from '@tonconnect/ui-react';

export default function TokenInfoBar() {

    const [open, setOpen] = useState(false)
    const [jettonBalance, setJettonBalance] = useState(0)
    const userFriendlyAddress = useTonAddress();

    const openHandler = () => {
        setOpen(false)
    }

    const ISSERVER = typeof window === "undefined";

    const [tokenAmount, setTokenAmount] = useState(0);

    useEffect(() => {
        // Retrieve game data from local storage
        if (!ISSERVER) {
            const storedUserData = localStorage.getItem('amount');

            if (storedUserData) {
                setTokenAmount(storedUserData);
            }
        }

    }, [jettonBalance]);

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
            setJettonBalance(balances);

        } else {
            console.error('Failed to fetch account events:', response);
        }

        console.log('Account\'s Jettons:', balances)
    }

    useEffect(() => {
        fetchAccountEvents();
    }, [userFriendlyAddress]);


    return (
        <div className={`w-[100%] xl:max-w-[1280px] flex justify-between items-center mx-auto pt-5 px-3`}>
            <Link href="/play">
                <h2 className="font-extrabold text-[24px] text-white cursor-pointer">
                    TONUNO
                </h2>
            </Link>
            <div className="flex gap-4 items-center">
                <Link href="/play" className="text-white font-semibold text-lg hover:underline p-1 rounded-md cursor-pointer">Play</Link >
                {/* <Link href="/create" className="text-white font-semibold text-lg shadow-md hover:underline p-1 rounded-md cursor-pointer">Create</Link >
                <Link href="/game/join" className="text-white font-semibold text-lg shadow-md hover:underline p-1 rounded-md cursor-pointer">Join</Link > */}
                <span className="flex items-center gap-3 border-[1px] p-2 px-4 rounded-xl">
                    <div className="text-white font-semibold text-lg">{tokenAmount} $ENERGY</div>
                    <Dialog open={open} onOpenChange={(state) => setOpen(state)}>
                        <DialogTrigger asChild>
                            <StyledButton className='bg-[#c69532] text-xs'><span className="flex items-center gap-3">My Tokens</span> </StyledButton>
                        </DialogTrigger>
                        <DialogContent className="min-w-[300px] max-w-[1100px] min-h-[10px] max-h-[480px] w-fit">
                            <AddFundPopUp openHandler={openHandler} address={userFriendlyAddress} balance={jettonBalance} setBalance={setJettonBalance} />
                        </DialogContent>
                    </Dialog>
                </span>
                <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/8.x/notionists/svg`} alt="@user" />
                    <AvatarFallback>MD</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}