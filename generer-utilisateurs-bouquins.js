// ISITECH MongoDB - UA3 14 - B3-D
// Script de génération d'utilisateurs pour la base de données bibliotheque_amazon
// À exécuter dans mongosh connecté à votre base de données

// Configuration - ajustez selon vos besoins
const NB_UTILISATEURS = 10000;  // Nombre d'utilisateurs à générer
const CHANCE_EMPRUNT = 0.7;   // Probabilité qu'un utilisateur ait des emprunts
const MAX_EMPRUNTS = 5;       // Nombre maximum d'emprunts par utilisateur
const PROBABILITY_RETURN = 0.6; // Probabilité qu'un livre emprunté ait été retourné

// Données pour la génération aléatoire
const prenoms = [
  "Jean", "Marie", "Pierre", "Sophie", "Thomas", "Isabelle", "Nicolas", "Emma", 
  "Lucas", "Camille", "Léa", "Hugo", "Chloé", "Julien", "Laura", "Antoine", 
  "Sarah", "Maxime", "Julie", "Alexandre", "Amandine", "Romain", "Émilie", 
  "Théo", "Manon", "Mathieu", "Céline", "David", "Aurélie", "Jérôme", "Élodie",
  "Kevin", "Nathalie", "Stéphane", "Caroline", "François", "Sandrine", "Benoît",
  "Pauline", "Sébastien", "Anaïs", "Olivier", "Marine", "Christophe", "Mélanie"
];

const noms = [
  "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand", 
  "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", 
  "Bertrand", "Roux", "Vincent", "Fournier", "Morel", "Girard", "André", "Mercier", 
  "Dupont", "Lambert", "Bonnet", "Francois", "Martinez", "Legrand", "Garnier", "Faure", 
  "Rousseau", "Blanc", "Guerin", "Muller", "Henry", "Roussel", "Nicolas", "Perrin", 
  "Morin", "Mathieu", "Clement", "Gauthier", "Dumont", "Lopez", "Fontaine", "Chevalier"
];

const rues = [
  "Rue de la Paix", "Avenue des Champs-Élysées", "Boulevard Saint-Michel", 
  "Rue de Rivoli", "Avenue Montaigne", "Boulevard Haussmann", "Rue du Faubourg Saint-Honoré", 
  "Rue de Sèvres", "Avenue Victor Hugo", "Rue Saint-Antoine", "Boulevard des Italiens", 
  "Rue Saint-Denis", "Avenue de la République", "Rue de la Pompe", "Boulevard Raspail", 
  "Rue Mouffetard", "Avenue de l'Opéra", "Rue de Vaugirard", "Boulevard Voltaire"
];

const villes = [
  { nom: "Paris", codePostal: "75000", coordinates: [2.3522, 48.8566] },
  { nom: "Lyon", codePostal: "69000", coordinates: [4.8357, 45.7640] },
  { nom: "Marseille", codePostal: "13000", coordinates: [5.3698, 43.2965] },
  { nom: "Bordeaux", codePostal: "33000", coordinates: [-0.5792, 44.8378] },
  { nom: "Lille", codePostal: "59000", coordinates: [3.0573, 50.6292] },
  { nom: "Toulouse", codePostal: "31000", coordinates: [1.4442, 43.6047] },
  { nom: "Nice", codePostal: "06000", coordinates: [7.2620, 43.7102] },
  { nom: "Nantes", codePostal: "44000", coordinates: [-1.5534, 47.2173] },
  { nom: "Strasbourg", codePostal: "67000", coordinates: [7.7521, 48.5734] },
  { nom: "Montpellier", codePostal: "34000", coordinates: [3.8767, 43.6108] },
  { nom: "Rennes", codePostal: "35000", coordinates: [-1.6777, 48.1173] },
  { nom: "Grenoble", codePostal: "38000", coordinates: [5.7245, 45.1885] },
  { nom: "Toulon", codePostal: "83000", coordinates: [5.9333, 43.1167] },
  { nom: "Angers", codePostal: "49000", coordinates: [-0.5532, 47.4784] },
  { nom: "Dijon", codePostal: "21000", coordinates: [5.0415, 47.3220] }
];

const tags = [
  "fantasy", "science-fiction", "histoire", "biographie", "thriller", 
  "romance", "policier", "philosophie", "jeunesse", "classique", 
  "poésie", "science", "art", "voyages", "cuisine", "politique", 
  "économie", "santé", "technologie", "développement personnel"
];

