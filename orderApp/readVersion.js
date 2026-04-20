const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const pomPath = path.join(__dirname, '../pom.xml');
/*
fs.readFile(pomPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading pom.xml:', err);
    process.exit(1);
  }

  xml2js.parseString(data, (err, result) => {
    if (err) {
      console.error('Error parsing pom.xml:', err);
      process.exit(1);
    }

    const version = result.project.version[0];
    console.log('Project version:', version);

    // Vous pouvez écrire la version dans un fichier JSON
   // fs.writeFileSync('/openmrs/moduleResources/biologicalorder/assets/version.json', JSON.stringify({ version }));
  });
});*/
