// import React, { useRef, useState, useEffect } from 'react';
// import Editor from '@monaco-editor/react';
// import axios from 'axios';

// const TEMPLATES = {
//   python: `# Python example
// def greet(name):
//     print("Hello,", name)

// greet("World")
// `,
//   java: `// Java example - class must be named Main
// public class Main {
//     public static void main(String[] args) {
//         System.out.println("Hello from Java");
//     }
// }
// `
// };

// export default function App() {
//   const [language, setLanguage] = useState('python');
//   const [code, setCode] = useState(TEMPLATES.python);
//   const [stdin, setStdin] = useState('');
//   const [output, setOutput] = useState('');
//   const [stderr, setStderr] = useState('');
//   const [running, setRunning] = useState(false);
//   const editorRef = useRef(null);
//   const monacoRef = useRef(null);
//   const [decorations, setDecorations] = useState([]);

//   useEffect(() => {
//     // update template when language changes
//     setCode(TEMPLATES[language]);
//     setOutput('');
//     setStderr('');
//     clearDecorations();
//   }, [language]);

//   function clearDecorations() {
//     if (editorRef.current && monacoRef.current) {
//       const ids = editorRef.current.deltaDecorations(decorations, []);
//       setDecorations([]);
//     }
//   }

//   function handleEditorMount(editor, monaco) {
//     editorRef.current = editor;
//     monacoRef.current = monaco;
//   }

//   function applyErrorDecorations(errorLines) {
//     if (!editorRef.current || !monacoRef.current) return;
//     const ed = editorRef.current;
//     const newDec = (errorLines || []).map(e => ({
//       range: new monacoRef.current.Range(e.line, 1, e.line, 1),
//       options: {
//         isWholeLine: true,
//         className: 'errorLine',
//         glyphMarginClassName: 'errorGlyph',
//         hoverMessage: { value: e.message || 'Error' }
//       }
//     }));
//     const ids = ed.deltaDecorations(decorations, newDec);
//     setDecorations(ids);
//   }

//   async function runCode() {
//     setRunning(true);
//     setOutput('');
//     setStderr('');
//     clearDecorations();

//     try {
// fetch("https://code-runner-backend-8frg.onrender.com/run", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     language: "python",
//     code: "print('Hello World')",
//     stdin: ""
//   })
// })
// .then(res => res.json())
// .then(data => console.log(data));

//       const data = resp.data;
//       setOutput(data.stdout || '');
//       setStderr(data.stderr || '');
//       if (data.errorLines && data.errorLines.length) {
//         applyErrorDecorations(data.errorLines);
//       }
//     } catch (err) {
//       setStderr(err?.response?.data?.error || err.message);
//     } finally {
//       setRunning(false);
//     }
//   }

//   return (
//     <div style={{display:'flex', height:'100vh', gap: '8px', padding: '8px', boxSizing: 'border-box', flexDirection: 'column'}}>
//       <div style={{display:'flex', gap: '8px', alignItems: 'center'}}>
//         <label>
//           Language:
//           <select value={language} onChange={e => setLanguage(e.target.value)} style={{marginLeft:8}}>
//             <option value="python">Python</option>
//             <option value="java">Java</option>
//           </select>
//         </label>
//         <button onClick={runCode} disabled={running} style={{marginLeft:8}}>
//           {running ? 'Running...' : 'Run'}
//         </button>
//         <button onClick={() => { setCode(TEMPLATES[language]); clearDecorations(); }} style={{marginLeft:8}}>Reset</button>
//       </div>

//       <div style={{display: 'flex', gap: '8px', flex: 1}}>
//         <div style={{flex: 1, border: '1px solid #ddd'}}>
//           <Editor
//             height="100%"
//             defaultLanguage={language}
//             language={language}
//             value={code}
//             onChange={(val) => setCode(val)}
//             onMount={handleEditorMount}
//             options={{
//               minimap: { enabled: false },
//               glyphMargin: true,
//               fontSize: 14
//             }}
//           />
//         </div>

