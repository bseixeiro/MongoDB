// use bibliotheque_amazon

const createCollectionLivres =  db.livres.countDocuments({}) === 0;
  if (createCollectionLivres) {
    print(`Création de la collection livres...`)
    db.createCollection("livres")
  }

const tempDataExist =  db.livres_temp.countDocuments({}) === 0;
  if (tempDataExist) {
    print(`Aucune données à traiter, la collection livres_temp n'existe pas`)
  }
const livres_temp = db.livres_temp.find()

const formatLivres = []

function getRandomBoolean() {
    return Math.random() < 0.5;
}

function getRandomNumber(min, max) {
return Math.floor(Math.random() * (max+1 - min)) + min;
}

function getRandomPrice() {
const random = Math.random() * (40.0 - 4.0) + 4.0;
return parseFloat(random.toFixed(2));
}

function getRandomNote() {
const random = Math.random() * (5.0 - 1.0) + 1.0;
return parseFloat(random.toFixed(1));
}

function getRandomDate() {
const startDate = new Date("2023-01-01").getTime();
const today = new Date().getTime();
const randomTime = startDate + Math.random() * (today - startDate);
const randomDate = new Date(randomTime);

const year = randomDate.getFullYear();
const month = String(randomDate.getMonth() + 1).padStart(2, '0');
const day = String(randomDate.getDate()).padStart(2, '0');

return `${year}-${month}-${day}`;
}

function getRandomLangue(){
const langues = [
    "Français",
    "Anglais",
    "Espagnol",
    "Allemand",
    "Italien",
    "Japonais",
    "Chinois",
    "Russe",
    "Arabe",
    "Portugais"
    ];

    const randomIndex = Math.floor(Math.random() * langues.length);
    return langues[randomIndex];
}

let count = 1;
livres_temp.forEach( l => {
    let author;
    if (l.authors != null && l.authors.includes("[")) {
        try {
            const formatJsonAuthors = l.authors.replace(/'/g, '"');
            const skipQuoteAuthors = formatJsonAuthors.replace(/(?<=[a-zA-Z])"(?=[a-zA-Z])/g, '\\"');
            const authors = JSON.parse(skipQuoteAuthors);
            // const authors = JSON.parse(l.authors)
            author = authors[0]
        } catch(error) {
            author = "Auteur problématique"
        }
    }
    let pubDate;
    if (Number.isInteger(l.publishedDate)) pubDate = l.publishedDate;
    else if (typeof l.publishedDate === "string") pubDate = l.publishedDate.slice(0, 4);
    else if (l.publishedDate != null) pubDate = l.publishedDate.getFullYear();
    let categories;
    if (l.categories != null && typeof l.categories === "string"){
        try {
        const categoriesString = l.categories.replace(/'/g, '"');
        categories = JSON.parse(categoriesString);
        // categories = JSON.parse(l.categories)
        }catch(error) {
            categories = [ "Fiction" ]
        }
    }

    const livre = {
        titre: l.Title,
        description: l.description,
        editeur: l.publisher,
        auteur: author != null ? author : l.authors,
        annee_publication: pubDate,
        genre: categories != null ? categories : l.categories,
        disponible: getRandomBoolean(),
        stock: getRandomNumber(0, 30),
        prix : getRandomPrice(),
        nombre_pages: getRandomNumber(1000, 5000),
        langue: getRandomLangue(),
        note_moyenne: l.rating_count != null ? l.rating_count : getRandomNote(),
        date_ajout: new Date(getRandomDate()),
        isbn: `978207000${count}`
    }
    // console.log(livre);
    formatLivres.push(livre)
    count++
})

db.livres.insertMany(formatLivres)
