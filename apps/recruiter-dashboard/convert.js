const fs = require('fs');

const htmlPath = '../../dashboard.html';
let html = fs.readFileSync(htmlPath, 'utf-8');

// Extract body content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (!bodyMatch) {
    console.error("No body found");
    process.exit(1);
}

let bodyContent = bodyMatch[1];

// Remove the <script> block at the end
bodyContent = bodyContent.replace(/<script>[\s\S]*?<\/script>/, '');

// Convert class= to className=
let jsx = bodyContent.replace(/class=/g, 'className=');

// Fix self closing tags
jsx = jsx.replace(/<input([^>]*?[^\/])>/g, '<input$1 />');
jsx = jsx.replace(/<img([^>]*?[^\/])>/g, '<img$1 />');
jsx = jsx.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments

const appTsxContent = `
import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    const kpiCards = document.querySelectorAll('.glass-panel');
    kpiCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            (card as HTMLElement).style.transform = 'translateY(-2px)';
        });
        card.addEventListener('mouseleave', () => {
            (card as HTMLElement).style.transform = 'translateY(0)';
        });
    });

    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        (row as HTMLElement).style.opacity = '0';
        (row as HTMLElement).style.transform = 'translateY(10px)';
        (row as HTMLElement).style.transition = \`all 0.4s ease \${index * 0.1}s\`;
        setTimeout(() => {
            (row as HTMLElement).style.opacity = '1';
            (row as HTMLElement).style.transform = 'translateY(0)';
        }, 100);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#131315] text-[#e5e1e4]">
      ${jsx}
    </div>
  );
}

export default App;
`;

fs.writeFileSync('./src/App.tsx', appTsxContent);
console.log("Converted successfully!");
