import React from 'react';
import { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from '@chakra-ui/react';

const CookieBanner = () => {
  const [accepted, setAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const acceptCookies = () => {
    setAccepted(true);
    localStorage.setItem('cookieConsent', 'true');
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      setAccepted(true);
    }
  }, []);

  if (accepted) {
    return null; // Don't show the banner if cookies are accepted.
  }

  const CookiePolicyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cookie Policy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              Some text
            </p>
            {/* Add your detailed cookie policy text here */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Accept
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <>
    <div className="bg-blue-500 p-4 fixed bottom-0 w-full text-white z-[20]">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          We use cookies to improve your experience. By continuing to use
          this website, you agree to our{' '}
          <span
            onClick={openModal}
            className="text-white-500 cursor-pointer underline"
          >
            cookie policy
          </span>
          .{' '}
          <button
            onClick={() => {
              acceptCookies();
              openModal(); // Open the modal when accepting cookies.
            }}
            className="bg-white text-blue-500 py-1 px-2 rounded hover:bg-blue-500 hover:text-white hover:border-white ml-3 border border-1"
          >
            Accept
          </button>
        </p>
      </div>
    </div>
    <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cookie Policy</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <hr className="my-3" />
            <div>
                <p className="text-md"><span className='font-semibold'>Effective Date:</span> 28 October 2023</p>
                <p className="text-md"><span className='font-semibold'>Last Updated:</span> 28 October 2023</p>
            </div>
            <div className="my-4">
                <h2 className="text-lg font-semibold">Introduction</h2>
                <p>
                This Cookie Policy explains how our website uses cookies to enhance your experience. By continuing to use this website, you agree to our use of cookies as described below.
                </p>
            </div>
            <div className="my-4">
                <h2 className="text-lg font-semibold">What Are Cookies?</h2>
                <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide valuable information to website owners.
                </p>
            </div>
            <div className="my-4">
                <h2 className="text-lg font-semibold">How We Use Cookies</h2>
                <p>
                    <ul className="list-disc list-inside pl-4">
                        <li>
                        Analyze website traffic and usage patterns.
                        </li>
                        <li>
                        Understand how visitors interact with our website.
                        </li>
                        <li>
                        Improve our website&apos;s performance and user experience.
                        </li>
                    </ul>
                </p>
                <br></br>
                <p>
                Google Analytics is a web analytics service provided by Google, Inc. (&quot;Google&quot;). It uses cookies to collect information about your use of our website, including your IP address, which is anonymized. This data is transmitted to Google&apos;s servers but does not personally identify you.
                </p>
            </div>
            <div className="my-4">
                <h2 className="text-lg font-semibold">Cookie Settings</h2>
                <p>
                You can control and manage your cookie preferences through your browser settings. Most web browsers allow you to refuse or accept cookies and to delete them.
                </p>
            </div>
            <div className="my-4">
                <h2 className="text-lg font-semibold">Questions and Contact Information</h2>
                <p>
                If you have any questions about our Cookie Policy or the cookies used on our website, please <a href="mailto:wladimir.weinbender@divadonate.xyz">contact us</a>.
                </p>
            </div>
            <div className="my-4">
                <h2 className="text-lg font-semibold">Changes to This Cookie Policy</h2>
                <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed about our use of cookies.
                </p>
            </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            className="text-white"
            sx={{
                backgroundColor: '#005C53',
                _hover: {
                    backgroundColor: '#005C53',
                },
            }}
            onClick={closeModal}>
            Understood
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>

  );
};

export default CookieBanner;
