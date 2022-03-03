import axios from "axios";
import { setAlert } from "./alert";
import { DELETE_POST, GET_POSTS,GET_POST, POST_ERROR, UPDATE_LIKES, ADD_POST, ADD_COMMENT, REMOVE_COMMENT } from "./types";

//get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');
        dispatch({
            type: GET_POSTS,
            payload: res.data
        });
    } catch (error) {
        dispatch({
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
    }
};

//like a post
export const addLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {postId, likes: res.data}
        });
    } catch (error) {
        dispatch({
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
    }
};

//remove a like from a post
export const removeLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {postId, likes: res.data}
        });
    } catch (error) {
        dispatch({
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
    }
};

//delete post
export const deletePost = (postId) => async dispatch => {
    try {
        await axios.delete(`/api/posts/${postId}`);
        dispatch({
            type: DELETE_POST,
            payload: postId
        });
        dispatch(setAlert('Post Successfully Removed.', 'success'));
    } catch (error) {
        dispatch({
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
    }
};

//add post
export const addPost = (formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/posts`, formData, config);

        dispatch({
            type: ADD_POST,
            payload: res.data
        });
        dispatch(setAlert('Post Successfully Created.', 'success'));
    } catch (error) {
        dispatch({
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
    }
};

//get a post
export const getPost = (postId) => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${postId}`);
        dispatch({
            type: GET_POST,
            payload: res.data
        });
    } catch (error) {
        dispatch({
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
    }
};

//add comment
export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });
        dispatch(setAlert('Comment Successfully Created.', 'success'));
    } catch (error) {
        dispatch({
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
    }
};

//delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        });
        dispatch(setAlert('Comment Successfully Removed.', 'success'));
    } catch (error) {
        dispatch({
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
    }
};