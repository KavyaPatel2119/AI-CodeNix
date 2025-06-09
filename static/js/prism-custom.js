// Custom Prism.js configuration for AI CodeNix
// This file customizes Prism.js syntax highlighting for the cyberpunk theme

document.addEventListener('DOMContentLoaded', function() {
    // Configure Prism.js if available
    if (typeof Prism !== 'undefined') {
        // Custom language definitions
        Prism.languages.html = Prism.languages.markup;
        
        // Add custom CSS for cyberpunk theme
        const style = document.createElement('style');
        style.textContent = `
            /* Custom Prism.js Cyberpunk Theme */
            code[class*="language-"],
            pre[class*="language-"] {
                color: #ffffff;
                background: rgba(0, 0, 0, 0.5);
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 0.875rem;
                line-height: 1.5;
                text-align: left;
                white-space: pre;
                word-spacing: normal;
                word-break: normal;
                word-wrap: normal;
                tab-size: 4;
                hyphens: none;
            }
            
            pre[class*="language-"] {
                padding: 1.5rem;
                margin: 0;
                overflow: auto;
                border-radius: 0.5rem;
                border: 1px solid rgba(0, 245, 255, 0.3);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            
            :not(pre) > code[class*="language-"] {
                padding: 0.1em 0.3em;
                border-radius: 0.3em;
                white-space: normal;
                background: rgba(0, 245, 255, 0.1);
                border: 1px solid rgba(0, 245, 255, 0.3);
            }
            
            /* Cyberpunk color scheme */
            .token.comment,
            .token.prolog,
            .token.doctype,
            .token.cdata {
                color: #6c757d;
                font-style: italic;
            }
            
            .token.punctuation {
                color: #ffffff;
            }
            
            .token.property,
            .token.tag,
            .token.boolean,
            .token.number,
            .token.constant,
            .token.symbol,
            .token.deleted {
                color: #00f5ff;
                text-shadow: 0 0 5px rgba(0, 245, 255, 0.3);
            }
            
            .token.selector,
            .token.attr-name,
            .token.string,
            .token.char,
            .token.builtin,
            .token.inserted {
                color: #00ff88;
                text-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
            }
            
            .token.operator,
            .token.entity,
            .token.url,
            .language-css .token.string,
            .style .token.string {
                color: #8a2be2;
                text-shadow: 0 0 5px rgba(138, 43, 226, 0.3);
            }
            
            .token.atrule,
            .token.attr-value,
            .token.keyword {
                color: #ff006e;
                text-shadow: 0 0 5px rgba(255, 0, 110, 0.3);
                font-weight: bold;
            }
            
            .token.function,
            .token.class-name {
                color: #ffa726;
                text-shadow: 0 0 5px rgba(255, 167, 38, 0.3);
            }
            
            .token.regex,
            .token.important,
            .token.variable {
                color: #00f5ff;
                text-shadow: 0 0 5px rgba(0, 245, 255, 0.3);
            }
            
            .token.important,
            .token.bold {
                font-weight: bold;
            }
            
            .token.italic {
                font-style: italic;
            }
            
            .token.entity {
                cursor: help;
            }
            
            /* Line highlighting */
            .line-highlight {
                background: rgba(0, 245, 255, 0.1);
                border-left: 3px solid #00f5ff;
                box-shadow: 0 0 10px rgba(0, 245, 255, 0.2);
            }
            
            /* Line numbers */
            .line-numbers .line-numbers-rows {
                border-right: 1px solid rgba(0, 245, 255, 0.3);
                background: rgba(0, 0, 0, 0.2);
            }
            
            .line-numbers-rows > span:before {
                color: #6c757d;
            }
            
            /* Copy button styling */
            .code-toolbar {
                position: relative;
            }
            
            .code-toolbar > .toolbar {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .code-toolbar:hover > .toolbar {
                opacity: 1;
            }
            
            .code-toolbar > .toolbar .toolbar-item button {
                background: rgba(0, 245, 255, 0.8);
                border: none;
                border-radius: 0.25rem;
                color: #000;
                cursor: pointer;
                font-size: 0.75rem;
                padding: 0.25rem 0.5rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .code-toolbar > .toolbar .toolbar-item button:hover {
                background: #00f5ff;
                box-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
                transform: scale(1.05);
            }
        `;
        
        document.head.appendChild(style);
        
        // Enhanced syntax highlighting for specific languages
        enhanceLanguageSupport();
        
        // Auto-highlight all code blocks
        Prism.highlightAll();
        
        // Re-highlight when new content is added
        observeCodeBlocks();
    }
});

function enhanceLanguageSupport() {
    // Enhanced JavaScript highlighting
    if (Prism.languages.javascript) {
        Prism.languages.javascript.function = /\b(?:function\s+)?[a-zA-Z_$][\w$]*(?=\s*\()/;
        Prism.languages.javascript.method = /\b[a-zA-Z_$][\w$]*(?=\s*\()/;
    }
    
    // Enhanced Python highlighting
    if (Prism.languages.python) {
        Prism.languages.python.decorator = {
            pattern: /@[a-zA-Z_]\w*/,
            alias: 'annotation'
        };
        Prism.languages.python['type-hint'] = {
            pattern: /:\s*[a-zA-Z_]\w*(?:\[[^\]]*\])?/,
            alias: 'annotation'
        };
    }
    
    // Enhanced HTML highlighting
    if (Prism.languages.html) {
        Prism.languages.html.doctype = {
            pattern: /<!DOCTYPE[^>]*>/i,
            alias: 'prolog'
        };
    }
    
    // Enhanced CSS highlighting
    if (Prism.languages.css) {
        Prism.languages.css.gradient = {
            pattern: /(linear|radial)-gradient\([^)]*\)/,
            alias: 'function'
        };
    }
}

function observeCodeBlocks() {
    const observer = new MutationObserver((mutations) => {
        let shouldHighlight = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                const hasCodeBlocks = addedNodes.some(node => {
                    if (node.nodeType === 1) { // Element node
                        return node.matches('pre code, code[class*="language-"]') ||
                               node.querySelector('pre code, code[class*="language-"]');
                    }
                    return false;
                });
                
                if (hasCodeBlocks) {
                    shouldHighlight = true;
                }
            }
        });
        
        if (shouldHighlight) {
            // Debounce highlighting to avoid excessive calls
            clearTimeout(window.highlightTimeout);
            window.highlightTimeout = setTimeout(() => {
                Prism.highlightAll();
            }, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Custom highlighting functions
window.highlightCode = function(element) {
    if (typeof Prism !== 'undefined') {
        const codeBlocks = element.querySelectorAll('pre code, code[class*="language-"]');
        codeBlocks.forEach(block => {
            Prism.highlightElement(block);
        });
    }
};

// Language detection for auto-highlighting
window.detectLanguage = function(code) {
    // Simple language detection based on patterns
    if (code.includes('<!DOCTYPE') || code.includes('<html>')) {
        return 'html';
    } else if (code.includes('def ') || code.includes('import ')) {
        return 'python';
    } else if (code.includes('function ') || code.includes('const ') || code.includes('let ')) {
        return 'javascript';
    } else if (code.includes('public class') || code.includes('System.out.println')) {
        return 'java';
    } else if (code.includes('#include') && code.includes('std::')) {
        return 'cpp';
    } else if (code.includes('#include') && !code.includes('std::')) {
        return 'c';
    }
    return 'javascript'; // default
};

// Export for global use
window.PrismCustom = {
    highlightCode: window.highlightCode,
    detectLanguage: window.detectLanguage,
    enhanceLanguageSupport
};
