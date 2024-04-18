import axios from "axios";
const headers = {
  "Content-Type": "application/json"
};

export default {
	get: async function(id) {
        return axios.post('/api/albums/get',{id},{headers: headers});
    },

    getMe: async function() {
        return axios.post('/api/albums/getMe',{},{headers: headers});
    },

    getDashboard: async function() {
        return axios.post('/api/albums/getDashboard',{},{headers: headers});
    },

    find: async function(value) {
        return axios.post('/api/albums/find',{value},{headers: headers});
    },

    findTag: async function(tag) {
        return axios.post('/api/albums/findTag',{tag},{headers: headers});
    },

	ajout: async function(name, description, dateCreated, tags, banned, photos) {
        return axios.post('/api/albums/ajout',{name, description, dateCreated, tags, banned, photos},{headers: headers});
    },

    update: async function(id, name, description, dateCreated, tags) {
        return axios.post('/api/albums/update',{id, name, description, dateCreated, tags},{headers: headers});
    },

    remove: async function(id) {
        return axios.post('/api/albums/remove',{id},{headers: headers});
    },

    show: async function(id) {
        return axios.post('/api/albums/show',{id},{headers: headers});
    },

    unShow: async function(id) {
        return axios.post('/api/albums/unShow',{id},{headers: headers});
    },

    getBanned : async function(album_id){
        return axios.post('/api/albums/getBanned',{album_id},{headers: headers});
    },

    addBanned: async function(album_id, user_id){
        return axios.post('/api/albums/addBanned',{album_id, user_id},{headers: headers});
    },

    delBanned: async function(album_id, user_id){
        return axios.post('/api/albums/delBanned',{album_id, user_id},{headers: headers});
    }
}