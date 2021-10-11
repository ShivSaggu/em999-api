
const express = require('express');
const app = express();
app.use(express.json()); 

 
//============================ accessing postgresql ==========================//

const pg = require('pg');

const cs = 'postgres://postgres:s$cret@localhost:5432/ydb';

const client = new pg.Client(cs);

client.connect();




app.get('/api/dbevents', (req,res)=> {
    res.send( 'hello6');
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
    client.query('SELECT * FROM cars').then(res => {

        const fields = res.fields.map(field => field.name);
    
        console.log(fields);

        res.status(200).send(fields);
    
    }).catch(err => {
        console.log(err.stack);
    }).finally(() => {
        client.end()
    });

   })

//===========================================================================//





const events = [
    {title: 'Flower Show', id: 1},
    {title: 'Art Show', id: 2},
    {title: 'Horse Racing Event', id: 3}
    {title: 'Car Show and Tell', id: 4}
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