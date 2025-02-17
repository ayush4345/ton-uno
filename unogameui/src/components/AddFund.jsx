import FrameBox from './frameBox'
import StyledButton from './styled-button'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { RxCross2 } from "react-icons/rx";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { TonClient, toNano } from "@ton/ton";
import { DEX, pTON } from "@ston-fi/sdk";
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';


const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
});

const dex = client.open(new DEX.v1.Router());


// ShareLink component - used for sharing a match link
export default function AddFundPopUp({ openHandler, address, balance, setBalance }) {
    const router = useRouter()
    const [amount, setAmount] = useState(0)
    const [contract, setContract] = useState(null)
    const [tonConnectUI] = useTonConnectUI();

    const { toast } = useToast()

    const handleClick = (event) => {
        const value = parseInt(event.target.getAttribute('data-value'));
        const total = amount + value;
        console.log(total)
        setAmount(total)
    };

    const ISSERVER = typeof window === "undefined";

    const [tokenAmount, setTokenAmount] = useState(0);

    // swap 1 TON to Enertime but not less than 0.1 nano Enertime
    const swapTonToEnertime = async () => {
        const txParams = await dex.getSwapTonToJettonTxParams({
            offerAmount: toNano("1"), // swap 1 TON
            askJettonAddress: "EQAWqZE17MQgawh-Jo_Z8Wh_dGc1zpo7rL6r2w4L7XK_HygW", // Enertime
            minAskAmount: toNano("0.1"), // but not less than 0.1 STON
            proxyTon: new pTON.v1(),
            userWalletAddress: address,
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

    useEffect(() => {
        if (!ISSERVER) {
            // Retrieve game data from local storage
            const storedUserData = localStorage.getItem('amount');

            if (storedUserData) {
                setTokenAmount(storedUserData);
            }
        }
    }, [balance]);

    const BuyToken = async () => {
        if (!ISSERVER) {

            const previousAmount = localStorage.getItem('amount')
            if (previousAmount) {
                localStorage.setItem('amount', parseInt(previousAmount) + amount);
            } else {
                localStorage.setItem('amount', amount);
            }

            toast({
                title: "Success 🎉",
                description: `${amount} tokens have been successfully added to your balance`,
            })

        } else {
            alert('Please Connect Wallet')
        }
    }

    return (
        <FrameBox
            title={<div className='bg-no-repeat bg-top h-[96px] -translate-y-1/2'></div>}
            onClose={openHandler} // onClose prop for closing the component
            showClose={true} // Option to hide the close button
        >
            <div className='w-[560px] m-10 text-center flex flex-col justify-center text-white' data-testid="add fund">
                <h4 className='text-3xl font-black'>Add Tokens to Your Fund</h4>
                <p>Boost Your Stack, Elevate Your Game: Add Funds with Ease!</p>
                <section className='flex gap-8 w-fit mx-auto mt-4 mb-4'>
                    {balance && balance.map((item, index) => {
                        return (
                            <div key={index} className='flex flex-col items-center'>
                                <img src={`/chips-blank-${index + 1}.png`} data-value={item} />
                                <p>$ {item.balance / 1_000_000_000}</p>
                                <p>{item.jetton.name}</p>
                            </div>
                        )
                    })}
                </section>
                <StyledButton onClick={swapTonToEnertime}>Swap Ton to Enertime</StyledButton>
            </div>
        </FrameBox>
    )
}