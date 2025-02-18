import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logoImage from "@/public/rockstock1.svg";
import twitterIcon from '@/public/icons/twitter.png';
import instagramIcon from '@/public/icons/instagram.png';
import facebookIcon from '@/public/icons/facebook.jpg';
import whatsappIcon from '@/public/icons/whatsapp.png';

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
};

const FooterColumn: React.FC<FooterColumnProps> = ({ title, children }) => (
  <div className="flex flex-col items-center md:items-start space-y-3">
    <h4 className="text-xl font-semibold text-black">{title}</h4>
    {children}
  </div>
);

const Footer: React.FC = () => {
  const email = 'your-email@example.com';
  const subject = 'General Inquiry';
  const body = 'Hello,\n\nI am writing to inquire about...';
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <footer className="text-black">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between">
          <Image 
          src={logoImage}
          alt="Rockstock Logo"
          width={200}
          height={200}
          className="object-contain w-[100px] h-auto md:w-[200px]"
          />
          <div className="flex flex-wrap justify-center gap-8 md:gap-10 md:justify-between w-full">
            <FooterColumn title="Rockstock World">
              <ul className="space-y-2 text-sm text-black">
                <li><Link href="/about" className="hover:text-red-600">About Rockstock</Link></li>
                <li><Link href="https://www.linkedin.com" className="hover:text-red-600">Join Our Crew</Link></li>
                <li><Link href="/teams" className="hover:text-red-600">Rock Partners</Link></li>
                <li><Link href="https://www.medium.com" className="hover:text-red-600">The Rockstock Blog</Link></li>
              </ul>
            </FooterColumn>
            <FooterColumn title="Rock Support">
              <ul className="space-y-2 text-sm text-black">
                <li><Link href="/helpcenter" className="hover:text-red-600">Help Center</Link></li>
                <li><Link href="/faq" className="hover:text-red-600">FAQs</Link></li>
                <li><Link href="/terms" className="hover:text-red-600">Terms & Conditions</Link></li>
                <li><Link href="/policy" className="hover:text-red-600">Privacy Policy</Link></li>
              </ul>
            </FooterColumn>
            <FooterColumn title="Get in Touch">
              <ul className="space-y-2 text-sm text-black">
                <li>
                  <Link href={mailtoLink} className="hover:text-red-600">Contact Us via Email</Link>
                </li>
              </ul>
            </FooterColumn>
            <FooterColumn title="Follow the Rhythm">
              <div className="flex gap-4">
                <Link href="https://facebook.com">
                  <Image src={facebookIcon} alt="Facebook" width={24} height={24} />
                </Link>
                <Link href="https://twitter.com">
                  <Image src={twitterIcon} alt="Twitter" width={24} height={24} />
                </Link>
                <Link href="https://instagram.com">
                  <Image src={instagramIcon} alt="Instagram" width={24} height={24} />
                </Link>
                <Link href="https://whatsapp.com">
                  <Image src={whatsappIcon} alt="WhatsApp" width={24} height={24} />
                </Link>
              </div>
            </FooterColumn>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
