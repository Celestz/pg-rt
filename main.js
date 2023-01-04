// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3aUI3qzWxypLDHfRa96Sr9xNYWF8I704",
  authDomain: "pg-rt-c5474.firebaseapp.com",
  databaseURL: "https://pg-rt-c5474-default-rtdb.firebaseio.com",
  projectId: "pg-rt-c5474",
  storageBucket: "pg-rt-c5474.appspot.com",
  messagingSenderId: "469342642734",
  appId: "1:469342642734:web:d462452424be301941b5bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function writeCoords(x,y) {
  set(ref(db, 'coords'), {
    x,
    y,
  }).then(() => {
    console.log('Data Saved?')
  })
  .catch((error) => {
    // The write failed...
    console.log('No Idea')
  });
}

const coordsRef = ref(db, 'coords');
// Read coords once for init
get(coordsRef).then((snapshot) => {
  if (snapshot.exists()) {
    const { x, y } = snapshot.val();
    moveElement(x,y)
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

// Listed to changes
onValue(coordsRef, (snapshot) => {

  const { x, y } = snapshot.val();
  moveElement(x,y)
});

const moveElement= (x,y) => {
  const $mover = document.getElementById("moving-box")
  $mover.style.left = x
  $mover.style.top = y
}

const dragging = ($id = "moving-box") => {
  const $mover = document.getElementById($id);
  const $grabzone = $mover.querySelector(".grab-zone");

  let dragStartX = 0;
  let dragStartY = 0;

  $grabzone.onmousedown = (event) => {
    $mover.draggable = true;
    $mover.classList.add("dragging");
  };
  $mover.ondragstart = (event) => {
    dragStartX = event.clientX;
    dragStartY = event.clientY;
  };
  $mover.ondragend = (event) => {
    if (event.target.id !== $mover.id) {
      event.preventDefault();
      return false;
    }
    const leftCoord = $mover.offsetLeft - (dragStartX - event.clientX) + "px";
    const rightCoord = $mover.offsetTop - (dragStartY - event.clientY) + "px";

    writeCoords(leftCoord, rightCoord)

    $mover.draggable = false;
    $mover.classList.remove("dragging");
  };
};

window.onload = () => {
  dragging("moving-box");
};
