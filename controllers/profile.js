const handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users')
    .where({id})
    .then(user => {
        if(user.length){
           return res.json(user[0])
        } else {
           return res.status(400).json('not found')
        }
    })
    .catch(err => res.status(400).json('Error getting user'))
}

const handleProfileDelete = (req, res, db) => {
    const { id, email } = req.body;
    db.select('*').from('users')
    .where({id})
    .del()
    .catch(err => res.status(400).json('Error Deleting User'))

    db.select('*').from('login')
    .where({email})
    .del()
    .catch(err => res.status(400).json('Error Deleting User'))
}

module.exports = {
    handleProfileGet: handleProfileGet,
    handleProfileDelete: handleProfileDelete
}