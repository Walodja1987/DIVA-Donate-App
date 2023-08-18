import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";

type NavbarLinksProps = {
  activePath: string;
};

const links = [
  {
    to: "/",
    name: "Home",
  },
  {
    to: "/campaign",
    name: "Campaigns",
  },
  {
    to: "/donations",
    name: "My Donations",
  },
  // {
  //   to: "",
  //   name: "My Campaigns",
  // },
  {
    to: "/faq",
    name: "FAQs",
  },
];
const Menu = () => {
  return (
      <>
        <div className="dropdown-menu">
          <a href={"/"}>Current Campaign</a>
          <a href={"/"}>Pilot Campaign</a>
        </div>
      </>
  )
}
export const NavbarLinks = ({ activePath }: NavbarLinksProps) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);

    const handleMenuToggle = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleMenuClose = () => {
        setMenuOpen(false);
    };

    const handleLinkMouseEnter = (link: any) => {
        setHoveredLink(link);
    };

    const handleLinkMouseLeave = () => {
        setHoveredLink(null);
    };

    return (
        <ul className="items-center justify-center flex space-x-6 space-y-0">
            {links.map((link) => (
                <li key={link.name}>
                    {link.name === 'Campaigns' ? (
                        <div className="relative">
                            <button
                                className={`font-semibold text-dark-grey-100 ${
                                    activePath === link.to ? 'text-[#9FC131]' : ''
                                }`}
                                // onMouseLeave={handleMenuClose}
                                onFocus={handleMenuToggle}
                                onBlur={handleMenuToggle}
                                onClick={handleMenuToggle}
                                onMouseEnter={handleMenuToggle}
                            >
                                {link.name}
                            </button>
                            {isMenuOpen && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                                    <ul
                                        onMouseLeave={handleMenuClose}
                                        className="w-48 bg-white rounded shadow-md"
                                    >
                                        <li>
                                            <Link
                                                href="/campaign/pastoralists-1"
                                                className={`block px-4 py-2 text-base font-semibold ${
                                                    hoveredLink === '/campaign/pastoralists-1'
                                                        ? 'text-[#9FC131]'
                                                        : 'text-[#042940]'
                                                }`}
                                                onMouseEnter={() => handleLinkMouseEnter('/campaign/pastoralists-1')}
                                                onMouseLeave={handleLinkMouseLeave}
                                            >
                                                Pastoralists in Kenya 1.0
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/campaign/pastoralists-2"
                                                className={`block px-4 py-2 text-base font-semibold ${
                                                    hoveredLink === '/campaign/pastoralists-2' ? 'text-[#9FC131]' : 'text-[#042940]'
                                                }`}
                                                onMouseEnter={() => handleLinkMouseEnter('/campaign/pastoralists-2')}
                                                onMouseLeave={handleLinkMouseLeave}
                                            >
                                                Pastoralists in Kenya 2.0
                                            </Link>
                                        </li>
                                        {/* Add more dropdown links as needed */}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href={link.to}
                            onMouseEnter={handleMenuClose}
                            onMouseLeave={handleMenuClose}
                            className={`block py-2 pl-3 pr-4 text-base font-semibold ${
                                activePath === link.to ? 'text-[#9FC131]' : ''
                            }`}
                        >
                            {link.name}
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );
};