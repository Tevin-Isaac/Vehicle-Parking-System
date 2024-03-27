import React from 'react';
import { Button, Container } from '.';
import { JackInTheBox, Reveal } from 'react-awesome-reveal';
import { fadeInDownShorter, fadeInLeft, fadeInUp } from '@/keyframes';
import Image from 'next/image';

const Hero = () => {
  return (
    <Container className={'flex flex-col sm:flex-row mt-20 mb-32'}>
      <div className='w-full sm:w-[50%] pr-0 sm:pr-10 lg:pr-20 mt-[-20px] sm:mt-5 lg:mt-10'>
       
          <h1 className='text-3xl lg:text-6xl font-bold mb-5'>
           The Best Sneaker Store  For your Swag
          </h1>

     
          <p className='mb-8 opacity-50'>
            Sneakerpunk is the place where our love for sneakers is genuine.Imagine a world where your best sneaker is available to your reach.
          </p>
    

        <div className='flex mb-10'>
     
            <Button
              isLink
              href={'/#about'}
              className={'mr-3'}
              variant={'primary'}
            >
              Explore
            </Button>
 
          
            <Button isLink href={'/#collections'}>
              Collection
            </Button>
        
        </div>
        <div className='grid grid-cols-3 gap-3'>
    
            <div>
              <p className='font-bold text-2xl mb-1'>50k+</p>
              <p className='opacity-50 '>Artworks</p>
            </div>
 
         
            <div>
              <p className='font-bold text-2xl mb-1'>30k+</p>
              <p className='opacity-50 '>Artists</p>
            </div>
    
          
            <div>
              <p className='font-bold text-2xl mb-1'>90k+</p>
              <p className='opacity-50 '>Auctions</p>
            </div>
        
        </div>
      </div>
      <div className='flex-1 mt-14 sm:mt-0'>
        
          <div className='relative w-full h-[400px] lg:h-[500px]'>
            <Image
              layout='fill'
              objectFit='contain'
              objectPosition={'center'}
              src='/hero/heroimage.png'
              alt='hero'
            />
          </div>
      </div>
    </Container>
  );
};

export default Hero;
