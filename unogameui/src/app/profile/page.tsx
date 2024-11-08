'use client'

import FooterNavigation from '@/components/FooterNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { Coins, Users, Trophy, ArrowRight, HelpCircle } from "lucide-react"
import { useRouter } from 'next/navigation';

export default function GameProfile() {

    const lp = useLaunchParams();
    const router = useRouter();

    return (
        <main className="h-screen mx-auto p-3 flex flex-col justify-between">
            <div className=''>
                <h1 className='font-bold text-3xl mb-3'>My profile</h1>
                <div className="space-y-6 bg-white rounded-2xl p-3">
                    {/* Profile Section */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar>
                                <AvatarImage src={lp.initData?.user?.photoUrl} alt="@user" />
                                <AvatarFallback>{lp.initData?.user?.firstName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                41
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="font-semibold">{lp.initData?.user?.firstName}</h2>
                            <p className="text-sm text-muted-foreground">Player</p>
                        </div>
                        {/* <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Coins className="w-4 h-4 text-yellow-500" />
                                <span>74</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image
                                    src="/placeholder.svg?height=16&width=16"
                                    alt="Currency"
                                    width={16}
                                    height={16}
                                    className="rounded-full"
                                />
                                <span>0</span>
                            </div>
                        </div> */}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => router.push("/coins")} className="bg-slate-300 text-black px-6 py-3 rounded-2xl mt-3 font-semibold w-full flex items-center justify-center gap-3">
                            <Coins className="w-4 h-4 mr-2" />
                            <p>Exchange</p>
                        </button>
                        <button onClick={() => router.push("/coins")} className="bg-slate-300 text-black px-6 py-3 rounded-2xl mt-3 font-semibold w-full flex items-center justify-center gap-3">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            <p>Buy</p>
                        </button>
                    </div>
                </div>
            </div>
            <FooterNavigation />
        </main>
    )
}