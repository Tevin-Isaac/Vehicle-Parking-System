import { list_top_creator } from '@/fake_data';
import React, { useEffect, useState } from 'react';
import { Container, CreatorItem } from '.';
import { fadeInDownShorter, fadeInDownShorter2 } from '@/keyframes';

const TopCreator = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Container className={'mb-44'}>
      <div className='text-center mb-8'>
        <h2 className='font-bold text-3xl mb-2'>Top Designers</h2>
        <p className='opacity-50 w-full sm:w-[400px] mx-auto'>
          Here are our Top three Shoe Designers .
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {list_top_creator.map((item, i) => (
          <div
            key={i}
            className={`${
              isMounted ? 'animate-fadeInDownShorter' : ''
            } duration-500`}
            style={{ animationDelay: `${100 * (i + 1)}ms` }}
          >
            <CreatorItem key={i} data={item} />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default TopCreator;
