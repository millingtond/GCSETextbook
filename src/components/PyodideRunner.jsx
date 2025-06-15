import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css'; // A nice dark theme for the editor
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

  useEffect(() => {
    async function setupPyodide() {
      try {
        const pyodideInstance = await window.loadPyodide();
        setPyodide(pyodideInstance);
      } catch (error) {
        console.error("Failed to load Pyodide:", error);
        setOutput("Error: Could not initialize the Python environment.");
      } finally {
        setIsLoading(false);
      }
    }
    setupPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodide) return;
    setOutput('Running code...');
    try {
      let capturedOutput = '';
      pyodide.setStdout({
        batched: (str) => {
          capturedOutput += str + '\\n';
        },
      });
      pyodide.setStderr({
        batched: (str) => {
          capturedOutput += str + '\\n';
        },
      });

      await pyodide.runPythonAsync(code);
      setOutput(capturedOutput.trim() || 'Code executed successfully with no output.');

    } catch (error) {
      setOutput(error.toString());
    }
  };

  const copyCode = () => {
      navigator.clipboard.writeText(code).catch(err => console.error('Failed to copy code: ', err));
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
        />
        <button onClick={copyCode} className="copy-code-btn" aria-label="Copy code">📋</button>
      </div>
      <button onClick={runCode} disabled={isLoading} className="run-btn">
        {isLoading ? 'Loading Environment...' : '▶ Run Code'}
      </button>
      <div className="output-container">
        <pre><code>{output}</code></pre>
      </div>
    </div>
  );
}

export default PyodideRunner;
