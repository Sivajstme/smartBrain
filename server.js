const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require("bcryptjs");
const cors = require('cors');
const knex = require('knex');
const Clarifai = require('clarifai');
const register = require('./controllers/register');
const signIn = require('./controllers/signIn')
const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_URL,
        ssl:true
    }
});

//console.log(db);

const users = [
    {
        id: '1',
        name: 'John',
        email: 'john@qwe.com',
        password: '123',
        entries: 0,
        joined: new Date()
    },
    {
        id: '2',
        name: 'Sally',
        email: 'Sally@qwe.com',
        password: 'Fan',
        entries: 5,
        joined: new Date()
    },
    {
        id: '3',
        name: 'James',
        email: 'aes@qwe.com',
        password: 'coolkies',
        entries: 9,
        joined: new Date()
    }
];

app.use(bodyParser.json());
app.use(cors());
app.get('/',(req,res)=>{
    res.send('It is working');
    
});
//--> /Signin 
app.post('/signin', (req, res) => { signIn.HandlerSignIn(req,res,db,bcrypt);})
    /*
    
        if( req.body.email === users[0].email 
            && req.body.password === users[0].password)
            { 
                //res.json('success');
                res.send(users[0]);
            }else {
            res.status(400).json('error logging In');
            }
            */

//--> /register
app.post('/register', (req, res) => { register.handleRegister(req,res,bcrypt,db)});

///profile/:userId GET

app.get('/profile/:id', (req,res)=>{
    const { id } = req.params;
    
    db.select('*').from('users').where({
        id : id
    }).then(user=>{
        if (user.length) {
            
            res.json(user)
        }else{
            res.status(400).json('Not Found');
        }
    })
    .catch(err =>{
        res.status(400).send('Error finding the user')
    })
    // if (!found) {
    //     res.status(400).send('Not found');
    // }
});

const API = new Clarifai.App({ apiKey: process.env.Clarifai });
const handleApiCall =(req,res) =>{
    API.models
            .predict("a403429f2ddf4b49b307e318f00e528b",
            req.body.input    
            )
}
// image == Increase the count of the images entered

app.put('/image' , (req,res)=>{
    const { id } = req.body;
    db('users').where('id','=', id)
    .increment('entries',1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err =>{
            res.status(400).json('unable to get entries')
        })
    
        
    /*
    let found = false;
    users.forEach(el =>{
        if (el.id === id) {
            found = true;
            el.entries ++;
            return res.json(el);
        }
    });
    if (!found) {
        return res.status(400).send('Not Found');
    }
    */
})








app.listen(process.env.PORT || 3001, () =>
  console.log(`App is running on port ${process.env.PORT}`)
);
//
/**
 * --> / (Root Route) => res = this is working
 * 
 * --> /Signin   => POST( checkes the user exists or not
 *                  and we dont want to display the password in the url) 
 *                  = success/ fail
 * 
 * --> /register => POST(coz we want to add the data to database) 
 *                  = return newly created user
 * 
 * --> /profile/:userId --> GET(to see our own profile) = user
 * 
 * --> /image      => PUT (to update the count of the )
 * 
 */
