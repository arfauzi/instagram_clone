import React, { useState,useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import {db} from './firebase';
import firebase from 'firebase';



function Post({postId,user,username,imageUrl,caption}) {
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState('');

    useEffect(()=>{
        let unsubscribe;
      if (postId) {
       unsubscribe=db
       .collection("posts")
       .doc(postId)
       .collection("comments")
       .orderBy('timeStamp','desc')
       .onSnapshot((snapshot) =>{
        setComments(snapshot.docs.map((doc)=>doc.data()))})
    };
   
    return () =>{
      unsubscribe();
    };
  },[postId]);
  

  const postComment =(event)=>{
    event.preventDefault();
    
    db
    .collection('posts')
    .doc(postId)
    .collection('comments').add({
        text:comment,
        username:user.displayName,
        timeStamp:firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  }

    return (
        <div className='post'>
            <div className="post__header">
                <Avatar 
                className="post__avatar"
                alt={username}
                src="/static/images/avatar/1.jpg" 
                />
                <h3>{username}</h3>
            </div>
            {/* header --> avatar +username */}

            <img className="post__image"  src={imageUrl} alt=""/>
            {/* image */}
            
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            {/* username + caption */}

            <div className="post__comments">
                {comments.map((comment)=>(
                    <p key={comment}>
                        <strong>{comment.username}</strong> {comment.text}

                    </p>
                ))}
            </div>
            {user && <form className="post__commentBox">
                <input
                className="post__input"
                placeholder="add a comment"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                ></input>
                <button
                type="submit"
                disabled={!comments}
                className="post__button"
                onClick={postComment}
                >    
                Post
                </button>
            </form>}
            
                    
        </div>
    )
}

export default Post
