import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post'
import { db,auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';
import ImageUploud from './ImageUploud';
import InstagramEmbed from 'react-instagram-embed'


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    borderBottom: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user,setUser] = useState(null);
  

  // const posts=[];
  // post.append('');
  // setPosts
  useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged((authUser) =>{
      if(authUser){
        console.log(authUser);
        setUser(authUser);
        //user has logged

      }else{
        setUser(null);
        //user has logout
      }
    })
    return () =>{
      unsubscribe();
    }
  },[user,username]);



  //useEffect -> runs piece of code based on a specific condition
  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      //every time a new post is added,this code firebase
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()

      })));
    })

  }, []);

  const signUp = function (event) {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message) )
    setOpen(false);
  };

  const signIn = function (event){
    event.preventDefault();

    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }


  return (
    <div className="app" >

    
     

      <Modal open={open}
        onClose={() => setOpen(false)} >
        < div style={modalStyle}
          className={classes.paper} >
          <form className="app__signup">
            <center >
              <img src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                className="app__headerImage" /
              >
            </center>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            < Button type="submit" onClick={signUp} > Sign up </Button>


          </form>
        </div>
      </Modal>

      <Modal open={openSignIn}
        onClose={() => setOpenSignIn(false)} >
        < div style={modalStyle}
          className={classes.paper} >
          <form className="app__signup">
            <center >
              <img src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                className="app__headerImage" /
              >
            </center>
          
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />


            < Button type="submit" onClick={signIn} > Sign In  </Button>

          </form>
        </div>
      </Modal>



      <div className="app__header" >
        <img src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"

          alt=""
          className="app__headerImage" />
          
            {user ? (
        <Button onClick={() => auth.signOut()} > Log out </Button>
      ):(
        <div className="app__loginContainer">
        <Button onClick={() => setOpenSignIn(true)} > Sign in </Button>
        <Button onClick={() => setOpen(true)} > Sign Up </Button>
        </div>
      )}
      </div>
    
   <div className="app__posts">

     <div className="app__postsLeft">
     { 
   posts.map(({id,post})=>(<Post  key={id} user={user} postId={id} username={post.username.username} caption={post.caption} imageUrl={post.imgeUrl} />))
   
   }
   
   
     </div>
     <div className="app__postsRight" >
     <InstagramEmbed
        url='https://www.instagram.com/p/CF35VwFDRZ8/'
        maxWidth={500}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
     </div>
  

   </div>
        
  
    {user?.displayName ? (
        <ImageUploud username={user.displayName}/>
        
        ):(
          <h3>sorry you need login to uploud..</h3>

        )}
  </div>

  );
}

export default App;
