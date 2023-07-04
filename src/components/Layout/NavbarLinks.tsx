import React, {useRef, useState} from "react";
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
    const [isMenuDropDownOpen, setMenuDropDownOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    const handleMenuMouseEnter = () => {
        setMenuDropDownOpen(true);
    };

    const handleDropDownMouseEnter = () => {
        setMenuDropDownOpen(true);
    };

    const handleDropDownMouseLeave = () => {
        setMenuDropDownOpen(false);
    };

    const handleLinkMouseEnter = (link) => {
        setHoveredLink(link);
    };

    const handleLinkMouseLeave = () => {
        setHoveredLink(null);
    };

    return (
        <ul
            ref={menuRef}
            className="items-center justify-center flex space-x-6 space-y-0"
            onMouseEnter={handleMenuMouseEnter}
        >
            {links.map((link) => (
                <li key={link.name}>
                    {link.name === 'Campaigns' ? (
                        <div className="relative">
                            <button
                                className={`font-semibold text-dark-grey-100 ${
                                    activePath === link.to ? 'text-[#9FC131]' : ''
                                }`}
                                onMouseEnter={() => handleLinkMouseEnter(link.name)}
                                onMouseLeave={handleLinkMouseLeave}
                                onFocus={() => setMenuDropDownOpen(true)}
                                onBlur={() => setMenuDropDownOpen(false)}
                            >
                                {link.name}
                            </button>
                            {isMenuDropDownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-8 w-48 bg-white rounded shadow-md"
                                    onMouseEnter={handleDropDownMouseEnter}
                                    onMouseLeave={handleDropDownMouseLeave}
                                >
                                    {/* Dropdown menu content */}
                                    <ul className="py-2">
                                        <li>
                                            <Link
                                                href="/campaign/pastoralists"
                                                className={`block px-4 py-2 text-base font-semibold ${
                                                    hoveredLink === 'Link 1'
                                                        ? 'text-[#9FC131]'
                                                        : 'text-[#042940]'
                                                }`}
                                                onMouseEnter={() => handleLinkMouseEnter('Link 1')}
                                                onMouseLeave={handleLinkMouseLeave}
                                            >
                                                Pastoralists in Kenya
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/campaign/hotrfk"
                                                className={`block px-4 py-2 text-base font-semibold ${
                                                    hoveredLink === 'Link 2'
                                                        ? 'text-[#9FC131]'
                                                        : 'text-[#042940]'
                                                }`}
                                                onMouseEnter={() => handleLinkMouseEnter('Link 2')}
                                                onMouseLeave={handleLinkMouseLeave}
                                            >
                                                Hotez vs. RFK debate
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
                            className={`block py-2 pl-3 pr-4 text-base font-semibold ${
                                activePath === link.to ? 'text-[#9FC131]' : ''
                            } ${
                                hoveredLink === link.name ? 'text-[#9FC131]' : 'text-[#042940]'
                            } rounded md:p-0`}
                            onMouseEnter={() => handleLinkMouseEnter(link.name)}
                            onMouseLeave={handleLinkMouseLeave}
                        >
                            {link.name}
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );
};
