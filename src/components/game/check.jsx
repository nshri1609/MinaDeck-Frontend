'use client'

import StyledButton from '@/components/styled-button'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link';
import CreateProfilePopUp from '@/components/create-profile';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { checkAddress, getUserData } from '@/util/databaseFunctions';
import { useUserData } from '@/hooks/useUserData';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';

export default function CheckProfile() {

    const [walletConnected, setWalletConnected] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [profile, setProfile] = useState(false);
    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true)

    const { userData, setUserData } = useUserData();

    const dealerRef = useRef(null);
    const router = useRouter()

    const searchParams = useSearchParams();
    // Get the search params object

    const gameId = searchParams.get('gameId');

    const connectWallet = async () => {
        try {
            const collectAccounts = await window.mina.requestAccounts()
            setAccounts(collectAccounts);
            console.log(collectAccounts)
            let data = { id: "", address: "", name: "", userName: "", status: "" };

            if (userData == data) {
                setOpen(true)
            }
            if (collectAccounts) {
                setWalletConnected(true)
                console.log("check address", await checkAddress(collectAccounts))
                checkAddress(collectAccounts).then((res) => {
                    console.log("res:", res);
                    if (res) {
                        setProfile(true)
                    }
                })
                data = await getUserData(collectAccounts)
            }

            console.log("data", data.response[0])

            setUserData({
                id: data.response[0].id,
                name: data.response[0].name,
                userName: data.response[0].userName,
                status: data.response[0].status,
                address: data.response[0].address,
            });

        } catch (error) {
            console.log(error.message, error.code)
        }
    }

    useEffect(() => {
        if (userData.id !== '' && userData.address !== '' && userData.name !== '' && userData.userName !== '' && userData.status !== '') {
            console.log('userData has been updated:', userData);
            setDisabled(false)
        }
    }, [userData]);

    console.log(userData)

    const openHandler = () => {
        setOpen(false)
    }

    console.log(open)

    return (
        <div className='bg-white w-[1280px] h-[720px] overflow-hidden mx-auto my-8 px-4 py-2 rounded-lg bg-cover bg-[url("/bg-2.jpg")] relative shadow-[0_0_20px_rgba(0,0,0,0.8)]'>
            {/* <div className='absolute top-5 left-5 w-40 h-40 bg-no-repeat bg-[url("/logo.png")]'></div> */}
            <div className='absolute inset-0 bg-no-repeat bg-[url("/table-1.png")]'></div>
            <div className='absolute left-8 -right-8 top-14 -bottom-14 bg-no-repeat bg-[url("/dealer.png")] transform-gpu' ref={dealerRef}>
                <div className='absolute -left-8 right-8 -top-14 bottom-14 bg-no-repeat bg-[url("/card-0.png")] animate-pulse'></div>
            </div>
            <div className='absolute top-0 left-1/2 right-0 bottom-0 pr-20 py-12'>
                <div className='relative text-center flex justify-center'>
                    <img src='/login-button-bg.png' />
                    <StyledButton roundedStyle='rounded-full' className='absolute bg-[#ff9000] bottom-4 text-2xl left-1/2 -translate-x-1/2' onClick={connectWallet}>Connect Wallet</StyledButton>
                </div>
                {accounts &&
                    <div className='flex flex-col items-center'>
                        <span className='text-white mt-2 text-lg shadow-lg'>
                            Address: {accounts.toString().slice(0, 5) + '...' + accounts.toString().slice(-5)}
                        </span>
                        {/* profile */}
                        <div>
                            {!profile &&
                                <div className='flex flex-col'>
                                    <span className='text-white mt-2 text-lg shadow-lg'>
                                        Create Account before entering the game
                                    </span>
                                    <Dialog open={open} onOpenChange={(state) => setOpen(state)}>
                                        <DialogTrigger asChild>
                                            <StyledButton className='bg-[#00b69a] bottom-4 text-2xl mt-6'>Create Profile </StyledButton>
                                        </DialogTrigger>
                                        <DialogContent className=" w-fit">
                                            <CreateProfilePopUp openHandler={openHandler} accounts={accounts} />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            }
                            <StyledButton className='w-full bg-[#00b69a] bottom-4 text-2xl mt-6' onClick={() => router.push(`/game?gameId=${gameId}`)} disabled={disabled}>Enter Game </StyledButton>
                        </div>

                    </div>
                }
            </div>
        </div>
    )
}