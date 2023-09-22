import { useEffect } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'

import { useStateContext } from '../contexts/ContextProvider'

const NavButton = ({ customFunc, icon, color, dotColor }) => (
  <button
    type="button"
    onClick={() => customFunc()}
    style={{ color }}
    className="relative text-xl mr-6 rounded-full p-3 hover:bg-light-gray"
  >
    <span
      style={{ background: dotColor }}
      className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
    />

    {icon}
  </button>
)

const Navbar = () => {
  const { activeMenu, setActiveMenu, setScreenSize, screenSize } =
    useStateContext()

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth)

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false)
    } else {
      setActiveMenu(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize])

  const handleActiveMenu = () => setActiveMenu(!activeMenu)

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        icon={<AiOutlineMenu />}
      />
    </div>
  )
}

export default Navbar
