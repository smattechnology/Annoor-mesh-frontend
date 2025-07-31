"use client";
import React from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";

const Footer = () => {
  return (
    <div className="footer flex flex-col items-center justify-center p-8 border-t border-gray-200 bg-3 text-gray-300">
      <p>© 2025 Mess Bazar - Annoor Foods. All rights reserved.</p>
      <FloatingWhatsApp
        phoneNumber="+8801840031889"
        accountName="Tech Support"
        notification
        notificationSound
        onSubmit={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
};

export default Footer;
