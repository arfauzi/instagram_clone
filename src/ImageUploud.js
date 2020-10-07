import React, {useState} from 'react' ;
import {storage,db} from './firebase' ;
import firebase from 'firebase';
import './ImageUploud.css'

function ImageUploud(username) {

    const [caption,setCaption] = useState('');
    const [image,setImage] = useState(null);
    const  [progress,setProgress] =useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUploud = () => {
        const uploudTask =storage.ref(`images/${image.name}`).put(image);
        uploudTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)* 100,
            
                );
                setProgress(progress);
            },
            (error) => {
                //Error function
                console.log(error);
                alert(error.message);
            },
            () =>  {
                //complete function
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imgeUrl:url,
                        username:username
                    });
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                })
            }

        )
    }


    return (
        <div className="ImageUploud">
      <progress className="ImageUploud__progress " value={progress} max="100" />
        <input type='text' placeholder='enter a caption..'  onChange={(event) => setCaption(event.target.value)} value={caption} />
        <input type= 'file' onChange={ handleChange} />
        <button onClick={handleUploud} >
            Uploud
        </button>
        </div>
    )
};

export default ImageUploud
