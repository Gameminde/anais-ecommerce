const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// Fix the structure by moving the closing parenthesis to the correct line
content = content.replace(
  /      <\/section>\n      \)}/g,
  '      </section>\n      )}'
);

// Also ensure the closing section tag is properly formatted
content = content.replace(
  /        <\/div>\n      <\/section>\n      \)}/g,
  '        </div>\n      </section>\n      )}'
);

fs.writeFileSync('src/pages/HomePage.tsx', content);
console.log('HomePage.tsx fixed!');
