const Users = require("../models/users"),
    FriendRequest = require("../models/friendRequest");



async function get(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");

        let {id} = req.body;
        if(!id)
            return res.status(400).json("Wrong syntax");

        let request = await FriendRequest.findOne({_id:id}, ['from','to','accepted','vue']);
        if(!request)
        	return res.status(404).json("Request not found");

        request.from = await request.getFrom();
        request.to = await request.getTo();

        res.status(200).json(request);
    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}



async function getAll(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");

        user = await Users.findOne({_id:user._id}, ['friends','friendRequests_receive','friendRequests_send']);
        let friends = await user.getFriends();
        let requestSend = await user.getRequestSend();
        let requestReceive = await user.getRequestReceive();

        res.status(200).json({friends:friends, send:requestSend, receive:requestReceive});
    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}



async function accepted(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");

        let {id} = req.body;
        if(!id)
            return res.status(400).json("Wrong syntax");

        let request = await FriendRequest.findOne({_id:id}, ['from','to','accepted','vue']);
        if(!request)
        	return res.status(404).json("Request not found");

        request = await FriendRequest.findOneAndUpdate({_id:request._id}, {accepted:true, vue:true}, {returnOriginal: false});

        await Users.findOneAndUpdate({_id:request.from}, {$push:{friends:request.to}});
        await Users.findOneAndUpdate({_id:request.to}, {$push:{friends:request.from}});

        user = await Users.findOne({_id:user._id}, 
            ['picture','nom','prenom','friends','albums','photos','friendRequests_receive','friendRequests_send','createdAt','updatedAt'], 
            {returnOriginal: false});

        req.session.user = user;
        req.session.save(err => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                token: user.getToken(),
                user:req.session.user
            });
        });

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


async function refused(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");

        let {id} = req.body;
        if(!id)
            return res.status(400).json("Wrong syntax");

        let request = await FriendRequest.findOne({_id:id}, ['from','to','accepted','vue']);
        if(!request)
        	return res.status(404).json("Request not found");

        request = await FriendRequest.findOneAndUpdate({_id:request._id}, {accepted:false, vue:true}, {returnOriginal: false});
        
        await Users.findOneAndUpdate({_id:request.from}, {$pull:{friends:request.to}});
        await Users.findOneAndUpdate({_id:request.to}, {$pull:{friends:request.from}});
        // await FriendRequest.deleteOne({_id:request._id});

        user = await Users.findOne({_id:user._id}, 
            ['picture','nom','prenom','friends','albums','photos','friendRequests_receive','friendRequests_send','createdAt','updatedAt'], 
            {returnOriginal: false});

        req.session.user = user;
        req.session.save(err => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                token: user.getToken(),
                user:req.session.user
            });
        });

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


async function remove(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");

        let {id} = req.body;
        if(!id)
            return res.status(400).json("Wrong syntax");

        let request = await FriendRequest.findOne({_id:id}, ['from','to','accepted','vue']);
        if(!request)
        	return res.status(404).json("Request not found");

        await FriendRequest.deleteOne({_id:request._id});

        return getAll(req, res);

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


async function setVue(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");

        let {id} = req.body;
        if(!id)
            return res.status(400).json("Wrong syntax");

        let request = await FriendRequest.findOne({_id:id}, ['from','to','accepted','vue']);
        if(!request)
        	return res.status(404).json("Request not found");

        request = await FriendRequest.findOneAndUpdate({_id:request._id}, {vue:true}, {returnOriginal: false});

        res.status(200).json(request);

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


async function setVueAll(req, res){
    try{
        let {user} = req.session;
        if(!user)
            return res.status(401).json("Not connected");
        
        user = await Users.findOne({_id:user._id}, ['friendRequests_receive']);

        let requestReceive = await user.getRequestReceive();
        let reqIds = requestReceive.map(r => r._id);
        await FriendRequest.findOneAndUpdate({_id:{$in:reqIds}}, {vue:true}, {returnOriginal: false});

        user = await Users.findOne({_id:user._id}, ['friendRequests_receive']);
        let requests = await user.getRequestReceive();

        res.status(200).json(requests);

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}






exports.get = get;
exports.getAll = getAll;
exports.accepted = accepted;
exports.refused = refused;
exports.remove = remove;
exports.setVue = setVue;
exports.setVueAll = setVueAll;
