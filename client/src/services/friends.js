import axios from "axios";
const headers = {
  "Content-Type": "application/json"
};

export default {
	get: function() {
        return axios.post('/api/friends/get',{},{headers: headers});
    },

    create: function(email, message) {
        return axios.post('/api/friends/create',{email, message},{headers: headers});
    },

    createMultiple: function(emails) {
        return axios.post('/api/friends/createMultiple',{emails},{headers: headers});
    },

    add: function(id) {
        return axios.post('/api/friends/add',{id},{headers: headers});
    },

    remove: function(id) {
        return axios.post('/api/friends/remove',{id},{headers: headers});
    },
}