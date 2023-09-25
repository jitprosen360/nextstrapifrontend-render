import React, { useState, useEffect } from "react";
import Wrapper from "./Wrapper";
import { signOut, useSession , getSession  } from 'next-auth/react';
import Link from "next/link";
import Menu from "./Menu";
import MenuMobile from ".//MenuMobile";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { BiMenuAltRight } from "react-icons/bi";
import Cookies from "js-cookie";
import { VscChromeClose } from "react-icons/vsc";
import { fetchDataFromApi } from "../src/utils/api";
import  {useSelector}  from "react-redux";
import { useRouter } from 'next/router';

const Header = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const cartItems  = useSelector((state) => state.cart.cartItems);
    const favItems  = useSelector((state) => state.fav.favItems);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [showCatMenu, setShowCatMenu] = useState(false);
    const [show, setShow] = useState("translate-y-0");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [categories, setCategories] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  

    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY && !mobileMenu) {
                setShow("-translate-y-[80px]");
            } else {
                setShow("shadow-sm");
            }
        } else {
            setShow("translate-y-0");
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data } = await fetchDataFromApi("/api/categories?populate=*");
        setCategories(data);
    };
    useEffect(() => {
        if (session == null) return;
        console.log('session.jwt', session.jwt);
      }, [session]);

      const handleSignOut = async (event) => {
        event.preventDefault(); // Prevent the default behavior (form submission / page reload)
        
        try {
          await signOut({ redirect: false });
          const session = await getSession();
          if (!session) {
            // Remove specific cookies
            document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            console.log("Cookies removed successfully!");
          }
        } catch (error) {
          console.error("Error signing out:", error);
        }
   
        router.push('/signin');
      };
      

    return (
        <header
            className={`w-full h-[50px] md:h-[80px] bg-white flex items-center justify-between z-20 sticky top-0 transition-transform duration-300 ${show}`}
        >
            <Wrapper className="h-[60px] flex justify-between items-center">
                <Link href="/">
                    <img src="/logo.png" className="w-[100px] md:w-[80px]" />
                </Link>

                <Menu
                    showCatMenu={showCatMenu}
                    setShowCatMenu={setShowCatMenu}
                    categories={categories}
                />

                {mobileMenu && (
                    <MenuMobile
                        showCatMenu={showCatMenu}
                        setShowCatMenu={setShowCatMenu}
                        setMobileMenu={setMobileMenu}
                        categories={categories}
                    />
                )}
   

                <div className="flex items-center gap-2 text-black">
                    {/* Icon start */}
                  <Link href="/fav">
                        <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
                        <IoMdHeartEmpty className="text-[19px] md:text-[24px]" />
                           
                            {favItems.length > 0 && 
                                    <div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
                                        {favItems.length}
                                    </div>
                                }
                           
                        </div>
                    </Link>
                    {/* Icon end */}

                    {/* Icon start */}
                    <Link href="/cart">
                        <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
                            <BsCart className="text-[15px] md:text-[20px]" />
                           
                            {cartItems.length > 0 && 
                                    <div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
                                        {cartItems.length}
                                    </div>
                                }
                           
                        </div>
                    </Link>
              
{ session ? ( <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        >
         {session.user.email}
         {session.user.username}
         {/* {console.log(session)} */}
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            
            <h3 className="block px-4 py-2 text-sm text-gray-700 ">My Account</h3>
            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              Profile 
            </a>
            <a href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
               Orders
            </a>
         
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
            <button onClick={(event) => handleSignOut(event)}>Sign out</button>
            </a>
          </div>
        </div>
      )}
    </div>
   ) : (
    <Link href="/signin">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-sm">Sign In</button>
  </Link>
  )}


{session ? (
        ""
      ) : (
        <Link href="/register">
        <button className="bg-green-500 hover:bg-green-700 text-white 
        font-bold py-2 px-4 rounded-full shadow-sm">Sign up</button>
      </Link>
      )}


 
                   
                    {/* Mobile icon start */}
                    <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex md:hidden justify-center items-center hover:bg-black/[0.05] cursor-pointer relative -mr-2">
                        {mobileMenu ? (
                            <VscChromeClose
                                className="text-[16px]"
                                onClick={() => setMobileMenu(false)}
                            />
                        ) : (
                            <BiMenuAltRight
                                className="text-[20px]"
                                onClick={() => setMobileMenu(true)}
                            />
                        )}
                    </div>
                    {/* Mobile icon end */}
                </div>
            </Wrapper>
        </header>
    );
};

export default Header;