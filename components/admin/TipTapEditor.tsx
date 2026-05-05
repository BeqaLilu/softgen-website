'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon,
} from 'lucide-react';
import { useEffect } from 'react';

/**
 * TipTap rich-text editor used for project / article bodies.
 * Toolbar per build-prompt §"Edit drawer fields" — H2, H3, Bold, Italic,
 * Link, Image, Bullet/Numbered list, Blockquote.
 *
 * Stores TipTap JSON (passed back via onChange). To render the saved JSON
 * on the public side, use TipTap's HTML serializer (`generateHTML`) at
 * build-time per slug.
 */
export function TipTapEditor({
  value,
  onChange,
  placeholder,
  uploadFolder = 'editor',
}: {
  value: object | null;
  onChange: (v: object) => void;
  placeholder?: string;
  uploadFolder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value ?? { type: 'doc', content: [] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap',
        style: [
          'min-height: 240px',
          'padding: 16px',
          'border: 1px solid var(--border)',
          'border-top: none',
          'border-radius: 0 0 var(--radius-md) var(--radius-md)',
          'outline: none',
          'background: var(--surface)',
        ].join(';'),
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) return;
    // Sync external value updates (e.g. when a different row's drawer opens).
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(value ?? { type: 'doc', content: [] });
    if (current !== next) editor.commands.setContent(value ?? { type: 'doc', content: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, JSON.stringify(value)]);

  if (!editor) return null;

  const ToolbarBtn = ({
    on,
    onClick,
    label,
    children,
  }: {
    on?: boolean;
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        background: on ? 'var(--primary-soft)' : 'transparent',
        color: on ? 'var(--primary)' : 'var(--text-secondary)',
        border: 'none',
        padding: 6,
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );

  const insertLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImage = async () => {
    const file = await pickFile('image/*');
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', uploadFolder);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = (await res.json()) as { ok: boolean; url?: string };
      if (json.ok && json.url) {
        editor.chain().focus().setImage({ src: json.url }).run();
      }
    } catch {
      // swallow — admin can retry
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        role="toolbar"
        aria-label="Editor toolbar"
        style={{
          display: 'flex',
          gap: 4,
          padding: 6,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
          background: 'var(--bg-soft)',
          flexWrap: 'wrap',
        }}
      >
        <ToolbarBtn label="Heading 2" on={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </ToolbarBtn>
        <ToolbarBtn label="Heading 3" on={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </ToolbarBtn>
        <ToolbarBtn label="Bold" on={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarBtn>
        <ToolbarBtn label="Italic" on={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarBtn>
        <ToolbarBtn label="Bullet list" on={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarBtn>
        <ToolbarBtn label="Numbered list" on={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarBtn>
        <ToolbarBtn label="Blockquote" on={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarBtn>
        <ToolbarBtn label="Link" on={editor.isActive('link')} onClick={insertLink}>
          <LinkIcon size={16} />
        </ToolbarBtn>
        <ToolbarBtn label="Insert image" onClick={insertImage}>
          <ImageIcon size={16} />
        </ToolbarBtn>
      </div>
      <EditorContent editor={editor} placeholder={placeholder} />
      <style jsx global>{`
        .tiptap p { margin: 0 0 12px; line-height: 1.6; }
        .tiptap h2 { font-family: var(--font-display); font-weight: 700; font-size: 22px; margin: 20px 0 10px; }
        .tiptap h3 { font-family: var(--font-display); font-weight: 700; font-size: 18px; margin: 16px 0 8px; }
        .tiptap ul, .tiptap ol { margin: 0 0 12px; padding-left: 22px; }
        .tiptap li { margin-bottom: 4px; }
        .tiptap blockquote { border-left: 3px solid var(--primary); padding-left: 14px; color: var(--text-secondary); margin: 12px 0; }
        .tiptap a { color: var(--primary); text-decoration: underline; }
        .tiptap img { max-width: 100%; border-radius: var(--radius-md); margin: 12px 0; }
      `}</style>
    </div>
  );
}

function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}
