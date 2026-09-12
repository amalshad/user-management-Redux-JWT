const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-gray-\d+/g, 'bg-black');
  content = content.replace(/text-gray-\d+/g, 'text-white');
  content = content.replace(/border-gray-\d+/g, 'border-white');
  content = content.replace(/shadow-gray-\d+/g, 'shadow-white/20');
  
  // Also any remaining slate colors from earlier just in case
  content = content.replace(/bg-slate-\d+/g, 'bg-black');
  content = content.replace(/text-slate-\d+/g, 'text-white');
  content = content.replace(/border-slate-\d+/g, 'border-white');
  
  fs.writeFileSync(file, content);
});
console.log("Replaced colors.");
