import React from 'react';
import { Container } from '.';

import Image from 'next/image';

const AboutUs = () => {
  return (
    <Container className={'mb-44 scroll-mt-10'}>
      <div id='about' className='text-center mb-8'>
        <h2 className='font-bold text-3xl mb-2'>About Us</h2>

        <p className='opacity-50 w-full  sm:w-[400px] mx-auto'>
          We love sneakers do you?
        </p>
      </div>
      <div className='flex items-center'>
        <div className='w-[44%] hidden sm:block'>
          <div className='relative w-full h-[700px] rounded-2xl overflow-hidden'>
            <Image
              layout='fill'
              objectFit='cover'
              objectPosition='center'
              src='/aboutus.png'
              alt='about us'
            />
          </div>
        </div>
        <div className='flex-1 ml-0 sm:ml-10 lg:ml-20'>
          <h3 className='font-bold text-2xl mb-3'>Get Popular</h3>
          <p className='mb-3 opacity-50'>
            Sneakerpunk aims to make your favorite sneakers last for life. Through this platform, you can walk with confidence.
          </p>
          <p className='mb-3 opacity-50'>
            Our team will help you choose the right sneakers.
          </p>
          <p className='hidden lg:block mb-3 opacity-50'>
            Our company started in 2019, and our main inspiration comes from Brandykicks, where most of our sneakers come from.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default AboutUs;
