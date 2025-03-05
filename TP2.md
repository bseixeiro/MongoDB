# TP MONGODB - INDEXATION, GÉOSPATIAL ET AGRÉGATION

## TP 1 : Indexation et optimisation des performancesv

### Exercice 1.1 : Préparation et analyse des performances sans index

1.  - Génération des livres : Importation via kaggle d'un dataset de livres dans une collection 'livres_temp'. Utilisation du script 'generate_livres.js' pour créer la collection 'livres' puis formatter et importer les données dans la collection.

    - Géneration des données d'utilisateurs via le script 'generer-utilisateurs-bouquins.js'

2.

| Recherche                                                             | nReturned | totalKeysExamined | totalDocsExamined | executionTimeMillis | stage           |
| --------------------------------------------------------------------- | --------- | ----------------- | ----------------- | ------------------- | --------------- |
| Titre ("Dramatica for Screenwriters")                                 | 1         | 0                 | 212404            | 159ms               | COLLSCAN        |
| Auteur ("Victor Hugo")                                                | 17        | 0                 | 212404            | 222ms               | COLLSCAN        |
| Prix ( entre 10 et 20) & note ( >20 )                                 | 15480     | 0                 | 212404            | 385ms               | COLLSCAN        |
| Genre ("Reference") et Langue ("Français") + Tri par note décroissant | 142       | 0                 | 212404            | 266ms               | COLLSCAN / SORT |

### Exercice 1.2 : Création d'index simples et composites

1.

```js
// Index sur le titre
db.livres.createIndex({ titre: 1 }, { name: "idx_titre" });

// Index sur les auteurs
db.livres.createIndex({ auteur: 1 }, { name: "idx_auteur" });

// Index sur le prix et la note
db.livres.createIndex({ prix: 1, note_moyenne: 1 }, { name: "idx_prix_note" });

// Index sur la langue, le genre et trier selon les notes de manière descendante
db.livres.createIndex(
  { langue: 1, genre: 1, note_moyenne: -1 },
  { name: "idx_langue_genre_sortByNoteDesc" }
);
```

2.

| Recherche                                                             | nReturned | totalKeysExamined | totalDocsExamined | executionTimeMillis | stage          |
| --------------------------------------------------------------------- | --------- | ----------------- | ----------------- | ------------------- | -------------- |
| Titre ("Dramatica for Screenwriters")                                 | 1         | 1                 | 1                 | 13ms                | IXSXAN / FETCH |
| Auteur ("Victor Hugo")                                                | 17        | 17                | 17                | 10ms                | IXSXAN / FETCH |
| Prix ( entre 10 et 20) & note ( >20 )                                 | 15480     | 16481             | 15480             | 41ms                | IXSXAN / FETCH |
| Genre ("Reference") et Langue ("Français") + Tri par note décroissant | 142       | 142               | 142               | 0ms                 | IXSXAN / FETCH |

### Exercice 1.3 : Index spécialisés

1.

```js
db.livres.createIndex({ titre: "text", description: "text" });
```

2.  | Recherche                               | nReturned | totalKeysExamined | totalDocsExamined | executionTimeMillis | stage          |
    | --------------------------------------- | --------- | ----------------- | ----------------- | ------------------- | -------------- |
    | Textuelle ($text : {$search : "Image"}) | 4111      | 4111              | 4111              | 10ms                | IXSCAN / FETCH |


3.
```js
db.createCollection("session_utilisateurs")

db.insertMany([
    {
        utilisateur_id: ObjectId("67c82b96785accb6101804d0"),
        last_connexion: new Date(),
        email: "sarah.martinez932@exemple.com"
      },
      ...
])
```

4.
```js
db.sessions_utilisateurs.createIndex({last_connexion: 1}, {expireAfterSeconds: 1800})
```