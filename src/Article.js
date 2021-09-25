import React from 'react';
import { getFirestore, collection, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';

class Article extends React.Component {
  constructor() {
    super();
    this.state = {
      date: '',
      title: '',
      url: '',
    };
  }

  async componentDidMount() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'articles'));
    querySnapshot.forEach(async (docu) => {
      console.log(docu.data());
      console.log(`${docu.id} => ${docu.data()}`);
      //await deleteDoc(doc(db, 'articles', docu.id));
    });
  }

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  addArticle = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const docRef = await setDoc(doc(db, 'articles', 'xxx'), {
        date: this.state.date,
        title: this.state.title,
        url: this.state.url,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    this.setState({
      date: '',
      title: '',
      url: '',
    });
  };

  render() {
    return (
      <form onSubmit={this.addArticle}>
        <input type='date' name='date' onChange={this.updateInput} value={this.state.date} />
        <input type='text' name='title' onChange={this.updateInput} value={this.state.title} />
        <input type='text' name='url' onChange={this.updateInput} value={this.state.url} />
        <button type='submit'>Submit</button>
      </form>
    );
  }
}
export default Article;
