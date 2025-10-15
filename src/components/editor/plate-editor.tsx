"use client";

import { Editor, EditorContainer } from "@/src/components/ui/editor";

export function PlateEditor() {
	return (
		<EditorContainer>
			<Editor variant="demo" placeholder="Type..." />
		</EditorContainer>
	);
}

// const value = normalizeNodeId([
//   {
//     children: [{ text: 'Basic Editor' }],
//     type: 'h1',
//   },
//   {
//     children: [{ text: 'Heading 2' }],
//     type: 'h2',
//   },
//   {
//     children: [{ text: 'Heading 3' }],
//     type: 'h3',
//   },
//   {
//     children: [{ text: 'This is a blockquote element' }],
//     type: 'blockquote',
//   },
//   {
//     children: [
//       { text: 'Basic marks: ' },
//       { bold: true, text: 'bold' },
//       { text: ', ' },
//       { italic: true, text: 'italic' },
//       { text: ', ' },
//       { text: 'underline', underline: true },
//       { text: ', ' },
//       { strikethrough: true, text: 'strikethrough' },
//       { text: '.' },
//     ],
//     type: 'p',
//   },
// ]);
