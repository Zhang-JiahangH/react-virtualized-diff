import React from 'react';
import { DiffViewer } from 'react-virtualized-diff';

const original = `import React from 'react';

export function hello() {
  return 'hello';
}

export function sum(a: number, b: number) {
  return a + b;
}

// unchanged line 1
// unchanged line 2
// unchanged line 3
// unchanged line 4
// unchanged line 5
`;

const modified = `import React from 'react';

export function hello() {
  return 'hello world';
}

export function sum(a: number, b: number) {
  return a + b + 1;
}

// unchanged line 1
// unchanged line 2
// unchanged line 3
// unchanged line 4
// unchanged line 5
`;

export default function App(): React.JSX.Element {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '40px auto',
        padding: '0 16px',
      }}
    >
      <h1>virtualized-diff-viewer demo</h1>
      <p>A high-performance React diff viewer for large files.</p>

      <DiffViewer
        original={original}
        modified={modified}
        contextLines={2}
        height={500}
      />
    </div>
  );
}