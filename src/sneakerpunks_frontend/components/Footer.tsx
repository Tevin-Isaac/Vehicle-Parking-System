import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Container, Logo } from '.';

const Footer = () => {
  function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  return (
    <Container className={'pb-10'}>
      <div className='flex flex-col lg:flex-row mb-16'>
        <div className='w-[300px] mb-10 lg:mb-0 mr-10 lg:mr-28'>
          <Logo />
          <p className='mt-5'>
            The best Sneaker marketplace platform in the world.
          </p>
        </div>
        <div className='flex-1 grid grid-cols-2 md:grid-cols-3 gap-4'>
          <div>
            <p className='font-bold text-xl mb-5'>About</p>
            <div className='flex flex-col'>
              <Link href='/' className='mb-4 opacity-50'>
                Sneakers
              </Link>
              <Link href='/' className='mb-4 opacity-50'></Link>
              <Link href='/' className='mb-4 opacity-50'>
                Terms & Conditions
              </Link>
              <Link href='/' className='mb-4 opacity-50'>
                FAQ
              </Link>
            </div>
           Sneaker Collabos
          </div>
          <div>
            <p className='font-bold text-xl mb-5'>Company</p>
            <div className='flex flex-col'>
              <Link href='/' className='mb-4 opacity-50'>
                Our Team
              </Link>
              <Link href='/' className='mb-4 opacity-50'>
                Partner With Us
              </Link>
              <Link href='/' className='mb-4 opacity-50'>
                Privacy & Policy
              </Link>
              <Link href='/' className='mb-4 opacity-50'>
                Features
              </Link>
            </div>
          </div>
          <div>
            <p className='font-bold text-xl mb-5'>Contact</p>
            <div className='flex flex-col'>
              <Link href='/' className='mb-4 opacity-50'>
                +254 00012345
              </Link>
              <Link href='/' className='mb-5 opacity-50'>
                isaactevin67@gmail.com
              </Link>
              <div className='flex items-center'>
                <div className='mr-10 cursor-pointer'>
                  <Image
                    src='/icons/youtube.svg'
                    width={34}
                    height={34}
                    alt='youtube'
                  />
                </div>
                <div className='mr-10 cursor-pointer'>
                  <Image
                    src='/icons/discord.svg'
                    width={28}
                    height={28}
                    alt='discord'
                  />
                </div>
                <div className='cursor-pointer'>
                  <Image
                    src='/icons/instagram.svg'
                    width={30}
                    height={30}
                    alt='instagram'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center mb-8'>
        &copy; <span className='font-bold mr-1'> </span>
        Design By <span className='font-bold ml-1'>Tevin Isaac</span>
      </div>
      <div
        onClick={scrollToTop}
        className='animate-bounce  h-14 w-14 cursor-pointer shadow-lg shadow-[#FFFF]/40 rounded-full bg-gradient-to-b font-bold from-[#ff9900] to-[#fcc100] mx-auto flex justify-center items-center'
      >
        UP
      </div>
    </Container>
  );
};

export default Footer;
