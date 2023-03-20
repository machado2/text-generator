import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/generate_text' : '../generate_text';

console.log(`API_URL: ${API_URL}`)

function FormattedText({ inputTextUsed, generatedText }) {
  return (
    <>
      <b>{inputTextUsed?.toString()}</b>
      {generatedText?.toString()}
    </>
  );
}

function App() {
  const [inputText, setInputText] = useState('');
  const [inputTextUsed, setInputTextUsed] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState(() => {
    // Load the history from the localStorage
    const historyJson = localStorage.getItem('chatto-history');
    return historyJson ? JSON.parse(historyJson) : [];
  });

  useEffect(() => {
    // Save the history to the localStorage
    localStorage.setItem('chatto-history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedText('Generating...');

    try {
      const response = await axios.post(API_URL, {
        prompt: inputText
      });

      const outputText = response.data.generated_text;
      const promptIndex = outputText.indexOf(inputText);
      setGeneratedText(outputText.slice(promptIndex + inputText.length).trim())
      setInputTextUsed(inputText);

      // Add the generated text and prompt to history
      const newHistoryItem = { prompt: inputText, generatedText };
      const newHistory = [newHistoryItem, ...history.slice(0, 19)];
      setHistory(newHistory);

    } catch (error) {
      console.error(error);
      setGeneratedText('Error generating text.');
    } finally {
      setIsGenerating(false);
    }
  };

  console.log(`inputTextUsed: ${inputTextUsed}`);
  console.log(`generatedText: ${generatedText}`);


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
      <div className="appcontainer">
        <div className="history">
          <div className="historylistcontainer">
            <ul>
              {history.map((item, index) => (
                <li key={index} onClick={() => {
                  setInputText(item.prompt);
                  setGeneratedText(item.generatedText);
                }}>
                  <FormattedText inputTextUsed={item?.prompt} generatedText={item?.generatedText} />
                </li>
              ))}
            </ul>
          </div>
          <button className='button' onClick={() => setHistory([])}>Clear History</button>
        </div>
        <div className="generationcontainer">
          <textarea
            className="input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your prompt here"
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <button className="button" onClick={handleGenerate}>
            Generate
          </button>
          <div className="output">
            <FormattedText inputTextUsed={inputTextUsed} generatedText={generatedText} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
