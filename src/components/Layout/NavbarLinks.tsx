import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import campaigns from '../../../config/campaigns.json'

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
  {
    to: "/faq",
    name: "FAQs",
  },
];

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
                                className={'font-semibold text-dark-grey-100 hover:text-[#9FC131]'}
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
                                        {campaigns.map(campaign => 
                                            <li key={campaign.campaignId} className="text-center">
                                                <Link
                                                    href={campaign.path}
                                                    className={'block px-4 py-2 text-base font-semibold hover:text-[#9FC131]'}
                                                    onMouseEnter={() => handleLinkMouseEnter(campaign.path)}
                                                    onMouseLeave={handleLinkMouseLeave}
                                                >
                                                    {campaign.title}
                                                </Link>
                                            </li>      
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href={link.to}
                            onMouseEnter={handleMenuClose}
                            onMouseLeave={handleMenuClose}
                            className={'block py-2 pl-3 pr-4 text-base font-semibold hover:text-[#9FC131]'}
                        >
                            {link.name}
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );
};