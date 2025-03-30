import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className=" mt-5 footer">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-2">
            <div className="">
              <h6 className="text-uppercase text-white mt-5  ">
                Resources
              </h6>
              <ul className="list-unstyled  mt-4">
                <li>
                  <a href="">Wikipedia </a>
                </li>
                <li>
                  <a href="">React blog</a>
                </li>
                <li>
                  <a href="">Term &amp; Service</a>
                </li>
                <li>
                  <a href="">Angular dev</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-sm-2">
            <div className="">
              <h6 className=" text-uppercase text-white mt-5">Help</h6>
              <ul className="list-unstyled  mt-4">
                <li>
                  <a href="">Sign Up </a>
                </li>
                <li>
                  <a href="">Login</a>
                </li>
                <li>
                  <a href="">Terms of Services</a>
                </li>
                <li>
                  <a href="">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-sm-2">
            <div className="">
              <h6 className=" text-uppercase mt-5">
                Contact Us
              </h6>
              <p className="contact-info mt-4">
                Contact us 
              </p>
              <p className="contact-info">+91 9999999999</p>
            </div>
          </div>
          
          <div className="col-sm-2">
            <div className="">
              <h6 className=" text-uppercase mt-5">
                Developers
              </h6>
              <p className="mt-4">
                Blogger Api
              </p>
              <p  >Developer forum</p>
            </div>
          </div>
           
        </div>
      </div>
     
          



         <hr />
      <div className="text-center">
        <p className=" mb-0 f-14">2024 © VNR, All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;