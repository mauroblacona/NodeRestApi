const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');


//REGISTER
router.post('/register', async (req, res) => {
    //VALIDATE DATA
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    //CHECK IF USER ALREADY EXITS
    const emailExits = await User.findOne({ email:req.body.email });
    if(emailExits) return res.status(400).json({ message: 'email already exits' });

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //CREATE THE USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
        //res.send({user: user._id});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



//LOGIN
router.post('/login', async (req, res) => {
    //VALIDATE DATA
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    //CHECK IF EMAIL EXITS
    const user = await User.findOne({ email:req.body.email });
    if(!user) return res.status(400).json({ message: 'email not found or incorrect' });

    //CHECK IF PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid Password'); 

    //CREATE AND ASIGN A TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});





module.exports = router;