//         <div style={{width: 400, display:'flex', flexDirection:'column', gap:8}}>
//           <div style={{flex:1, border:'1px solid #ddd', padding:8, overflow:'auto', background:'#111', color:'#fff'}}>
//             <div style={{fontWeight:'bold'}}>Stdout</div>
//             <pre style={{whiteSpace:'pre-wrap'}}>{output || '(no output)'}</pre>
//             <hr />
//             <div style={{fontWeight:'bold'}}>Stderr</div>
//             <pre style={{whiteSpace:'pre-wrap'}}>{stderr || '(no errors)'}</pre>
//           </div>

//           <div style={{border:'1px solid #ddd', padding:8}}>
//             <div style={{fontWeight:'bold', marginBottom:6}}>STDIN (optional)</div>
//             <textarea value={stdin} onChange={e=>setStdin(e.target.value)} rows={4} style={{width:'100%'}} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const TEMPLATES = {
  python: `# Python example
def greet(name):
    print("Hello,", name)

greet("World")
`,
  java: `// Java example - class must be named Main
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java");
    }
}
`
};

export default function App() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(TEMPLATES.python);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [stderr, setStderr] = useState('');
  const [running, setRunning] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [decorations, setDecorations] = useState([]);

  useEffect(() => {
    // update template when language changes
    setCode(TEMPLATES[language]);
    setOutput('');
    setStderr('');
    clearDecorations();
  }, [language]);

  function clearDecorations() {
    if (editorRef.current && monacoRef.current) {
      editorRef.current.deltaDecorations(decorations, []);
      setDecorations([]);
    }
  }

  function handleEditorMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }

  function applyErrorDecorations(errorLines) {
    if (!editorRef.current || !monacoRef.current) return;
    const ed = editorRef.current;
    const newDec = (errorLines || []).map(e => ({
      range: new monacoRef.current.Range(e.line, 1, e.line, 1),
      options: {
        isWholeLine: true,
        className: 'errorLine',
        glyphMarginClassName: 'errorGlyph',
        hoverMessage: { value: e.message || 'Error' }
      }
    }));
    const ids = ed.deltaDecorations(decorations, newDec);
    setDecorations(ids);
  }

  async function runCode() {
    setRunning(true);
    setOutput('');
    setStderr('');
    clearDecorations();

    try {
      const resp = await axios.post(
        "https://code-runner-backend-8frg.onrender.com/run",
        { language, code, stdin }
      );

      const data = resp.data;
      setOutput(data.stdout || '');
      setStderr(data.stderr || '');
      if (data.errorLines && data.errorLines.length) {
        applyErrorDecorations(data.errorLines);
      }
    } catch (err) {
      setStderr(err?.response?.data?.error || err.message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div style={{display:'flex', height:'100vh', gap: '8px', padding: '8px', boxSizing: 'border-box', flexDirection: 'column'}}>
      <div style={{display:'flex', gap: '8px', alignItems: 'center'}}>
        <label>
          Language:
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{marginLeft:8}}>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </label>
        <button onClick={runCode} disabled={running} style={{marginLeft:8}}>
          {running ? 'Running...' : 'Run'}
        </button>
        <button onClick={() => { setCode(TEMPLATES[language]); clearDecorations(); }} style={{marginLeft:8}}>Reset</button>
      </div>

      <div style={{display: 'flex', gap: '8px', flex: 1}}>
        <div style={{flex: 1, border: '1px solid #ddd'}}>
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={(val) => setCode(val)}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              glyphMargin: true,
              fontSize: 14
            }}
          />
        </div>

        <div style={{width: 400, display:'flex', flexDirection:'column', gap:8}}>
          <div style={{flex:1, border:'1px solid #ddd', padding:8, overflow:'auto', background:'#111', color:'#fff'}}>
            <div style={{fontWeight:'bold'}}>Stdout</div>
            <pre style={{whiteSpace:'pre-wrap'}}>{output || '(no output)'}</pre>
            <hr />
            <div style={{fontWeight:'bold'}}>Stderr</div>
            <pre style={{whiteSpace:'pre-wrap'}}>{stderr || '(no errors)'}</pre>
          </div>

          <div style={{border:'1px solid #ddd', padding:8}}>
            <div style={{fontWeight:'bold', marginBottom:6}}>STDIN (optional)</div>
            <textarea value={stdin} onChange={e=>setStdin(e.target.value)} rows={4} style={{width:'100%'}} />
          </div>
        </div>
      </div>
    </div>
  );
}
