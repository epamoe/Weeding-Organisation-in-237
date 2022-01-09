import React from 'react'

const postsContext = React.createContext({
  posts: [],
  deletePost: (idPost) => {},
  updatePost: (idPost, data) => {},
  addPosts: (posts) => {},
  addPost: (post) => {},
  addComments: (comments) => {},
  addComment: (comment) => {},
  likePost: (idPost, idUser) => {}
})

export default postsContext