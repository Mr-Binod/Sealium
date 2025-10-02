'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { useCertInfoStore } from '@/store/store'

    
    import { Canvas, useFrame } from '@react-three/fiber';
    import { Text } from '@react-three/drei';
    import { useRef } from 'react';
    import * as THREE from 'three';
const Page = () => {

    const [load, setLoad] = useState(false)
    const [verified, setVerified] = useState(false)
    const [verificationFailed, setVerificationFailed] = useState(false)
    const [ValueError, setValueError] = useState(false)
    const { certInfo, setCertInfo } = useCertInfoStore()
    const router = useRouter()

    useEffect(() => {
        if (verified) {
            setTimeout(() => {
                router.push('/verified')
                setTimeout(() => {
                    setVerified(false)
                }, 500);
            }, 650)
            // setLoad(false)

            setTimeout(() => {
                setLoad(false)
            }, 1000);
        }
    }, [verified])
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true)
        const { vcurl, userdid } = e.target;
        console.log('yes', vcurl.value, userdid.value);
        if(vcurl.value.trim() === '' || userdid.value.trim() === ''){
            setValueError(true)
            setLoad(false)
            return
        }
        const verifyVcUrl = await axios.post('https://api.sealiumback.store/verifyvc', {
            userDidId: userdid.value,
            urlLink: vcurl.value
        })
        console.log(verifyVcUrl.data.message, "verifyVcUrl");
        setTimeout(() => {
            if (verifyVcUrl.data.state === 200) {
                setCertInfo(verifyVcUrl.data.message)
                setVerified(true)
                console.log(verifyVcUrl.data.message.payload, "certinfo in vc page");
                return
            }
            setVerificationFailed(true)
            setLoad(false)
        }, 4000);
        // setLoad(false)
    }

  
    
    function CurvedSealium() {
      const groupRef = useRef();
      const letters = 'Sealium'.split('');
      const radius = 3.5; // radius of the curve
    
      useFrame(() => {
        if (groupRef.current) {
          groupRef.current.rotation.y -= 0.012; // rotate around Y-axis
        }
      });
    
      return (
        <group ref={groupRef} position={[0, 0, 0]}>
          {letters.map((letter, i) => {
            const angle = (i - (letters.length - 1) / 2) * 0.33; // spacing
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const rotationY = angle;
    
            return (
              <Text
                key={i}
                position={[x, 0, z]}
                rotation={[0, rotationY, 0]}
                fontSize={1.5}
                color="#59b1b4"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Merriweather/Merriweather-VariableFont_opsz,wdth,wght.ttf"
              >
                {letter}
              </Text>
            );
          })}
        </group>
      );
    }
    
     function RotatingText() {
      return (
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <CurvedSealium />
        </Canvas>
      );
    }
    
    return (
        
        <div className="font-noto-serif  lg:px-80 py-20 lg:py-18 h-screen w-full bg-[url('/f1.jpg')] bg-cover bg-center text-white">
            
            <h1 className='text-3xl font-bold  absolute top-3 lg:left-10'>
                <Image src="/logo.png" alt="logo" width={70} height={50} className='inline-block  cursor-pointer' />
                <Link href="/" className='font-noto-serif'>Sealium</Link></h1>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl  font-bold mb-10 lg:mb-36 mx-auto w-fit'>수료증 검증하기</h1>
            <div className='grid grid-cols-1 gap-6 lg:block px-4 '>
                <form
                    onSubmit={handleSubmit}
                    className='order-2 lg:order-none flex flex-col gap-4 w-full lg:w-110 lg:h-110 justify-between border-1  border-blue-500 px-6 lg:px-8 py-10 lg:py-16 rounded-lg'>
                    <div className='font-noto-serif text-xl lg:text-2xl font-semibold mx-auto font-nanumgothic'>수료증 정보</div>
                    <input type="text" name='vcurl' placeholder="URL 링크를 입력해주세요" className='font-noto-serif outline-none border-1  border-blue-500 text-shadow-white h-12 lg:h-10 rounded-md px-3 lg:px-2 w-full' />
                    <input type="text" name='userdid' placeholder="DID 키 입력해주세요" className=' font-noto-serif outline-none border-1  border-blue-500 text-white h-12 lg:h-10 rounded-md px-3 lg:px-2 w-full' />
                    <button className='border-1  border-blue-500 w-full lg:w-36  text-amber-50 mx-auto h-11 lg:h-10 rounded-md hover:bg-blue-950 hover:text-sky-100 hover:border-blue-800 cursor-pointer' >검증</button>
                </form>
                {!load ? <div className='order-1 lg:order-none w-full lg:w-auto'>
                    <div className=' sm:w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] sm:mx-auto md:w-[380px] md:h-[380px] lg:w-150 lg:h-150 lg:absolute lg:top-1/2 lg:right-60 lg:-translate-y-1/2'>
                        <RotatingText />
                    </div>
                </div> :
                    <div className='order-1 lg:order-none w-full lg:w-auto'>
                        <div className="relative h-[300px] w-[340px] sm:h-[360px] sm:w-[420px] lg:h-150 lg:w-170 lg:absolute lg:top-1/2 lg:right-60 lg:-translate-y-1/2 rounded-full overflow-hidden">
                            <Image
                                src="/Explosion.gif"
                                alt="explosion"
                                width={0}
                                height={0}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>}
            </div>
            {verified && <div className='fixed lg:absolute h-screen w-full z-100 top-0 left-0 backdrop-blur-sm'>
                <div className='w-[90%] max-w-md lg:w-100 lg:h-60 z-1000 border-1 bg-sky-50 rounded-2xl absolute top-1/2 lg:top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <Image src="/verified.gif" alt="verified" width={250} height={200} className='mx-auto' />
                    <div className='text-black text-2xl font-noto-serif font-semibold w-fit mx-auto '>검증 완료</div>
                </div>
            </div>}

            {verificationFailed && <div onClick={() => setVerificationFailed(false)} className=' fixed lg:absolute  h-screen w-full z-100 top-0 left-0 backdrop-blur-sm'>
                <div className='w-[90%] max-w-md lg:w-100 lg:h-60 z-1000 border-1 bg-sky-50 rounded-2xl absolute top-1/2 lg:top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
                    <Image onClick={() => setVerificationFailed(false)} src="/cross.png" alt='cross' width={25} height={25} className='cursor-pointer absolute right-5 top-5' ></Image>
                    <Image src="/failed.png" alt="failed" width={150} height={111} className='mx-auto mt-5 mb-5' />
                    <div className='font-noto-serif text-black text-2xl font-semibold w-fit mx-auto '>검증 실패</div>
                    <div className='font-noto-serif text-black text-2xl font-semibold w-fit mx-auto '>정보가 일지하지않습니다</div>
                </div>
            </div>}
            {ValueError && <div onClick={() => setValueError(false)} className=' fixed lg:absolute h-screen w-full z-100 top-0 left-0 backdrop-blur-sm'>
                <div className='w-[90%] max-w-md lg:w-100 lg:h-60 z-1000 border-1 bg-sky-50 rounded-2xl absolute top-1/2 lg:top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
                    <Image onClick={() => setValueError(false)} src="/cross.png" alt='cross' width={25} height={25} className='cursor-pointer absolute right-5 top-5' ></Image>
                    <Image src="/failed.png" alt="failed" width={130} height={111} className='mx-auto mt-5 mb-5' />
                    <div className='font-noto-serif text-black text-2xl font-semibold w-fit mx-auto '>검증 실패</div>
                    <div className='font-noto-serif text-black text-2xl font-semibold w-fit mx-auto '>정보가 일지하지않습니다</div>
                </div>
            </div>}

        </div>
    )
}

export default Page


// https://sealiumback.store/did:ethr:sealium:0x784DBA910e25ABA0D4a88Ba720694b90F62CF6F9/Blockchain Developer Certificate