import { LazyLoadImage } from "react-lazy-load-image-component"
import Logo from '../../assets/brand-logo.png';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-y-auto px-4 py-8">
      <div className="flex flex-col items-center p-3 max-w-[720px]">
        <LazyLoadImage
          src={Logo}
          alt="logo"
          effect="blur"
          className="w-full max-w-[420px]"
        />
        <p className="text-lg md:text-xl text-neutral-300 text-center mt-3 px-3">Modern, fast and secure chat. Built with React, Express, and Socket.IO.</p>
        <ul className="list-disc text-base md:text-xl text-neutral-400 mt-6 px-6">
          <li>Conversate one on one or create Groups.</li>
          <li>Add friend or block someone.</li>
          <li>Chat with your friends as much as you want.</li>
        </ul>
        <Link
          to='/addfriend'
          className="bg-neutral-600 rounded-md px-5 py-3 text-xl mt-8">
          Find Your Friends
        </Link>
      </div>
    </div>
  )
}

export default Home
