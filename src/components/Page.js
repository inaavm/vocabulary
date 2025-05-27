import React from "react";
import { useState } from "react";
import useWikipediaSearch from "../hooks/useWikipediaSearch";
import wordCollections from "../data/wordCollections";
import { useParams } from "react-router-dom";
import "./page.css";
import Header from "./Header";
import { FaArrowRight } from "react-icons/fa"; // Arrow icon
import { RiDoubleQuotesL } from "react-icons/ri";
// Import DotLottieReact
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Page() {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //  this allows to use dynamic page 
  const { category } = useParams(); 

  const wordList = wordCollections[category] || []; 
  const { results, loading, error, pendingWords } = useWikipediaSearch(wordList);
  
  if (!wordCollections[category]) {
    return <div>Category not found!</div>;
  }

  // Only show the top-level loading state when first loading the entire collection
  const showFullPageLoading = loading && Object.keys(results).length === 0;

  return (
    <div>
      <Header onMenuToggle={setIsMenuOpen} isMenuOpen={isMenuOpen} />

      <div className="container-results" style={{ marginTop: isMenuOpen ? "200px" : "0px" }}>
        {showFullPageLoading ? (
          <div className="loading">
            <DotLottieReact
              src="https://lottie.host/58490d7b-2743-4fd4-95eb-4b4782189346/jC6pFN8Efq.lottie"
              loop
              autoplay
              style={{ height: "200px", width: "200px" }}
            />
            <div className="loading-text">Checking words on Wikipedia...</div>
          </div>
        ) : (
          <div className="results-list">
            {wordCollections[category].map((word) => (
              <a className="result-row" 
                key={word}
                href={results[word]?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="icon-word">
                  <div className="icon">
                    <FaArrowRight size={20} style={{ transform: "rotate(315deg)" }} />
                  </div>
                  <div className="word-column">
                    <span className="word-text">{word}</span>
                  </div>
                </div>

                <div className="snippet-column">
                  {pendingWords && pendingWords[word] ? (
                    // Individual loading state per word
                    <div className="loading-word">
                      <span>Loading...</span>
                    </div>
                  ) : results[word]?.found ? (
                    <div className="snippet-with-icon">
                      <RiDoubleQuotesL size={20} />
                      <span
                        className="wiki-snippet"
                        dangerouslySetInnerHTML={{ __html: `${results[word].snippet} ... ` }}
                      />
                    </div>
                  ) : (
                    <span className="not-found">
                      {results[word]?.error || "No information found"}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}