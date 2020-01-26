const HandlerSignIn = (req, res,db,bcrypt)=>{
        db.select('email', "hash").from("login")
            .where("email", "=", req.body.email)
            .then(data => {
                const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
                
                if (isValid) {
                    return db.select('*').from('users')
                        .where('email', '=', req.body.email)
                        .then(user => {
                            res.json(user[0])
                        })
                        .catch(err => res.status(400).json('User Not Found'))
                } else {
                    res.status(400).res.json('Wrong credentials!!')
                }
                if (err) {
                    return res.status(500).end('Wrong One!!')
                }
            })
            .catch(err => res.status(400).json('email or password do not match !!'))

}

module.exports = {
    HandlerSignIn: HandlerSignIn
};