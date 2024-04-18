import axios from "axios";
const headers = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json"
};

export default {
    login: async function(email, password) {
        return axios.post('/api/users/login',{email,password},{headers: headers});
    },

    logout: async function() {
        localStorage.clear();
        return axios.post('/api/users/logout',{},{headers: headers});
    },

    signup: async function(nom, prenom, email, password) {
        return axios.post('/api/users/register', {nom, prenom, email, password}, { headers: headers });
    },

    forgotPassword: async function(email) {
        return axios.post('/api/users/forgotPassword', {email}, { headers: headers });
    },

    changePassword: async function(token, password) {
        return axios.post('/api/users/changePassword', {token, password}, { headers: headers });
    },

    isAuth: async function() {
        if(localStorage.getItem("token") == null){
            return axios.post('/api/users/connected',{},{headers: headers}).then((rep) => {
                // localStorage.setItem("token", rep.data.token);
                // localStorage.setItem("user", rep.data.user);
                return rep.data;
            }, (err) => {
                // localStorage.removeItem('token');
                // localStorage.removeItem('user');
                return false;
            });
        }
        return true;
    },

    upload: async function(file){
        let formData = new FormData();
        formData.append("file", file);
        return axios.post("/api/users/upload", formData, {headers:{'Content-Type': 'multipart/form-data'}});
    },

    updatePicture: async function(picture) {
        return axios.post('/api/users/updatePicture',{picture},{headers: headers});
    },

    get: async function(id) {
        return axios.post('/api/users/get',{id},{headers: headers});
    },

    getMe: async function() {
        return axios.post('/api/users/getMe',{},{headers: headers});
    },

    getAll: async function() {
        return axios.post('/api/users/getAll',{},{headers: headers});
    },

    getInvitation: async function(id) {
        return axios.post('/api/users/getInvitation',{id},{headers: headers});
    },

    validEmail: async function(id) {
        return axios.post('/api/users/validEmail',{id},{headers: headers});
    },

    find: async function(value) {
        return axios.post('/api/users/find',{value},{headers: headers});
    },

    sendMail: async function(email, text) {
        return axios.post('/api/users/sendMail',{email, text},{headers: headers});
    }
};