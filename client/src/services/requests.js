import axios from "axios";
const headers = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json"
};

export default {
    get: async function(id) {
        return axios.post('/api/requests/get',{id},{headers: headers});
    },

    getAll: async function() {
        return axios.post('/api/requests/getAll',{},{headers: headers});
    },

    add: async function(id) {
        return axios.post('/api/requests/add',{id},{headers: headers});
    },

    accepted: async function(id) {
        return axios.post('/api/requests/accepted',{id},{headers: headers});
    },

    refused: async function(id) {
        return axios.post('/api/requests/refused',{id},{headers: headers});
    },

    remove: async function(id) {
        return axios.post('/api/requests/remove',{id},{headers: headers});
    },

    setVue: async function(id) {
        return axios.post('/api/requests/setVue',{id},{headers: headers});
    },

    setVueAll: async function() {
        return axios.post('/api/requests/setVueAll',{},{headers: headers});
    },
}