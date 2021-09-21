import logo from './logo.svg';
import './App.css';
import Article from './Article';
import axios from 'axios';
import { useState, useEffect } from 'react';

import { getFirestore, getDoc, setDoc, doc, getDocs, collection } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBzEZ6MYMzMjhctqIqsCV-xYOtj3Apkibs',
  authDomain: 'indiehackers-milestones.firebaseapp.com',
  projectId: 'indiehackers-milestones',
  storageBucket: 'indiehackers-milestones.appspot.com',
  messagingSenderId: '45498488609',
  appId: '1:45498488609:web:f9c8379db9e43a31359060',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function getArticles() {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'articles'));
      var artcls = [];
      querySnapshot.forEach(async (docu) => {
        artcls.push(docu.data());
      });

      setArticles(artcls);
    }
    getArticles();
  }, []);

  var _fetchArticles = function () {
    axios
      .get('/api/fetch', null)
      .then((res) => {
        res.data.forEach(async (article) => {
          const db = getFirestore();
          const docRef = doc(db, 'articles', article.id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log('Document data:', docSnap.data());
          } else {
            const newDoc = await setDoc(doc(db, 'articles', article.id), {
              date: article.date,
              title: article.title,
              url: article.url,
              id: article.id,
            });
            if (newDoc != null) {
              console.log('Document written with ID: ', newDoc.id);
            }
          }
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  };

  return (
    <div className='App'>
      <div>Puppeteer</div>
      <button onClick={(e) => _fetchArticles()}>Fetch</button>
      <Article></Article>
      <h4>Articles</h4>
      {articles.map((article, index) => (
        <li key={index}>
          <a href={article.url}>{article.date + ' ' + article.title}</a>
        </li>
      ))}
    </div>
  );
}

export default App;
