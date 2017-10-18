const fs = require('fs');




let content = 'gerjgioetjgiejgiojegiojero';



fs.writeFile('message.txt', content, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});