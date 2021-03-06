'use strict';

const cool = require('cool-ascii-faces');
const express = require('express');
const pg = require('pg');
const app = express();
const wrapText = text => `<pre>${text}</pre>`;
const makeLink = (link, name) => `<a href='${link}'>${name}</a>`;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/db', function(request, response){
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('SELECT * FROM test_table', function(err, result){
      done();
      if(err){
        console.error(err);
        response.send('Error ' + err);
      } else {
        response.render('pages/db', {results: result.rows});
      }
    });
  });
});

app.get('/', (request, response) => response.render('pages/index'));

app.get('/home', function(request, response){
  const numFaces = 20;
  const gitAnchor = makeLink('https://github.com/arnav-aggarwal', 'Git Profile');
  const linkedInAnchor = makeLink('https://www.linkedin.com/in/arnavaggarwal', 'LinkedIn')
  const myInfo =
`Arnav Aggarwal's Home Page

arnavaggrwl@gmail.com
${gitAnchor}
${linkedInAnchor}
`;
  let coolFaces = '';

  for(let index = 0; index < numFaces; index++) {
    const face1 = cool();
    const face2 = cool();

    //normalize the number of spaces based on 1st face
    const numSpaces = 26 - face1.length;

    coolFaces += face1;
    //add some spaces to sort-of center next face
    for(let index = 0; index < numSpaces; index++){
      coolFaces += ' ';
    }

    //only append a face if the first one is small
    if(numSpaces > 4) {
      coolFaces += face2;
    }

    coolFaces += '\n';
  }

  const finalText = myInfo + '\n' + coolFaces;
  response.send(wrapText(finalText));
});

app.get('/cool', (request, response) => response.send(cool()));

app.get('/times', function(request, response) {
  let result = '';
  const times = process.env.TIMES || 5;
  for(let i = 0; i < times; i++) {
    result += i + ' ';
  }

  response.send(result);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

