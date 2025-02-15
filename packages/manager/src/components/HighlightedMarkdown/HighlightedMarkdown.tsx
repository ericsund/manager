/* eslint-disable @typescript-eslint/no-var-requires */
import classNames from 'classnames';
import * as hljs from 'highlight.js/lib/core';
import * as React from 'react';
import { makeStyles, Theme } from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import 'src/formatted-text.css';
import { sanitizeHTML } from 'src/utilities/sanitize-html';
import { unsafe_MarkdownIt } from 'src/utilities/markdown';
import sanitize from 'sanitize-html';
// Register all languages we intend to use
// This is not great. Require doesn't work in the broswer and modern TS/JS tooling
// gets very upset.
hljs.registerLanguage('apache', require('highlight.js/lib/languages/apache'));
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
);
hljs.registerLanguage('nginx', require('highlight.js/lib/languages/nginx'));
hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'));

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .hljs': {
      color: theme.color.offBlack,
    },
  },
}));

export type SupportedLanguage =
  | 'plaintext'
  | 'apache'
  | 'bash'
  | 'javascript'
  | 'nginx'
  | 'yaml';

export interface HighlightedMarkdownProps {
  textOrMarkdown: string;
  language?: SupportedLanguage;
  sanitizeOptions?: sanitize.IOptions;
}

export const HighlightedMarkdown: React.FC<HighlightedMarkdownProps> = (
  props
) => {
  const classes = useStyles();
  const { language, textOrMarkdown, sanitizeOptions } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);

  /**
   * If the language prop is provided, we'll try to override the language
   * auto detection to specify the selected language.
   */
  React.useEffect(() => {
    if (language) {
      hljs.configure({
        languages: [language],
      });
    }
  }, [language]);

  const unsafe_parsedMarkdown = unsafe_MarkdownIt.render(textOrMarkdown);

  const sanitizedHtml = sanitizeHTML(unsafe_parsedMarkdown, sanitizeOptions);

  // Adapted from https://stackblitz.com/edit/react-highlighted-markdown?file=highlighted-markdown.tsx
  // All the safety checking is due to a reported error from certain versions of FireFox.
  React.useEffect(() => {
    try {
      if (rootRef.current) {
        const blocks = rootRef.current.querySelectorAll('pre code') ?? [];
        const len = blocks.length ?? 0;
        let i = 0;
        for (i; i < len; i++) {
          hljs.highlightBlock(blocks[i]);
        }
      }
    } catch {
      // do nothing, it's not the end of the world if we can't highlight Markdown.
    }
  }, [textOrMarkdown]);

  return (
    <Typography
      className={classNames({
        [classes.root]: true,
        'formatted-text': true,
      })}
      ref={rootRef}
      dangerouslySetInnerHTML={{
        __html: sanitizedHtml,
      }}
    />
  );
};

export default HighlightedMarkdown;
