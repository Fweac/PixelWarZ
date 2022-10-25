// Déclarations
const cursor = document.querySelector('#cursor');

const footer = document.querySelector('#footer');

const colorChoice = document.querySelector('#colorChoice');

const cellWidth = 20;
const cellHeight = 20;


const game = document.querySelector('#game');
game.width = 3000;
game.height = 2000;
const gameWidth = game.width;
const gameHeight = game.height;
const ctx = game.getContext('2d');

const gridCtx = game.getContext('2d');

const colorList = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white'
]

let currentColor = 'red';

// Initialisation de la palette de couleurs
colorList.forEach(color => {
    const colorDiv = document.createElement('div');
    colorDiv.style.backgroundColor = color;
    colorChoice.appendChild(colorDiv);

    if (color === currentColor) {
        colorDiv.classList.add('active');
    }

    colorDiv.addEventListener('click', () => {
        colorDiv.classList.add('active');
        colorList.forEach(color => {
            if(color !== colorDiv.style.backgroundColor) {
                document.querySelector(`[style="background-color: ${color};"]`).classList.remove('active');
            }
        })
        currentColor = color;
    }
    )
})


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXphSC0ZqcQMz7TXJSWwziPbi8rahGHYU",
    authDomain: "pixelwarz-a453c.firebaseapp.com",
    projectId: "pixelwarz-a453c",
    storageBucket: "pixelwarz-a453c.appspot.com",
    messagingSenderId: "314613153751",
    appId: "1:314613153751:web:dbbf175ce9ceef2ffdd592"
  };
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// récupération du scroll
let scrollY = 0;
let scrollX = 0;

// Listener sur le scroll
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    scrollX = window.scrollX;
    // colorChoice suit la fenêtre sur l'axe des x (gauche/droite)
    if (colorChoice.style.position === 'relative') {
        colorChoice.style.left = scrollX + 'px';
    }
})


// Fonction qui crée un pixel
function createPixel(x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellWidth, cellHeight);
}

// Fonction qui dessine un pixel
function addPixelIntoGame() {
    const x = cursor.offsetLeft - game.offsetLeft;
    const y = cursor.offsetTop - game.offsetTop;


    createPixel(x, y, currentColor);

    const pixel = {
        x, y, color: currentColor
    }

    const pixelRef = db.collection('pixels').doc(`${x}-${y}`);
    pixelRef.set(pixel), {merge: true};
}


// Listener sur le clic de la souris
game.addEventListener('click', function(event) {
    addPixelIntoGame();
});

cursor.addEventListener('click', function(event) {
    addPixelIntoGame();
})


// Foction qui dessine la grille
function drawGrids(ctx, width, height, cellWidth, cellHeight) {
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    for (let x = 0; x <= width; x += cellWidth) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }

    for (let y = 0; y <= height; y += cellHeight) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();
}
// Dessine la grille
drawGrids(gridCtx, gameWidth, gameHeight, cellWidth, cellHeight);


// Listener sur le mouvement de la souris (pour le curseur)
game.addEventListener('mousemove', function(event) {
    const cursorLeft = event.clientX - (cursor.offsetWidth / 2) + scrollX;
    const cursorTop = event.clientY - ((cursor.offsetHeight / 2)) + scrollY;

    cursor.style.left = Math.floor(cursorLeft / cellWidth) * cellWidth + 'px';
    cursor.style.top = Math.floor(cursorTop / cellHeight) * cellHeight + 'px';

    // Décallage du curseur pour qu'il soit au centre du pixel
    cursor.style.left = cursor.offsetLeft + (cellWidth / 2) + 'px';
})



// La taille du footer fait la taille du colorChoice
footer.style.height = colorChoice.offsetHeight + 'px';

// La taille change dynamiquement avec la fenêtre
// Listener sur le resize de la fenêtre
window.addEventListener('resize', () => {
    footer.style.height = colorChoice.offsetHeight + 'px';

    // Si la taille de la fenêtre est plus grande que la hauteur du jeu, on met met le colorChoice en bas du canvas
    if (window.innerHeight > game.offsetHeight) {
        colorChoice.style.position = 'relative';
    }

    // Si la taille de la fenêtre est plus petite que la hauteur du jeu, on met met le colorChoice en bas de la fenêtre
    if (window.innerHeight < game.offsetHeight) {
        colorChoice.style.position = 'fixed';
    }
}
)

// Si la taille de la fenêtre est plus grande que la hauteur du jeu, on met met le colorChoice en bas du canvas
if (window.innerHeight > game.offsetHeight) {
    colorChoice.style.position = 'relative';
}

// Si la taille de la fenêtre est plus petite que la hauteur du jeu, on met met le colorChoice en bas de la fenêtre
if (window.innerHeight < game.offsetHeight) {
    colorChoice.style.position = 'fixed';
}


// Affichage des pixels
db.collection('pixels').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            const pixel = change.doc.data();
            createPixel(pixel.x, pixel.y, pixel.color);
        }
    })
}
)

