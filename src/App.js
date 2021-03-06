import axios from 'axios';
import { useState, useEffect } from 'react';

import { List, Skeleton } from 'antd';

import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
  getDocs,
  collection,
  deleteDoc,
} from 'firebase/firestore';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getArticles();
  }, []);

  async function getArticles() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'articles'));
    var artcls = [];
    querySnapshot.forEach(async (docu) => {
      artcls.push(docu.data());
    });

    setArticles(artcls);
  }

  var deleteArticle = async function (article) {
    const db = getFirestore();
    await deleteDoc(doc(db, 'articles', article.id));
  };

  var _fetchArticles = function () {
    setLoading(true);
    axios
      .get('https://articlescrappernode.herokuapp.com/fetch', null)
      .then((res) => {
        setLoading(false);
        res.data.forEach(async (article) => {
          const db = getFirestore();
          const docRef = doc(db, 'articles', article.id);
          const docSnap = await getDoc(docRef);

          var text = article.title.trim();
          var title = text.substring(0, text.indexOf('\n'));
          var description = text.substring(text.indexOf('\n')).trim();

          if (docSnap.exists()) {
            //console.log('Document data:', docSnap.data());
          } else {
            const newDoc = await setDoc(doc(db, 'articles', article.id), {
              date: new Date(),
              title: title,
              description: description,
              url: article.url,
              id: article.id,
            });
            if (newDoc != null) {
              //console.log('Document written with ID: ', newDoc.id);
            }
          }
        });
        getArticles();
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
    <Skeleton active loading={loading} paragraph={{ rows: 5 }}>
      <div className='App'>
        <button onClick={(e) => _fetchArticles()}>Fetch</button>

        <h4>Articles</h4>

        <List
          itemLayout='horizontal'
          dataSource={articles}
          renderItem={(item) => (
            <List.Item
              actions={[
                <button type='button' key='delete' onClick={() => deleteArticle(item)}>
                  delete
                </button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <a target='_blank' rel='noreferrer' href={item.url}>
                    {new Date(item.date * 1000) + '-' + item.title}
                  </a>
                }
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>
    </Skeleton>
  );
}

export default App;
