const handleRegister = (req, res, bcrypt, db)=>{
    // bcrypt.hash(req.body.password,10, function(er,hash) {
    //     console.log(hash);
    // }); 
    console.log('From Register')
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json('incorrect Form Submission');
    }
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })

        .then(user => {
            console.log(user[0]);
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to register !!'))
    // users.push(
    //     {
    //     id: 4,
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     entries: 0,//Math.floor(Math.random()*10),
    //     joined: new Date()
    //     }
    // );
}
module.exports = {
    handleRegister : handleRegister
}