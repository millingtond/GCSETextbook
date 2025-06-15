import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css';
import { PYODIDE_CONFIG } from '../utils/constants';
import './PyodideRunner.css';

const initialCode = `
# Welcome to the Interactive Python Environment!
# Try changing this code and clicking "Run".

name = "World"
print(f"Hello, {name}!")

for i in range(5):
    print(f"Loop number {i+1}")
`.trim();

function PyodideRunner() {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pyodide, setPyodide] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function setupPyodide() {
      try {
        if (!window.loadPyodide) {
          throw new Error('Pyodide loader not found. Please check your internet connection.');
        }

        const pyodideInstance = await window.loadPyodide(PYODIDE_CONFIG);
        
        if (isMounted) {
          setPyodide(pyodideInstance);
          setIsLoading(false);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to load Pyodide:", error);
        if (isMounted) {
          setError(error.message || "Failed to initialize Python environment");
          setIsLoading(false);
        }
      }
    }

    setupPyodide();

    return () => {
      isMounted = false;
    };
  }, []);

  const runCode = async () => {
    if (!pyodide || isRunning) return;
    
    setIsRunning(true);
    setOutput('Running code...');
    setError(null);
    
    try {
      // Reset output capture
      let capturedOutput = '';
      
      // Set up output capture
      pyodide.setStdout({
        batched: (str) => {
          capturedOutput += str;
        },
      });
      
      pyodide.setStderr({
        batched: (str) => {
          capturedOutput += str;
        },
      });

      // Add timeout protection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Code execution timed out')), 10000);
      });

      // Run the code with timeout
      await Promise.race([
        pyodide.runPythonAsync(code),
        timeoutPromise
      ]);
      
      setOutput(capturedOutput.trim() || 'Code executed successfully with no output.');
    } catch (error) {
      let errorMessage = error.toString();
      
      // Improve error messages
      if (errorMessage.includes('SyntaxError')) {
        errorMessage = `Syntax Error: ${errorMessage}`;
      } else if (errorMessage.includes('IndentationError')) {
        errorMessage = `Indentation Error: Check your code indentation\n${errorMessage}`;
      } else if (errorMessage.includes('NameError')) {
        errorMessage = `Name Error: Variable or function not defined\n${errorMessage}`;
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'Error: Code execution took too long and was stopped.';
      }
      
      setOutput(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        // Could add a toast notification here
        console.log('Code copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
      });
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setError(null);
  };

  if (error && !pyodide) {
    return (
      <div className="pyodide-runner error-state">
        <h4>Interactive Code Example</h4>
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pyodide-runner">
      <h4>Interactive Code Example</h4>
      <div className="editor-container">
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) => highlight(code, languages.python, 'python')}
          padding={10}
          className="code-editor"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
          }}
          textareaId="code-editor"
          disabled={isRunning}
        />
        <div className="editor-controls">
          <button onClick={copyCode} className="copy-code-btn" aria-label="Copy code" title="Copy code">
            📋
          </button>
          <button onClick={resetCode} className="reset-code-btn" aria-label="Reset code" title="Reset to original">
            ↺
          </button>
        </div>
      </div>
      <button 
        onClick={runCode} 
        disabled={isLoading || isRunning} 
        className="run-btn"
        aria-busy={isRunning}
      >
        {isLoading ? 'Loading Environment...' : isRunning ? 'Running...' : '▶ Run Code'}
      </button>
      <div className="output-container" role="log" aria-live="polite">
        <pre><code>{output}</code></pre>
      </div>
    </div>
  );
}

export default PyodideRunner;