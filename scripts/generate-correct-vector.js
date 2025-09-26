// Генерируем правильный вектор с ровно 1536 измерениями
const vector = Array.from({ length: 1536 }, (_, i) => (i + 1) * 0.001);

console.log('Vector length:', vector.length);
console.log('First 10 values:', vector.slice(0, 10));
console.log('Last 10 values:', vector.slice(-10));

// Форматируем для SQL
const sqlVector = '[' + vector.join(',') + ']';
console.log('\nSQL Vector (first 100 chars):', sqlVector.substring(0, 100) + '...');
console.log('SQL Vector length:', sqlVector.length);

// Сохраняем в файл
const fs = require('fs');
fs.writeFileSync('correct_vector.txt', sqlVector);
console.log('\n✅ Vector saved to correct_vector.txt');
