import { useState, useEffect } from "react";

const useWikipediaSearch = (wordCollection) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Track which words are currently being fetched
  const [pendingWords, setPendingWords] = useState({});

  const fetchWikipediaData = async (word) => {
    try {
      const response = await fetch(
        `https://lb.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          word
        )}&format=json&origin=*`,
        { mode: "cors" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.query?.search?.length > 0) {
        const snippet = data.query.search[0].snippet;
        const highlightedSnippet = snippet.replace(
          new RegExp(`(${word})`, "gi"),
          "<mark>$1</mark>"
        );

        return {
          found: true,
          title: data.query.search[0].title,
          snippet: highlightedSnippet,
          url: `https://lb.wikipedia.org/wiki/${encodeURIComponent(
            data.query.search[0].title.replace(/ /g, "_")
          )}`,
        };
      } else {
        return { found: false, error: `No results found for word: ${word}` };
      }
    } catch (err) {
      console.error(`Error fetching data for "${word}":`, err);
      return { found: false, error: `Error fetching data: ${err.message}` };
    }
  };

  const checkWords = async () => {
    setLoading(true);
    setError("");
    setResults({});
    
    // Initialize pending state for all words
    const initialPending = {};
    wordCollection.forEach(word => {
      initialPending[word] = true;
    });
    setPendingWords(initialPending);

    // Process all words in parallel instead of sequentially
    const promises = wordCollection.map(async (word) => {
      // Add a small random delay to prevent all requests firing at exactly the same time
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
      const result = await fetchWikipediaData(word);
      
      // Update results as they come in
      setResults(prevResults => ({
        ...prevResults,
        [word]: result
      }));
      
      // Mark this word as no longer pending
      setPendingWords(prev => ({
        ...prev,
        [word]: false
      }));
      
      return { word, result };
    });

    await Promise.all(promises);
    setLoading(false);
  };

  useEffect(() => {
    setResults({});
    setLoading(true);
    checkWords();
  }, [JSON.stringify(wordCollection)]);

  return { results, loading, error, pendingWords };
};

export default useWikipediaSearch;