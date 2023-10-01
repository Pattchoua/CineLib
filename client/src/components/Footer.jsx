import { AiOutlineInstagram } from 'react-icons/ai';

const Footer = () => {
  return (
    <div className='max-w-[2000px] mx-auto flex justify-between bg-black items-center p-4'>
      <div className='text-yellow-800'>
         
          <p className='text-md sm:text-xl lg:text-xl py-1 flex'> <AiOutlineInstagram size={25} className='mr-4'/>Instagram</p>
      </div>
        <div>
          <h1 className='text-md text-orange-800 sm:text-xl md:text-2xl lg:text-4xl font-bold  px-2'>CineLib</h1>
        </div>
      <div>
          <p className=' text-yellow-800 text-sm lg:text-base md:text-base p-4 font-bold'> &copy; 2023 All rights reserved.</p>
      </div>
      
    </div>
  )
}

export default Footer;
