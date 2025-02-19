"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="bg-[#181a20] min-h-screen flex flex-col">
      <header className="bg-[#181a20] text-white py-4 px-8 shadow-lg shadow-black flex justify-between items-center fixed w-full z-10 top-0 left-0">
        <div className="flex items-center gap-6">
          <div className="text-2xl font-semibold flex items-center gap-2">
            <a
              style={{ width: "100px" }}
              className="logo-link"
              href="https://www.binance.com/en-GB/"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 5120 1024"
                className="header-logo"
                fill="#f2c118"
              >
                <path
                  d="M230.997333 512L116.053333 626.986667 0 512l116.010667-116.010667L230.997333 512zM512 230.997333l197.973333 197.973334 116.053334-115.968L512 0 197.973333 314.026667l116.053334 115.968L512 230.997333z m395.989333 164.992L793.002667 512l116.010666 116.010667L1024.981333 512l-116.992-116.010667zM512 793.002667l-197.973333-198.997334-116.053334 116.010667L512 1024l314.026667-314.026667-116.053334-115.968L512 793.002667z m0-165.973334l116.010667-116.053333L512 396.032 395.989333 512 512 626.986667z m1220.010667 11.946667v-1.962667c0-75.008-40.021333-113.024-105.002667-138.026666 39.978667-21.973333 73.984-58.026667 73.984-121.002667v-1.962667c0-88.021333-70.997333-145.024-185.002667-145.024h-260.992v561.024h267.008c126.976 0.981333 210.005333-51.029333 210.005334-153.002666z m-154.026667-239.957333c0 41.984-34.005333 58.965333-89.002667 58.965333h-113.962666V338.986667h121.984c52.010667 0 80.981333 20.992 80.981333 58.026666v2.005334z m31.018667 224c0 41.984-32.981333 61.013333-87.04 61.013333h-146.944v-123.050667h142.976c63.018667 0 91.008 23.04 91.008 61.013334v1.024z m381.994666 169.984V230.997333h-123.989333v561.024h123.989333v0.981334z m664.021334 0V230.997333h-122.026667v346.026667l-262.997333-346.026667h-114.005334v561.024h122.026667v-356.010666l272 356.992h104.96z m683.946666 0L3098.026667 228.010667h-113.962667l-241.024 564.992h127.018667l50.986666-125.994667h237.013334l50.986666 125.994667h130.005334z m-224.981333-235.008h-148.992l75.008-181.973334 73.984 181.973334z m814.037333 235.008V230.997333h-122.026666v346.026667l-262.997334-346.026667h-114.005333v561.024h122.026667v-356.010666l272 356.992h104.96z m636.970667-91.008l-78.976-78.976c-44.032 39.978667-83.029333 65.962667-148.010667 65.962666-96 0-162.986667-80-162.986666-176v-2.986666c0-96 67.968-174.976 162.986666-174.976 55.978667 0 100.010667 23.978667 144 62.976l78.976-91.008c-51.968-50.986667-114.986667-86.997333-220.970666-86.997334-171.989333 0-292.992 130.986667-292.992 290.005334V512c0 160.981333 122.965333 288.981333 288 288.981333 107.989333 1.024 171.989333-36.992 229.973333-98.986666z m527.018667 91.008v-109.994667h-305.024v-118.016h265.002666v-109.994667h-265.002666V340.992h301.013333V230.997333h-422.997333v561.024h427.008v0.981334z"
                  p-id="2935"
                ></path>
              </svg>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="space-x-6 hidden sm:flex">
            <a
              href="#"
              className="hover:text-[#f2c118] transition-colors duration-200"
            >
              Markets
            </a>
            <a
              href="#"
              className="hover:text-[#f2c118] transition-colors duration-200"
            >
              Trade
            </a>
            <a
              href="#"
              className="hover:text-[#f2c118] transition-colors duration-200"
            >
              Wallet
            </a>
            <a
              href="#"
              className="hover:text-[#f2c118] transition-colors duration-200"
            >
              Account
            </a>
          </nav>
        </div>

        {/* Right Side: Login and Sign Up */}
        <div className="space-x-6 hidden sm:flex">
          <a
            href="#"
            className="hover:text-[#f2c118] transition-colors duration-200"
          >
            Login
          </a>
          <a
            href="#"
            className="hover:text-[#f2c118] transition-colors duration-200"
          >
            Sign Up
          </a>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="sm:hidden flex items-center">
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <FaTimes size={24} className="text-white" />
            ) : (
              <FaBars size={24} className="text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden fixed inset-0 bg-[#181a20] bg-opacity-90 transition-all ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col items-center space-y-6 pt-20">
          <a href="#" className="text-white text-xl hover:text-[#f2c118]">
            Markets
          </a>
          <a href="#" className="text-white text-xl hover:text-[#f2c118]">
            Trade
          </a>
          <a href="#" className="text-white text-xl hover:text-[#f2c118]">
            Wallet
          </a>
          <a href="#" className="text-white text-xl hover:text-[#f2c118]">
            Account
          </a>
          <a href="#" className="text-white text-xl hover:text-[#f2c118]">
            Login
          </a>
          <a href="#" className="text-white text-xl hover:text-[#f2c118]">
            Sign Up
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 p-8">
        <div className="w-full max-w-md p-8 rounded-xl transition-all duration-1000">
          <h2 className="text-2xl text-white font-semibold mb-10 text-left">
            Check Wallet Address
          </h2>
          <h5 className="text-sm text-white mb-1 text-left">
            Add Wallet Address
          </h5>
          <form className="flex flex-col items-center gap-4">
            <input
              value={email}
              onChange={handleEmailChange}
              placeholder=""
              required
              className="w-full p-3 rounded-md text-white border-[1px] border-[#666] border-solid bg-[#181a20] focus:outline-none hover:ring-[1px] hover:ring-[#f0b90b]"
            />
            <button
              type="submit"
              className="w-full bg-[#f2c118] text-lg text-black p-3 rounded-lg transition-colors hover:bg-[#d1a10f]"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
