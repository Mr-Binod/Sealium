'use client'

import Certificate from '@/components/certificate/Certificate'
import Image from 'next/image'
import Link from 'next/link'
import React, { use } from 'react'
import { motion } from 'framer-motion'
import { useCertInfoStore } from '@/store/store'

const page = () => {
    const { certInfo } = useCertInfoStore();
    if (!certInfo) return <div className="absolute bg-white top-10 left-1/2 transform -translate-x-1/2 font-noto-serif" >404 not found</div>;

    return (
        <div className='bg-gradient-to-br from-darkviolet2 via-nsvyviolet to-darkviolet2 overflow-hidden'>
            <h1 className='font-noto-serif text-3xl font-bold text-blue-100 absolute top-3  sm:px-10'
            // onClick={}
            >
                <Image src="/logo.png" alt="logo" width={70} height={50} className='cursor-pointer inline-block ' />
                <Link href="/">Sealium</Link></h1>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Certificate />
            </motion.div>
        </div>
    )  
}

export default page