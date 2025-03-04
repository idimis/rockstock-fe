'use client';

import React, { useState, useEffect, useRef } from 'react';

const AISection: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [responses, setResponses] = useState<string[]>([]);
  const [question, setQuestion] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [displayedText, setDisplayedText] = useState<string>('');
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const qnaTemplates: { question: string; answer: string }[] = [
    { question: 'What is Rockstock?', answer: 'Rockstock is a furniture brand for those who live loud, with bold gothic and emo-inspired designs.' },
    { question: 'Who is Rockstock for?', answer: 'For those who still embrace their dark aesthetic and want furniture that speaks to their identity.' },
    { question: 'Where is Rockstock based?', answer: 'Rockstock operates online, shipping to various locations with a strong focus on quality and style.' },
    { question: 'How can I order from Rockstock?', answer: 'Simply browse our catalog online, add to cart, and proceed with secure checkout.' }
  ];

  const handleSend = (query: string) => {
    if (query.trim() === '') return;

    setQuestion(query);
    setIsThinking(true);
    setDisplayedText('');

    const matchedResponse = qnaTemplates.find(qna => query.toLowerCase().includes(qna.question.toLowerCase()));
    const fullResponse = matchedResponse ? matchedResponse.answer : `Not sure about that, but let's just say, Rockstock never plays it safe.`;

    setTimeout(() => {
      setIsThinking(false);
      setResponses([fullResponse]);

      let i = 0;
      const typingInterval = setInterval(() => {
        setDisplayedText(fullResponse.slice(0, i));
        i++;
        if (i > fullResponse.length) clearInterval(typingInterval);
      }, 50);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 1) {
      const filteredSuggestions = qnaTemplates
        .map(qna => qna.question)
        .filter(q => q.toLowerCase().startsWith(value.toLowerCase()));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const resetChat = () => {
    setInput('');
    setQuestion(null);
    setResponses([]);
    setDisplayedText('');
    setSuggestions([]);
  };

  return (
    <div className="py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl mb-8 font-bold text-black">Rockstock AI. Ask me anything.</h2>

        {!question && (
          <div className="flex flex-col relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask something..."
              className="border border-black text-black rounded-md p-2"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full border border-black rounded-md mt-1 bg-white">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSend(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => handleSend(input)}
              className="border-2 border-red-600 text-red-600 rounded-md p-2 mt-4 hover:bg-red-600 hover:text-white transition duration-300"
            >
              Send
            </button>
          </div>
        )}

        {question && (
          <div className="mt-8">
            <p className="font-semibold text-black">{question}</p>
            {isThinking ? (
              <p className="text-gray-500 mt-2">Thinking...</p>
            ) : (
              <p className="mt-4 text-black">{displayedText}</p>
            )}

            {!isThinking && displayedText === responses[0] && (
              <button
                onClick={resetChat}
                className="mt-6 border-2 border-red-600 text-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition duration-300"
              >
                Ask Another
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISection;
