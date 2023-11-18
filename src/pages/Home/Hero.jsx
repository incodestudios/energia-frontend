import React from 'react'
import Typed from 'react-typed'

import WebNavBar from '../../components/nav/WebNavBar'
import { Link, NavLink } from 'react-router-dom'

const Hero = () => {
  const backgroundUrl = `url('https://images.pexels.com/photos/3059982/pexels-photo-3059982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
  return (
    <div
      className="text-white bg-fixed bg-cover bg-center overflow-hidden h-[650px]"
      style={{ backgroundImage: backgroundUrl }}
      id="home"
    >
      <WebNavBar />
      <div className="w-full">
        <div className="inset-0 bg-black bg-opacity-50">
          <div className="max-w-[800px] -my-56 w-full h-screen flex flex-col justify-center items-center mx-auto text-center">
            <h1 className="md:text-4xl sm:text-2xl text-2xl font-bold md:py-6 uppercase ">
              Welcome to Energis
            </h1>
            <div className="flex justify-center items-center">
              <p className="md:text-2xl sm:text-md text-xl font-bold py-4">
                Don't stop when you're tired. Stop when you're done.
              </p>
            </div>

            <Typed
              className="md:text-2xl sm:text-4xl text-xl font-bold md:pl-4 pl-2"
              strings={[
                'Strength',
                'Endurance',
                'Flexibility',
                'Stamina',
                'Power',
                'Balance',
              ]}
              typeSpeed={120}
              backSpeed={140}
              loop
            />

            <Link
              to="/register"
              as={NavLink}
              className="my-6 w-[230px] inline-flex items-center justify-center text-white bg-sky-500 hover:bg-sky-400 text-md px-3 py-2 focus:outline-none mr-2"
            >
              BOOK ONLINE
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
