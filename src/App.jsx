import { useEffect, useState } from 'react';
import './App.css';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDocs,
  updateDoc,
  limit,
  doc
} from 'firebase/firestore';

const QUESTIONS = [
  {
    question: "What is the largest continent in the world?",
    options: [
      "Africa",
      "Europe",
      "Asia",
      "South America"
    ],
    answer: "Asia",
    displayed: false
  },
  {
    question: "Who wrote the novel 'To Kill a Mockingbird'?",
    options: [
      "Ernest Hemingway",
      "Harper Lee",
      "F. Scott Fitzgerald",
      "William Faulkner"
    ],
    answer: "Harper Lee",
    displayed: false
  },
  {
    question: "What is the highest mountain in the world?",
    options: [
      "Mount Kilimanjaro",
      "Mount Everest",
      "Mount Fuji",
      "Mount McKinley"
    ],
    answer: "Mount Everest",
    displayed: false
  },
  {
    question: "Which planet in our solar system is the closest to the sun?",
    options: [
      "Mercury",
      "Venus",
      "Earth",
      "Mars"
    ],
    answer: "Mercury",
    displayed: false
  },
  {
    question: "What is the chemical symbol for gold?",
    options: [
      "Gd",
      "Au",
      "Ag",
      "Pd"
    ],
    answer: "Au",
    displayed: false
  },
  {
    question: "What is the largest country in South America?",
    options: [
      "Brazil",
      "Argentina",
      "Peru",
      "Colombia"
    ],
    answer: "Brazil",
    displayed: false
  },
  {
    question: "Which country has the largest population in the world?",
    options: [
      "India",
      "Russia",
      "China",
      "United States"
    ],
    answer: "China",
    displayed: false
  },
  {
    question: "What is the name of the longest river in Africa?",
    options: [
      "Nile",
      "Congo",
      "Zambezi",
      "Niger"
    ],
    answer: "Nile",
    displayed: false
  },
  {
    question: "Who painted the famous artwork 'The Starry Night'?",
    options: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Claude Monet",
      "Salvador Dali"
    ],
    answer: "Vincent van Gogh",
    displayed: false
  },
  {
    question: "What is the name of the currency used in Japan?",
    options: [
      "Yen",
      "Dollar",
      "Euro",
      "Pound"
    ],
    answer: "Yen",
    displayed: false
  },
  {
    question: "Who is the current Prime Minister of Canada?",
    options: [
      "Justin Trudeau",
      "Stephen Harper",
      "Jean Chrétien",
      "Paul Martin"
    ],
    answer: "Justin Trudeau",
    displayed: false
  },
  {
    question: "What is the smallest country in the world by land area?",
    options: [
      "Vatican City",
      "Monaco",
      "Nauru",
      "Tuvalu"
    ],
    answer: "Vatican City",
    displayed: false
  }
];

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhxChNm5h3N68axgcQwQmYUgvmLgW1-Jo",
  authDomain: "doko-kbc.firebaseapp.com",
  projectId: "doko-kbc",
  storageBucket: "doko-kbc.appspot.com",
  messagingSenderId: "577907344225",
  appId: "1:577907344225:web:50f6063192d679f6ecbb20",
  measurementId: "G-GVGYT4EQQB"
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const DB = getFirestore();

function App() {

  const [showNextEnd, setShowNextEnd] = useState(false);
  const [question, setQuestion] = useState({
    question: "What is the largest continent in the world?",
    options: [
      "Africa",
      "Europe",
      "Asia",
      "South America"
    ],
    answer: "Asia",
    displayed: false
  });
  const [previousQuestion, setPreviousQuestion] = useState(null);

  const colRef = collection(DB, 'questions');
  const qr = query(colRef, where("displayed", "==", false), orderBy("createdAt"), limit(1));

  onSnapshot(qr, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      setQuestion({...doc.data(), id: doc.id});
      setPreviousQuestion({ id: doc.id });
    });
  });

  const onStartClick = () => {
    setShowNextEnd(true);
    // QUESTIONS.forEach(async (question) => {
    //   await addDoc(colRef, {
    //     ...question,
    //     createdAt: serverTimestamp()
    //   });
    // });
  }

  const onEndClick = async () => {
    setShowNextEnd(false);
    const snapshot = await getDocs(colRef);
    snapshot.docs.forEach(async (document) => {
      const docRef = doc(DB, 'questions', document.id);
      await updateDoc(docRef, {
        displayed: false
      });
    });
  }

  const onNextClick = async () => {
    const docRef = doc(DB, 'questions', previousQuestion.id);
    await updateDoc(docRef, {
      displayed: true
    });
  }

  return (
    <>
        <div className='question-wrapper'>
          {
            showNextEnd ?
              <>
                <h2>{question.question}</h2>
                <ul>
                  {
                    question.options.map((option, index) => {
                      return <li key={index}>{option}</li>;
                    })
                  }
                </ul> 
              </> : <span>Are you sure to start the game?</span>
          }
        </div>

        <div className='buttons'>
          {!showNextEnd && <button onClick={onStartClick}>START</button>}
          {
            showNextEnd && 
              <>
                <button onClick={onNextClick}>NEXT</button>
                <button onClick={onEndClick}>END</button>
              </>
          }
        </div>
    </>
  )
}

export default App
