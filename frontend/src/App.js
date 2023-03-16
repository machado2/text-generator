import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/generate_text' : '../generate_text';

console.log(`API_URL: ${API_URL}`)

function App() {
  const [inputText, setInputText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedText('Generating...');

    try {
      const response = await axios.post(API_URL, {
        prompt: inputText
      });

      setGeneratedText(response.data.generated_text);
    } catch (error) {
      console.error(error);
      setGeneratedText('Error generating text.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      handleGenerate();
    }
  };

  const cursorStyle = isGenerating ? { cursor: 'wait' } : {};

  return (
    <div className="App" style={cursorStyle}>
      <h1>Chatto</h1>
      <textarea
        className="input"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter your prompt here"
        autoFocus
        onKeyDown={handleKeyDown}
      />
      <button className="generateButton" onClick={handleGenerate}>
        Generate
      </button>
      <div className="output" dangerouslySetInnerHTML={{ __html: generatedText }}></div>
    </div>
  );
}

export default App;
