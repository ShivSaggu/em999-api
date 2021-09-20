
const express = require('express');
const app = express();
app.use(express.json()); 

 
//============================ accessing postgresql ==========================//

const { Client } = require('pg')
const client = new Client({
  user: 'wxytofkgzvnhat',
  host: 'ec2-44-198-100-81.compute-1.amazonaws.com',
  database: 'd1etncsvhcajva',
  password: 'cca1a242943dd78a4c30844b567fcd0ccab3330531fd17b61fa4375ed7365744',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

client.connect();


app.get('/api/dbevents', (req,res)=> {
    res.send( 'hello5');
}); 

app.get('/api/dbevents2', function (req, res, next) {
    client.query('select first_name__c from salesforce.event_attendee__c', [1], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
});

app.get('/api/dbevents3', async (req, res) => {
    const result = await client.query('select first_name__c from salesforce.event_attendee__c', ['Hello world!'])
    res.send(result.rows[0].message)
   })

//===========================================================================//





const events = [
    {title: 'Art Show', id: 1},
    {title: 'Electric Car Show', id: 2},
    {title: 'Spacex Visit', id: 3}
    ]
    
    app.get('/api/events', (req,res)=> {
        res.send(events);
    }); 

    app.get('/api/events/:id', (req, res) => {
        const event = events.find(c => c.id === parseInt(req.params.id));
         
        if (!event) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
        res.send(event);
    });

//---------------------------------------------------------------------------//
const books = [
{title: 'Harry Potter', id: 1},
{title: 'Twilight', id: 2},
{title: 'Lorien Legacies', id: 3}
]

//READ Request Handlers
app.get('/', (req, res) => {
res.send('This will be the API for the Event Management Database');
});
 
app.get('/api/books', (req,res)=> {
res.send(books);
});
 
app.get('/api/books/:id', (req, res) => {
const book = books.find(c => c.id === parseInt(req.params.id));
 
if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
res.send(book);
});
 
//CREATE Request Handler
app.post('/api/books', (req, res)=> {
 
const { error } = validateBook(req.body);
if (error){
res.status(400).send(error.details[0].message)
return;
}
const book = {
id: books.length + 1,
title: req.body.title
};
books.push(book);
res.send(book);
});



//UPDATE Request Handler
app.put('/api/books/:id', (req, res) => {
    const book = books.find(c=> c.id === parseInt(req.params.id));
    if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>');
     
    const { error } = validateBook(req.body);
    if (error){
    res.status(400).send(error.details[0].message);
    return;
    }
     
    book.title = req.body.title;
    res.send(book);
    });
     
    //DELETE Request Handler
    app.delete('/api/books/:id', (req, res) => {
     
    const book = books.find( c=> c.id === parseInt(req.params.id));
    if(!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Not Found!! </h2>');
     
    const index = books.indexOf(book);
    books.splice(index,1);
     
    res.send(book);
    });
     
    function validateBook(book) {
    const schema = {
    title: Joi.string().min(3).required()
    };
    return Joi.validate(book, schema);
     
    }
     
    //PORT ENVIRONMENT VARIABLE
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`Listening on port ${port}..`));