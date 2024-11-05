import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { Coins, Users, Trophy, ArrowRight, HelpCircle } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {

    const lp = useLaunchParams();

    return (
        <main className="h-screen mx-auto p-3">
            <h1 className='font-bold text-3xl mb-3'>My profile</h1>
            <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar>
                            {/* <AvatarImage src={lp.initData?.user?.photoUrl} alt="@user" />
                            <AvatarFallback>{lp.initData?.user?.firstName.slice(0, 2).toUpperCase()}</AvatarFallback> */}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                            41
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold">Ayush</h2>
                        <p className="text-sm text-muted-foreground">Player</p>
                    </div>
                    <div className="flex items-center gap-2">
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
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-slate-300 text-black px-6 py-3 rounded-2xl mt-3 font-semibold w-full">
                        <Coins className="w-4 h-4 mr-2" />
                        Exchange
                    </button>
                    <button className="bg-slate-300 text-black px-6 py-3 rounded-2xl mt-3 font-semibold w-full">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Buy
                    </button>
                </div>

                {/* Referral Statistics */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Referral statistics</h3>

                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="font-medium">Invite friends — earn coins!</p>
                        <p className="text-sm text-muted-foreground">
                            For each friend who plays — 35 coins. For each friend they invite — 10 coins.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Number of Friends</span>
                            </div>
                            <span>0</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Friends' Referrals</span>
                            </div>
                            <span>0</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Coins className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Total Earned</span>
                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex items-center gap-1">
                                <span>0</span>
                                <span>+</span>
                                <span>0</span>
                                <Coins className="w-4 h-4 text-yellow-500" />
                            </div>
                        </div>
                    </div>

                    <button className="bg-slate-300 text-black px-6 py-3 rounded-2xl mt-3 font-semibold w-full">
                        Invite!
                    </button>
                </div>

                {/* Game Statistics */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Game statistics</h3>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Total played:</span>
                            </div>
                            <span>1</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Won:</span>
                            </div>
                            <span>0</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}