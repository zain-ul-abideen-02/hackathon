import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./PagenoFound.css"; // 🎨 external CSS file

const PageNotFound = () => {
  return (
    <div className="notfound-container">
      {/* Background gradient orbs */}
      <div className="orb orb-top"></div>
      <div className="orb orb-bottom"></div>

      {/* 404 Title */}
      <h1 className="notfound-title">404</h1>

      {/* Subheading */}
      <h2 className="notfound-heading">Oops! Page Not Found</h2>

      {/* Description */}
      <p className="notfound-description">
        The page you’re looking for doesn’t exist or might have been moved.
        Let’s take you back where the magic happens.
      </p>

      {/* Back Button */}
      <Link to="/" className="notfound-button">
        <ArrowLeft size={20} />
        Go Back Home
      </Link>

      {/* Illustration */}
      <div className="notfound-image">
        <img
          src="https://illustrations.popsy.co/violet/error-404.svg"
          alt="404 illustration"
        />
      </div>
    </div>
  );
};

export default PageNotFound;
