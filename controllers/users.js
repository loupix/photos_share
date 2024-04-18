const Users = require("../models/users"),
    friendRequest = require("../models/friendRequest");
    Invitation = require("../models/invitation");
const passwordHash = require("password-hash")

const config = require('../config/environment'),
  path = require("path"),
  fs = require("fs"),
  jade = require("jade"),
  nodemailer = require('nodemailer');


async function connected(req, res){
    try{
        if(!req.session){
            req.session.user = false;
            req.session.save(err => {
                if(err)
                    return res.status(500).json(err);
                return res.status(200).json(false);
            })
        }
        let {user} = req.session;
        if(!user)
            return res.status(200).json(false);
        return res.status(200).json(true);
    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

async function get(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");

        let {id} = req.body;
        if(!id)
            return res.status(400).json("Wrong syntax");

        let request = await friendRequest.findOne({from:user._id, to:id});
        findUser = await Users.findOne({_id:id}, ['picture','email','nom','prenom','validated','friends','albums','photos','createdAt','updatedAt']);
        // if(!findUser.friends.includes(user._id))
        //     return res.status(400).json("Not friends");

        if(!request)
            return res.status(200).json({user:findUser, error:"Aucunes invitation envoyés"});
        else if(!request.vue)
            return res.status(200).json({user:findUser, error:"Invitation envoyée mais pas vue"});
        else if(!request.accepted)
            return res.status(200).json({user:findUser, error:"Invitation non acceptée"});

        if(findUser){
            findUser.friends = await findUser.getFriends();
            findUser.albums = await findUser.getAlbums();
            return res.status(200).json(findUser);
        }else{
            return res.status(404).json("Not found")
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
}


async function getMe(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");

        // let friends = await user.updateFriends();
        // user = await Users.findOneAndUpdate({_id:user._id}, {friends:friends}, {returnOriginal: false});

        user = await Users.findOne({_id:user._id}, ['picture','nom','prenom','friends','albums','photos','friendRequests_receive', 'friendRequests_send','createdAt','updatedAt']);
        // user = await user.updateFriends();
        user.friends = await user.getFriends();
        user.albums = await user.getAlbums();
        user.friendRequests_send = await user.getRequestSend();
        user.friendRequests_receive = await user.getRequestReceive();
        if(user){
            return res.status(200).json({
                token:user.getToken(),
                user:user
            });
        }else{
            return res.status(404).json("Not found")
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


async function getAll(req, res){
    try{
        var users = await Users.find();
        return res.status(200).json(users);
    }catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}


async function getInvitation(req, res){
    try{
        let {id} = req.body;
        if(!id)
            return res.status(400).json("Wrong syntax");

        var invit = await Invitation.findOne({_id:id},['email','validated']);
        if(!invit)
            return res.status(404).json("Invitation not found");
        if(invit.validated)
            return res.status(400).json("Invitation déjà vue");

        let request = await invit.getRequest();
        await Users.findOneAndUpdate({_id:request.from._id._id}, {$push:{friends:request.to}});
        await Users.findOneAndUpdate({_id:request.to._id._id}, {$push:{friends:request.from}});


        return res.status(200).json(invit);
    }catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}


async function validEmail(req, res){
    try{
        let {id} = req.body;
        if(!id)
            return res.status(400).json("Wrong syntax");

        var user = await Users.findOne({_id:id},['verified']);
        if(!user)
            return res.status(404).json("Utilisateur not found");
        if(user.verified)
            return res.status(401).json("Utilisateur déjà vérifié");

        await Users.findOneAndUpdate({_id:id}, {verified:true});
        return res.status(200).json(user);
    }catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}


async function find(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");

        let {value} = req.body;
        // if(!value)
        //     return res.status(200).json("Wrong syntax")

        let users = [],
            findUsers = [],
            isEmail = false;

        if (/^[a-zA-Z0-9,.'-]+@[a-zA-Z0-9,.'-]+\.[A-Za-z]+$/.test(value)){
            isEmail=true;
            findUsers = await Users.find({email:{$regex:'.*'+value+'*'}, validated:true}, ['email']);
            if(findUsers.length>0){
                for(let i in findUsers){
                    if(!users.includes(findUsers[i]._id.toString()))
                        users.push(findUsers[i]._id.toString());
                }
            }
        }else{
            findUsers = await Users.find({nom:{$regex:'.*'+value+'*'}, validated:true}, ['nom']);
            if(findUsers.length>0){
                for(let i in findUsers){
                    if(!users.includes(findUsers[i]._id.toString()))
                        users.push(findUsers[i]._id.toString());
                }
            }

            findUsers = await Users.find({prenom:{$regex:'.*'+value+'*'}, validated:true}, ['prenom']);
            if(findUsers.length>0){
                for(let i in findUsers){
                    if(!users.includes(findUsers[i]._id.toString()))
                        users.push(findUsers[i]._id.toString());
                }
            }
        }

        if(users.includes(user._id)){
            let pos = users.indexOf(user._id);
            users.splice(pos, 1);
        }

        users = await Users.find({_id:{$in:users}}, ['nom','prenom','email','validated','picture','albums','friends','createdAt']);
        return res.status(200).json({users:users, isEmail:isEmail, friends:user.friends});

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}



async function Register(req, res){
    let {nom, prenom, email, password} = req.body;
    if(!email || !nom || !prenom || !password)
        return res.status(401).json("Wrong syntax")

    let userData = {
        nom:nom,
        prenom:prenom,
        email:email,
        validated:true,
        password:passwordHash.generate(password)
    }

    // On check en base si l'utilisateur existe déjà
    try{
        let findUser = await Users.findOne({email:email, validated:true})
        if(findUser){
            return res.status(406).json("user already exists")
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }

    // Sauvegarde de l'utilisateur en base
    try{

        let user = await Users.findOne({email:email, validated:false, verified:false});
        if(user)
            user = await Users.findOneAndUpdate({_id:user._id}, userData, {returnOriginal: false});
        else{
            user = new Users(userData);
            user = await user.save();
        }

        // Send Email
/*        let transporter = nodemailer.createTransport(config.mail.server);
        let host = req.get("host");
        let url = host+"/verification/"+user._id;

        let contentHtml = fs.readFileSync(path.join(config.root,"views","validation.jade"));
        let options = {
            hostname: req.get("host"),
            url: url,
            user: user,
        };
        contentHtml = jade.compile(contentHtml)(options);
        try{
            let sendMail = await transporter.sendMail({from:config.mail.sender, to:email, subject:"Confirmer votre email", html: contentHtml});
        }catch (error) {
            console.error(error);
            await Users.deleteOne({_id:user._id});
            return res.status(403).json(error);
        }
*/

        user = await Users.findOne({_id:user._id}, ['picture','nom','prenom','friends','albums','photos','friendRequests_receive','createdAt','updatedAt']);
        // user = await user.updateFriends();
        user.friends = await user.getFriends();
        user.albums = await user.getAlbums();
        user.friendRequests_send = await user.getRequestSend();
        user.friendRequests_receive = await user.getRequestReceive();


        req.session.isAuthenticated = true
        req.session.user = user;
        req.session.save((err) => {
            if(err){
                console.error(err);
                return res.status(500).json(err);
            }
            return res.status(200).json({
                token: user.getToken(),
                user:user
            });
        })
    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }

}


async function Login(req, res){
    var {email,password} = req.body;
    if(!email || !password)
        return res.status(400).json("Wrong syntax");


    // On check en base si l'utilisateur existe déjà
    try{
        var user = await Users.findOne({email:email, validated:true}, ['email','password']);
        if(!user){
            return res.status(403).json("user not exists")
        }

        if(!user.authenticate(password)){
            return res.status(403).json("Wrong password")
        }

        user = await Users.findOne({email:email, validated:true}, ['picture','nom','prenom','friends','albums','photos','friendRequests_receive','createdAt','updatedAt'])
        // user = await user.updateFriends();
        user.friends = await user.getFriends();
        user.albums = await user.getAlbums();
        user.friendRequests_send = await user.getRequestSend();
        user.friendRequests_receive = await user.getRequestReceive();

        req.session.isAuthenticated = true
        req.session.user = user;
        req.session.save((err) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                token: user.getToken(),
                user:user
            });
        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }

}


async function Logout(req, res){
    try{
        req.session.destroy()
        req.session = null
        return res.status(200).json(true)
    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


async function forgotPassword(req, res){
    try{
        var {email} = req.body;
        var user = await Users.findOne({email:email, validated:true});
        if(!user){
            return res.status(403).json("user not exists")
        }

        // Send Email
        let transporter = nodemailer.createTransport(config.mail.server);
        let host = req.get("host");
        let url = host+"/ChangePassword/"+user.password;

        let contentHtml = fs.readFileSync(path.join(config.root,"views","forgotPassword.jade"));
        let options = {
            hostname: req.get("host"),
            url: url,
            user: user,
        };
        contentHtml = jade.compile(contentHtml)(options);
        try{
            let sendMail = await transporter.sendMail({from:config.mail.sender, to:email, subject:"Modifier votre mot de passe", html: contentHtml});
        }catch (error) {
            console.error(error);
            return res.status(403).json(error);
        }

        return res.status(200).json(true);


    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}



async function changePassword(req, res){
    try{
        var {token, password} = req.body;
        var user = await Users.findOne({password:token, validated:true});
        if(!user){
            return res.status(403).json("user not exists")
        }

        user = await Users.findOneAndUpdate({_id:user._id}, {password:passwordHash.generate(password)}, {returnOriginal: false});


        // Send Email
        let transporter = nodemailer.createTransport(config.mail.server);
        let host = req.get("host");

        let contentHtml = fs.readFileSync(path.join(config.root,"views","changePassword.jade"));
        let options = {
            hostname: req.get("host"),
            user: user,
        };
        contentHtml = jade.compile(contentHtml)(options);
        try{
            let sendMail = await transporter.sendMail({from:config.mail.sender, to:user.email, subject:"Modification de votre mot de passe", html: contentHtml});
        }catch (error) {
            console.error(error);
            return res.status(403).json(error);
        }

        user.friends = await user.getFriends();
        user.albums = await user.getAlbums();
        user.friendRequests_send = await user.getRequestSend();
        user.friendRequests_receive = await user.getRequestReceive();

        req.session.isAuthenticated = true
        req.session.user = user;
        req.session.save((err) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                token: user.getToken(),
                user:user
            });
        });


    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}



async function updatePicture(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");

        let {picture} = req.body;
        if(!picture)
            return res.status(400).json("Wrong syntax");

        let lastPicture = user.picture;

        await Users.findOneAndUpdate({_id:user._id}, {picture:picture});
        user = await Users.findOne({_id:user._id}, ['picture','nom','prenom','friends','albums','photos','friendRequests_receive', 'friendRequests_send','createdAt','updatedAt']);
        req.session.user = user;
        user.friends = await user.getFriends();
        user.albums = await user.getAlbums();
        user.friendRequests_send = await user.getRequestSend();
        user.friendRequests_receive = await user.getRequestReceive();

        if(lastPicture !== "false"){
            let pathName = path.join(config.root, "public", "images", "users", "original", lastPicture);
            fs.unlink(pathName, err => {
                pathName = path.join(config.root, "public", "images", "users", "medium", lastPicture);
                fs.unlink(pathName, err => {
                    pathName = path.join(config.root, "public", "images", "users", "small", lastPicture);
                    fs.unlink(pathName, err => {
                        req.session.save(err => {
                            if(err){
                                console.error(err);
                                return res.status(500).json(err);
                            }
                            return res.status(200).json({
                                token: user.getToken(),
                                user:user
                            });
                        });
                    });
                });
            });
        }else{
            req.session.save(err => {
                    if(err){
                        console.error(err);
                        return res.status(500).json(err);
                    }
                    return res.status(200).json({
                        token: user.getToken(),
                        user:user
                    });
                });
        }


    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


async function updateDateOfBirth(req, res){
    var {dateOfBirth} = req.body;
}


//On exporte nos fonctions
exports.connected = connected
exports.Register = Register
exports.Login = Login
exports.Logout = Logout
exports.getAll = getAll
exports.getMe = getMe
exports.getInvitation = getInvitation
exports.validEmail = validEmail
exports.get = get
exports.find = find
exports.forgotPassword = forgotPassword
exports.changePassword = changePassword
exports.updatePicture = updatePicture