// Fonction utilitaire pour générer un nombre aléatoire entre min et max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fonction utilitaire pour sélectionner aléatoirement un élément d'un tableau
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Fonction utilitaire pour générer une date aléatoire entre deux dates
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Fonction utilitaire pour ajouter des jours à une date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Fonction pour obtenir une liste aléatoire de livres (pour les emprunts)
async function getRandomBooks(maxBooks) {
  const numBooks = getRandomInt(1, maxBooks);
  // Récupérer tous les ID et titres de livres
  const livres = await db.livres.find({}, { _id: 1, titre: 1 }).limit(10).skip(getRandomInt(0, 10000)).toArray();
  
  if (livres.length === 0) {
    print("Aucun livre trouvé dans la collection. Veuillez d'abord créer des livres.");
    return [];
  }
  
  // Sélectionner aléatoirement numBooks livres
  const selectedBooks = [];
  const usedIndices = new Set();
  
  for (let i = 0; i < numBooks && i < livres.length; i++) {
    let index;
    do {
      index = getRandomInt(0, livres.length - 1);
    } while (usedIndices.has(index));
    
    usedIndices.add(index);
    const book = livres[index];
    
    // Générer des dates d'emprunt
    const dateEmprunt = getRandomDate(
      new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // 1 an dans le passé
      new Date() // aujourd'hui
    );
    
    // Date de retour prévue (3 semaines après l'emprunt)
    const dateRetourPrevue = addDays(dateEmprunt, 21);
    
    // Date de retour effective (si le livre a été retourné)
    let dateRetourEffective = null;
    if (Math.random() < PROBABILITY_RETURN) {
      dateRetourEffective = getRandomDate(dateEmprunt, addDays(dateEmprunt, 30)); // entre la date d'emprunt et 30 jours après
    }
    
    selectedBooks.push({
      livre_id: book._id,
      titre: book.titre,
      date_emprunt: dateEmprunt,
      date_retour_prevue: dateRetourPrevue,
      date_retour_effective: dateRetourEffective
    });
  }
  
  return selectedBooks;
}

// Fonction principale pour générer les utilisateurs
async function genererUtilisateurs() {
  // Vérifier si la collection existe déjà et contient des données
  const count = await db.utilisateurs.countDocuments({});
  if (count > 0) {
    print(`La collection utilisateurs contient déjà ${count} documents.`);
   // const confirmation = prompt("Voulez-vous ajouter de nouveaux utilisateurs? (o/n): ");
    if (confirmation.toLowerCase() !== 'o') {
      print("Génération d'utilisateurs annulée.");
      return;
    }
  }
  
  const utilisateurs = [];
  
  for (let i = 0; i < NB_UTILISATEURS; i++) {
    const prenom = getRandomElement(prenoms);
    const nom = getRandomElement(noms);
    const email = `${prenom.toLowerCase()}.${nom.toLowerCase()}${getRandomInt(1, 999)}@exemple.com`;
    
    // Sélectionner une ville aléatoire
    const ville = getRandomElement(villes);
    
    // Ajouter une légère variation aux coordonnées pour diversifier
    const lng = ville.coordinates[0] + (Math.random() - 0.5) * 0.05;
    const lat = ville.coordinates[1] + (Math.random() - 0.5) * 0.05;
    
    // Sélectionner des tags aléatoires (entre 0 et 5)
    const nbTags = getRandomInt(0, 5);
    const userTags = [];
    for (let j = 0; j < nbTags; j++) {
      const tag = getRandomElement(tags);
      if (!userTags.includes(tag)) {
        userTags.push(tag);
      }
    }
    
    // Créer l'utilisateur
    const utilisateur = {
      nom: nom,
      prenom: prenom,
      email: email,
      age: getRandomInt(18, 80),
      adresse: {
        rue: `${getRandomInt(1, 150)} ${getRandomElement(rues)}`,
        ville: ville.nom,
        code_postal: ville.codePostal,
        localisation: {
          type: "Point",
          coordinates: [lng, lat]
        }
      },
      date_inscription: getRandomDate(
        new Date(new Date().setFullYear(new Date().getFullYear() - 3)), // 3 ans dans le passé
        new Date() // aujourd'hui
      ),
      tags: userTags
    };
    
    // Ajouter des emprunts aléatoirement
    if (Math.random() < CHANCE_EMPRUNT) {
      utilisateur.livres_empruntes = await getRandomBooks(MAX_EMPRUNTS);
    } else {
      utilisateur.livres_empruntes = [];
    }
    
    utilisateurs.push(utilisateur);
    
    // Afficher la progression
    if ((i + 1) % 10 === 0 || i === NB_UTILISATEURS - 1) {
      print(`${i + 1}/${NB_UTILISATEURS} utilisateurs générés`);
    }
  }
  
  // Insertion des utilisateurs dans la base de données
  print("Insertion des utilisateurs dans la base de données...");
  const result = await db.utilisateurs.insertMany(utilisateurs);
  print(`${result.insertedCount} utilisateurs ont été insérés avec succès.`);
  
  // Créer un index géospatial si ce n'est pas déjà fait
  print("Création d'un index géospatial sur le champ localisation...");
  await db.utilisateurs.createIndex({ "adresse.localisation": "2dsphere" });
  print("Index géospatial créé avec succès.");
  
  return result.insertedCount;
}

// Exécution de la fonction principale
print("Démarrage de la génération d'utilisateurs...");
genererUtilisateurs()
  .then(count => {
    if (count) print(`Génération d'utilisateurs terminée. ${count} utilisateurs créés.`);
  })
  .catch(err => {
    print(`Erreur lors de la génération d'utilisateurs: ${err.message}`);
  });
