import axios from "axios";
const headers = {
  "Content-Type": "application/json"
};

export default {
	get: function(photo_id) {
        return axios.post('/api/photos/get',{photo_id},{headers: headers});
    },

    getFromUser: function(user_id) {
        return axios.post('/api/photos/getFromUser',{user_id},{headers: headers});
    },

    upload: async function(files){
        let formData = new FormData();
        for(let i in files){
            formData.append("file", files[i]);
        }
        return axios.post("/api/photos/upload", formData, {headers:{'Content-Type': 'multipart/form-data'}});
    },

	addComment: function(text, photo_id) {
        return axios.post('/api/photos/comment/add',{text, photo_id},{headers: headers});
    },

    updateComment: function(text, photo_id, comment_id) {
        return axios.post('/api/photos/comment/update',{text, photo_id, comment_id},{headers: headers});
    },

    delComment: function(comment_id, photo_id) {
        return axios.post('/api/photos/comment/del',{comment_id, photo_id},{headers: headers});
    },

    addLike: function(photo_id) {
        return axios.post('/api/photos/like/add',{photo_id},{headers: headers});
    },

    delLike: function(photo_id) {
        return axios.post('/api/photos/like/del',{photo_id},{headers: headers});
    },

}