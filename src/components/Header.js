import { useState } from "react"
import { Link } from "react-router-dom" // Add this import
import "./header.css"
import wordCollections from "../data/wordCollections";
import { useNavigate } from "react-router-dom";
import { FaArrowDown } from "react-icons/fa";



export default function Header() {

  const navigate = useNavigate();  

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
    // Dynamically generate the links from the word collections keys
    const links = Object.keys(wordCollections).map((category) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize the category name
      path: `/${category}`, // Path should match the dynamic route
    }));

  return (
    <div className="header-container">
      <header className="header">

      <button className="site-title" onClick={toggleMenu}>
          THEEMEN
          <span className={`chevron ${isMenuOpen ? "open" : ""}`}>
            <FaArrowDown size={18} style={{ marginLeft: "0.5rem" ,}} />
          </span>
        </button>

        <button className="site-title"
        onClick={() => navigate("/")}>
          WikiWuertschatz
        </button>

                
        <button className="site-title"
        onClick={() => navigate("/about")}>
          ABOUT
        </button>

      </header>

      <div className={`dropdown-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="dropdown-content">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path} // Use Link's 'to' prop to navigate
              className="menu-link"
              onClick={() => {
                setIsMenuOpen(false); // Close the menu when a link is clicked
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

