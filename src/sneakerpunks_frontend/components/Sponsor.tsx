import React from 'react';
import { Container } from '.';
import { Reveal } from 'react-awesome-reveal';
import { fadeInUp } from '@/keyframes';
import Image from 'next/image';
const Sponsor = () => {
  return (
    <Container className={'grid grid-cols-3 gap-5 mb-32 items-center'}>

        <div className='flex items-center justify-center relative w-full h-[350px]'>
          <Image
            layout='fill'
            objectFit='contain'
            objectPosition={'center'}
            src='/sponsor/dacade.svg'
            alt='dacade'
          />
        </div>
   
   
        <div className='flex items-center justify-center relative w-full h-[60px]'>
          <Image
            layout='fill'
            objectFit='contain'
            objectPosition={'center'}
            src='/sponsor/ethereum.svg'
            alt='ethereum'
          />
        </div>
     
     
        <div className='flex items-center justify-center relative w-full h-[300px]'>
          <Image
            layout='fill'
            objectFit='contain'
            objectPosition={'center'}
            src='/sponsor/celo.svg'
            alt='celo'
          />
        </div>

    </Container>
  );
};

export default Sponsor;
