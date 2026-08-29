import type { editor } from 'monaco-editor';

export const tokyoNightSwarmTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '565f89', fontStyle: 'italic' }, // secondary
    { token: 'keyword', foreground: 'bb9af7' },          // purple
    { token: 'keyword.control', foreground: 'bb9af7' },
    { token: 'storage.type', foreground: 'bb9af7' },
    { token: 'type', foreground: '2ac3de' },              // azure
    { token: 'type.identifier', foreground: '2ac3de' },
    { token: 'identifier', foreground: 'a9b1d6' },        // body-dark
    { token: 'entity.name.function', foreground: '7aa2f7' }, // blue
    { token: 'function', foreground: '7aa2f7' },
    { token: 'variable', foreground: 'a9b1d6' },          // body-dark
    { token: 'variable.parameter', foreground: 'e0af68' }, // warning
    { token: 'string', foreground: '9ece6a' },            // olive
    { token: 'number', foreground: 'e0af68' },            // warning
    { token: 'operator', foreground: '2ac3de' },          // azure
    { token: 'delimiter', foreground: '828bb8' },         // muted-dark
  ],
  colors: {
    'editor.background': '#181c31',             // background-dark
    'editor.foreground': '#a9b1d6',             // body-dark
    'editor.lineHighlightBackground': '#1d223d', // background-dark-shade1
    'editor.selectionBackground': '#222847',     // background-dark-shade2
    'editorCursor.foreground': '#a9b1d6',        // body-dark
    'editorLineNumber.foreground': '#3c4356',    // secondary-shade2
    'editorLineNumber.activeForeground': '#828bb8', // muted-dark
    'editorIndentGuide.background': '#222847',   // background-dark-shade2
    'editorIndentGuide.activeBackground': '#49516f', // secondary-shade1
    'editorGutter.background': '#181c31',        // background-dark
    'scrollbarSlider.background': '#272e5080',   // background-dark-shade3 at 50%
    'scrollbarSlider.hoverBackground': '#49516fa0', // secondary-shade1
  },
};
