import { list_FAQ } from '@/fake_data';
import React, { useState } from 'react';
import { Container } from '.';
import { fadeInDownShorter2, fadeInLeft, fadeInRight } from '@/keyframes';

interface FAQItem {
  id: number;
  title: string;
  desc: string;
  status: boolean;
}

const FAQ = () => {
  const [faq, setFaq] = useState<FAQItem[]>(
    list_FAQ.map((item) => ({ ...item, status: false })),
  );

  const toggleFaq = (data: FAQItem) => {
    const newData = faq.map((item) => {
      return {
        ...item,
        status: data.id === item.id ? !data.status : false,
      };
    });
    setFaq(newData);
  };

  return (
    <Container className={'mb-44 scroll-mt-10'}>
      <div className='text-center mb-10'>
        <h2 className='font-bold mx-auto leading-snug w-full sm:w-[400px] text-3xl mb-2'>
          Frequently Asked Question
        </h2>
        <div className='opacity-50'>Have a question?</div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {faq.map((item, i) => (
          <div
            key={i}
            className={`${
              (i + 1) % 2 === 0 ? 'animate-fadeInLeft' : 'animate-fadeInRight'
            }`}
          >
            <AccordionItem toggleFaq={toggleFaq} data={item} />
          </div>
        ))}
      </div>
    </Container>
  );
};

const AccordionItem = ({ data, toggleFaq }: { data: FAQItem; toggleFaq: (data: FAQItem) => void }) => {
  return (
    <div
      onClick={() => toggleFaq(data)}
      className='mb-4 pb-2 border-b-2 border-b-gray-500'
    >
      <div className='flex pb-3 cursor-pointer justify-between items-center'>
        <p className={data.status ? 'opacity-90' : 'opacity-50'}>
          {data.title}
        </p>
        <p className={data.status ? 'opacity-90' : 'opacity-50'}>
          {data.status ? '-' : '+'}
        </p>
      </div>
      {data.status && (
        <div>
          <p className={data.status ? 'opacity-90' : 'opacity-50'}>
            {data.desc}
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQ;
