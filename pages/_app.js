import { useEffect } from 'react';
import { Navbar } from '../components/navbar';
import '../styles/global.css'
import 'tailwindcss/tailwind.css'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const enhanceCodeBlocks = () => {
      const codes = document.querySelectorAll('pre > code');
      codes.forEach(code => {
        const pre = code.parentElement;
        if (!pre || pre.dataset.enhanced === 'true') return;

        // Determine language from className (e.g., language-js)
        const match = (code.className || '').match(/language-([a-z0-9+#-]+)/i);
        const lang = match && match[1] ? match[1] : 'text';

        // Build wrapper container
        const container = document.createElement('div');
        container.className = 'code-block';

        // Build toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'code-toolbar';

        const langBadge = document.createElement('span');
        langBadge.className = 'code-lang';
        langBadge.textContent = lang.toLowerCase();

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.type = 'button';
        copyBtn.setAttribute('aria-label', 'Copy code');
        copyBtn.textContent = '复制';

        const setCopied = () => {
          const original = copyBtn.textContent;
          copyBtn.textContent = '已复制';
          copyBtn.disabled = true;
          setTimeout(() => {
            copyBtn.textContent = original;
            copyBtn.disabled = false;
          }, 1800);
        };

        copyBtn.addEventListener('click', async () => {
          try {
            const text = code.innerText;
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(text);
            } else {
              // Fallback
              const ta = document.createElement('textarea');
              ta.value = text;
              ta.style.position = 'fixed';
              ta.style.top = '-1000px';
              document.body.appendChild(ta);
              ta.focus();
              ta.select();
              document.execCommand('copy');
              document.body.removeChild(ta);
            }
            setCopied();
          } catch (e) {
            console.error('Copy failed', e);
          }
        });

        toolbar.appendChild(langBadge);
        toolbar.appendChild(copyBtn);

        // Insert container before pre, then move pre inside
        pre.parentNode.insertBefore(container, pre);
        container.appendChild(toolbar);
        container.appendChild(pre);
        pre.dataset.enhanced = 'true';
      });
    };

    enhanceCodeBlocks();

    // Also enhance after client-side navigations (for Next.js pages)
    // Observe DOM mutations in case content is swapped without full reload
    const observer = new MutationObserver(() => enhanceCodeBlocks());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
    
  );
}
