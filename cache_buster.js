const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    '<script src="js/bundle.js"></script>',
    '<script>document.write(\\'<script src="js/bundle.js?v=\\' + Date.now() + \\'"><\\\\/script>\\');</script>'
  );
  fs.writeFileSync(file, content);
}
console.log('Done');
