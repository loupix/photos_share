import axios from "axios";
const headers = {
  "Content-Type": "application/json"
};

export default {
	banUser: function(user_id) {
        return axios.post('/api/admin/banUser',{user_id},{headers: headers});
    },

    unBanUser: function(user_id) {
        return axios.post('/api/admin/unBanUser',{user_id},{headers: headers});
    },

    adminUser: function(user_id) {
        return axios.post('/api/admin/adminUser',{user_id},{headers: headers});
    },

    unAdminUser: function(user_id) {
        return axios.post('/api/admin/unAdminUser',{user_id},{headers: headers});
    },
}