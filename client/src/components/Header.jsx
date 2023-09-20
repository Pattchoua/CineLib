import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { TbHome, TbMovie } from 'react-icons/tb';
import { MdFavorite } from 'react-icons/md';

const Header = () => {
  const [nav, setNav] = useState(false);

  return (
    <div className='max-w-[2000px] mx-auto flex justify-between items-center p-4'>

      {/**Left Side */}
      <div className='flex items-center'>
        <div onClick={() => setNav(!nav)} className='text-yellow-700 cursor-pointer sm:hidden'>
          <AiOutlineMenu size={40} />
        </div>
        <h1 className={`text-2xl text-${nav ? 'white' : 'orange-800'} sm:text-3xl lg:text-4xl font-bold px-2`}>
          CineLib
        </h1>
      </div>

      {/**mobile menu */}
      {/**overlay */}
      {nav ? <div className='bg-black/80 fixed w-full h-screen z-10 top-10 left-0'></div> : ''}

      {/**side drawer menu */}
      <div
        className={`${
          nav
            ? 'fixed top-0 left-0 w-[300px] h-screen bg-zinc-800 z-10 duration-300'
            : 'fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-300'
        } sm:static sm:bg-transparent sm:flex sm:space-x-4 sm:w-auto sm:h-auto`}
      >
        {nav && (
          <AiOutlineClose onClick={() => setNav(!nav)} size={30} className={`absolute right-4 top-4 text-white cursor-pointer sm:hidden`} />
        )}
        <h2 className={`text-2xl text-${nav ? 'white' : 'orange-800'} p-4 font-bold sm:hidden`}>CineLib</h2>
        <nav>
          <ul
            className={`${
              nav
                ? 'flex flex-col p-4 text-cyan-400'
                : 'sm:flex sm:flex-row sm:space-x-4 sm:p-0'
            }`}
          >
            <li className={`${nav ? 'text-xl py-4 flex' : 'sm:text-xl sm:py-0 sm:flex sm:items-center'}`}>
              <TbHome size={25} className='mr-4' />
              <NavLink to="/" className={`sm:text-cyan-400 ${nav ? 'text-cyan-400' : 'sm:text-white'}`}>
                Home
              </NavLink>
            </li>
            <li className={`${nav ? 'text-xl py-4 flex' : 'sm:text-xl sm:py-0 sm:flex sm:items-center'}`}>
              <TbMovie size={25} className='mr-4' />
              <NavLink to="/Movies" className={`sm:text-cyan-400 ${nav ? 'text-cyan-400' : 'sm:text-white'}`}>
                Movies
              </NavLink>
            </li>

            <li className={`${nav ? 'text-xl py-4 flex' : 'sm:text-xl sm:py-0 sm:flex sm:items-center'}`}>
              <MdFavorite size={25} className='mr-4' />
              <NavLink to="/Favorites" className={`sm:text-cyan-400 ${nav ? 'text-cyan-400' : 'sm:text-white'}`}>
                Favorites
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
