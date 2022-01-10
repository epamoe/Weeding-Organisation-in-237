import {
  DELETE_POST,
  UPDATE_POST,
  ADD_POSTS,
  ADD_POST,
  ADD_COMMENT,
  ADD_COMMENTS,
  LIKE_POST
} from "./type"
import Post from '../../../entities/Post'
import Comment from "../../../entities/Comment"

const postsReducer = (state = [], action) => {
  switch (action.type) {
    case DELETE_POST: {
      const posts = [...state]

      if (action.payload) {
        const index = posts.findIndex(post => post.getId === action.payload)
  
        if (index > -1) {
          posts.splice(index, 1)
        }
      }

      return posts
    }

    case UPDATE_POST: {

    }

    case ADD_POSTS: {
      const posts = [...state]

      console.log(action.payload)

      if (action.payload) {
        // action.payload.foreach(post => {
        //   posts.push((new Post(post)))
        // })

        for (let post of action.payload) {
          posts.push((new Post(post)))
        }
      }

      return posts
    }

    case ADD_POST: {
      const posts = [...state]

      if (action.payload) {
        posts.push((new Post(action.payload)))
      }

      return posts
    }

    case ADD_COMMENT: {
      const posts = [...state]
      const {idPost, comment, responseTo} = action.payload

      if (idPost && comment) {
        const index = posts.findIndex(post => post.getId === idPost)

        // we verify if we have a post
        if (index > -1) {
          // responseTo contains the id of a specific comment
          if (responseTo) {
            // we get the position of the comment inside the comments table of the post
            const indexComment = posts.getComment(responseTo)

            // if it exist
            if (indexComment > -1) {
              // we add the comment inside the table of response comment of the comment
              posts[index].getComments()[indexComment].addCommentResponse(comment)
            }
          } else {
            posts[index].addComment(comment)
          }
        }
      }

      return posts
    }

    case ADD_COMMENTS: {
      const posts = [...state]
      const {idPost, comments} = action.payload

      if (idPost && comments) {
        const index = posts.findIndex(post => post.getId === idPost)

        // we verify if we have a post
        if (index > -1) {
          posts[index].addComments(comments)
        }
      }

      return posts
    }

    case LIKE_POST: {
      const posts = [...state]
      const {idPost, idUser} = action.payload

      if (idPost && idUser) {
        const index = posts.findIndex(post => post.getId === idPost)

        // we verify if we have a post
        if (index > -1) {
          posts[index].likePost(idUser)
        }
      }

      return posts
    }

    default: return state
  }
}

export default postsReducer