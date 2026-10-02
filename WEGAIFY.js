(function() {
    'use strict';

    // --- Configuration & Date Setup ---
    const now = new Date();
    const months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    const monthNamesCapitalized = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    
    const currentMonthUpper = months[now.getMonth()];
    const currentMonthCap = monthNamesCapitalized[now.getMonth()];

    // Keep track of original text values to revert everything back to normal
    const originalTextMap = new Map();
    let mutationObserverInstance = null;
    let timerIntervalInstance = null;

    // --- Cleanup / Revert Function ---
    function revertEverything() {
        // Stop the countdown banner and remove it
        if (timerIntervalInstance) clearInterval(timerIntervalInstance);
        const banner = document.getElementById('wega-countdown-banner');
        if (banner) banner.remove();

        // Stop the mutation observer
        if (mutationObserverInstance) {
            mutationObserverInstance.disconnect();
        }

        // Restore all text nodes back to their original states
        originalTextMap.forEach((originalText, node) => {
            if (node && node.parentNode) {
                node.nodeValue = originalText;
            }
        });
        originalTextMap.clear();
    }

    // --- 1. Video & Text Overlay Component ---
    function initVideoOverlay() {
        const container = document.createElement('div');
        container.id = 'wega-overlay-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999999;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        `;

        // Create Video Element with Wega challenge MP4
        const video = document.createElement('video');
        video.src = 'https://files.catbox.moe/1dz0lo.mp4';
        video.autoplay = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';
        video.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;

        // Create Text Element
        const textElement = document.createElement('div');
        textElement.id = 'wega-text-spawn';
        textElement.style.cssText = `
            position: absolute;
            font-size: 5rem;
            font-weight: 900;
            font-family: monospace, sans-serif;
            color: #00ff66;
            text-shadow: 0 0 25px rgba(0,255,102,0.9), 0 0 10px #000;
            display: none;
            z-index: 1000000;
            pointer-events: none;
            text-transform: uppercase;
        `;
        textElement.textContent = `WEGA'S CHALLENGE: ${currentMonthUpper}`;

        container.appendChild(video);
        container.appendChild(textElement);
        document.body.appendChild(container);

        // Timing Triggers
        video.addEventListener('timeupdate', () => {
            const currentTime = video.currentTime;

            // Spawn text at 0.1 seconds
            if (currentTime >= 0.1 && currentTime < 0.783) {
                textElement.style.display = 'block';
            }

            // Flash colors & glitch transform at 0.783 seconds
            if (currentTime >= 0.783 && currentTime < 1.0) {
                const colors = ['#00ff66', '#ff0033', '#33ffff', '#ffff00', '#ff00ff'];
                textElement.style.color = colors[Math.floor(Math.random() * colors.length)];
                textElement.style.transform = `scale(${1 + Math.random() * 0.3}) rotate(${(Math.random() - 0.5) * 15}deg)`;
            }

            // Remove video and text at 2 seconds
            if (currentTime >= 2.0) {
                container.remove();
            }
        });

        // Fallback safety removal if video finishes early or fails
        video.addEventListener('ended', () => {
            if (document.body.contains(container)) container.remove();
        });
        
        video.addEventListener('error', () => {
            console.warn("Wega video failed to load, cleaning up overlay.");
            if (document.body.contains(container)) container.remove();
        });
    }

    // --- 2. Countdown Banner Component ---
    function initCountdown() {
        let timeLeft = 15;
        const banner = document.createElement('div');
        banner.id = 'wega-countdown-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(90deg, #001100, #00ff66, #003311);
            color: #ffffff;
            text-align: center;
            font-family: monospace, monospace;
            font-weight: bold;
            font-size: 1.1rem;
            padding: 8px 0;
            z-index: 999998;
            box-shadow: 0 4px 15px rgba(0,255,102,0.4);
            letter-spacing: 1px;
            text-shadow: 0 0 5px #000;
        `;

        function updateCountdownText() {
            if (timeLeft > 0) {
                banner.textContent = `⚠️ WEGA'S CHALLENGE (${currentMonthCap}) ENDS IN ${timeLeft} SECONDS ⚠️`;
                timeLeft--;
            } else {
                banner.textContent = `WEGA HAS CONSUMED THE PAGE! (O_O)`;
                clearInterval(timerIntervalInstance);
                
                // Automatically revert everything back to normal when timer hits 0
                setTimeout(() => {
                    revertEverything();
                }, 2000);
            }
        }

        updateCountdownText();
        document.body.appendChild(banner);
        timerIntervalInstance = setInterval(updateCountdownText, 1000);
    }

    // --- 3. Wegaify Text Mutation Engine ---
    const processedNodes = new WeakSet();

    function wegaifyText(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) return text;
        if (text.includes('[WEGA]') || text.includes(':O_O:')) return text; // Prevent infinite re-mutation loops

        const quirkType = Math.floor(Math.random() * 4);
        
        let mutated = text
            .replace(/w/gi, 'WEGA')
            .replace(/g/gi, 'G')
            .replace(/a/gi, 'AAA')
            .replace(/e/gi, '333');

        if (quirkType === 0) {
            mutated = mutated
                .replace(/o/gi, '000')
                .replace(/i/gi, '111')
                .replace(/s/gi, '5') + ' [WEGA_CORRUPT]';
        } else if (quirkType === 1) {
            mutated = 'WEGA:: ' + mutated.toUpperCase() + ' :O_O: (O_O)';
        } else if (quirkType === 2) {
            mutated = mutated.split('').map(char => {
                return Math.random() > 0.4 ? char.toUpperCase() : char.toLowerCase();
            }).join('') + " [WEGA]";
        } else {
            mutated += ' ~WEGA_CHALLENGE~ 👁️';
        }

        return mutated;
    }

    function processTextNode(node) {
        if (processedNodes.has(node)) return;
        const originalText = node.nodeValue;
        const transformed = wegaifyText(originalText);
        if (originalText !== transformed) {
            if (!originalTextMap.has(node)) {
                originalTextMap.set(node, originalText);
            }
            node.nodeValue = transformed;
            processedNodes.add(node);
        }
    }

    function walkDOM(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                const parent = node.parentNode;
                if (!parent) return NodeFilter.FILTER_REJECT;
                const tagName = parent.tagName ? parent.tagName.toLowerCase() : '';
                if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
                    return NodeFilter.FILTER_REJECT;
                }
                if (parent.id === 'wega-countdown-banner' || parent.id === 'wega-text-spawn') {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        let node;
        while (node = walker.nextNode()) {
            processTextNode(node);
        }
    }

    // --- 4. Continuous Mutation Observer & Title Watcher ---
    function initMutationEngine() {
        walkDOM(document.body);

        mutationObserverInstance = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            processTextNode(node);
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            walkDOM(node);
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    processTextNode(mutation.target);
                }
            }

            if (document.title && !document.title.includes('[WEGA]')) {
                document.title = wegaifyText(document.title);
            }
        });

        mutationObserverInstance.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // --- Execution Bootstrap ---
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
            initVideoOverlay();
            initCountdown();
            initMutationEngine();
        });
    } else {
        initVideoOverlay();
        initCountdown();
        initMutationEngine();
    }

})();
