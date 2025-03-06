<center><h1> TP MONGODB - INDEXATION, GÉOSPATIAL ET AGRÉGATION</h1></center>

## TP 1 : Indexation et optimisation des performancesv

<center><span style="font-size: 20px"><b>Comparatif avec/sans Index</b></span></center>

| Recherche | Champs | Sans index | Avec index |
|--|--|--|--|
|| nReturned | 1 | 1 |
|| totalKeysExamined | 0 | 1 |
|Titre ("Dramatica for Screenwriters") |totalDocsExamined | 212404 | 1 |
||executionTimeMillis | 159ms | 13ms
||stage | COLLSCAN | IXSCAN
|----------------------------------------|---------------------|-------------|------------|
|| nReturned | 17 | 17 |
|| totalKeysExamined | 0 | 17 |
|Auteur ("Victor Hugo") |totalDocsExamined | 212404 | 17 |
||executionTimeMillis | 222ms | 10ms
||stage | COLLSCAN | IXSCAN
|----------------------------------------|---------------------|-------------|------------|
|| nReturned | 15480 | 15480 |
|| totalKeysExamined | 0 | 16481 |
|Prix ( entre 10 et 20) & note ( >20 ) |totalDocsExamined | 212404 | 15480 |
||executionTimeMillis | 385ms | 41ms
||stage | COLLSCAN | IXSCAN
|----------------------------------------|---------------------|-------------|------------|
|| nReturned | 142 | 142 |
|| totalKeysExamined | 0 | 142 |
|Genre ("Reference") et Langue ("Français") + Tri par note décroissant |totalDocsExamined | 212404 | 142 |
||executionTimeMillis | 266ms | 0ms
||stage | COLLSCAN | IXSCAN

---
### Exercice 1.1 : Préparation et analyse des performances sans index

1.  
- Génération des livres : Importation via kaggle d'un dataset de livres dans une collection 'livres_temp'. Utilisation du script 'generate_livres.js' pour créer la collection 'livres' puis formatter et importer les données dans la collection.

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



3./4. Création d'une session et d'un index TTL pour supprimer automatiquement les sessions
<div style="display: flex; justify-content: space-around">
<pre >
<code>
db.createCollection("session_utilisateurs")

db.insertMany([
    {
        utilisateur_id: ObjectId("67c82b96785accb6101804d0"),
        last_connexion: new Date(),
        email: "sarah.martinez932@exemple.com"
      },
      ...
])
</code>
</pre>
<pre style="display: flex;align-items: center">
<code>
db.sessions_utilisateurs.createIndex(
  { last_connexion: 1 },
  { expireAfterSeconds: 1800 }
);
</code>
</pre>
</div>

----
## TP 2 : Requêtes géospatiales

### Exercice 2.1 : Enrichissement des données

1.

```js
db.utilisateurs.updateMany(
  {},
  {
    $set: {
      "adresse.localisation": {
        type: "Point",
        coordinates: [-8.783939155452344, 40.50874958500967],
      },
    },
  }
);
```

2.

```js
db.createCollection("bibliotheques")
db.bibliotheques.insertMany([{
    "nom": "Le bon bouquin",
    "adresse": {
      "rue": "7 Avenue Alexandre Dumas",
      "ville": "Rennes",
      "code_postal": "35000"
    },
    "localisation": {
      "type": "Point",
      "coordinates": [
          -8.77988801862989,
          40.49907433502494
        ],
    },
    "zone_service": {
      "coordinates": [
          [
            [
              -8.793693397641107,
              40.48990799672518
            ],
            [
              -8.759444021611358,
              40.485731046046084
            ],
            [
              -8.761293583118459,
              40.50282483830162
            ],
            [
              -8.783939155452344,
              40.50874958500967
            ],
            [
              -8.793693397641107,
              40.48990799672518
            ]
          ]
        ],
        "type": "Polygon"
    }
  }, ... ])
```

3.

```js
db.utilisateurs.createIndex({ "adresse.localistaion": "2dsphere" });
db.bibliotheques.createIndex({ zone_service: "2dsphere" });
db.bibliotheques.createIndex({ localistaion: "2dsphere" });
```

### Exercice 2.2 : Requêtes de proximité

1.

```js
db.utilisateurs
  .find({
    "adresse.localisation": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [2.3522, 48.8566],
        },
        $maxDistance: 5000,
      },
    },
  })
  .limit(5);
```

2.

```js
db.bibliotheques.find({
  localisation: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-1.6727791162001013, 48.10997649922383], // Coordonnées d'un utilisateur
      },
    },
  },
});
```

3.

```JS
db.bibliotheques.aggregate([
  {
    $geoNear: {
			key: "localisation",
      near: {
        type: "Point",
        coordinates: [-1.6727791162001013, 48.10997649922383] // Coordonnées d'un utilisateur
      },
      distanceField: "distance",  // En kilomètres
			distanceMultiplier: 0.001,
      spherical: true
    },
  },
  {$sort: { distance: 1}}
])
```

### Exercice 2.3 : Requêtes géospatiales avancées

1.

```js
db.utilisateurs.find({
  "adresse.localisation": {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [
          [
            [2.32, 48.87],
            [2.38, 48.87],
            [2.38, 48.83],
            [2.32, 48.83],
            [2.32, 48.87],
          ],
        ],
      },
    },
  },
});
```

3.

```js
db.createCollection("rues");

db.rues.insertOne({
  localisation: {
    coordinates: [
      [4.835716014371769, 45.75748559616645],
      [4.827791834744062, 45.759667304678544],
    ],
    type: "LineString",
  },
});

db.rues.createIndex({ localisation: "2dsphere" });

db.bibliotheques.find({
  zone_service: {
    $geoIntersects: {
      $geometry: {
        type: "LineString",
        coordinates: [
          //coordonnées de la rue
          [4.835716014371769, 45.75748559616645],
          [4.827791834744062, 45.759667304678544],
        ],
      },
    },
  },
});
```

2.

```js
db.utilisateurs.find({
  "adresse.localisation": {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [
          [
            // Coordonnées de la zone de services
            [-1.6814451009163918, 48.11240663154783],
            [-1.683342467907437, 48.11219224658123],
            [-1.6840235740067158, 48.11189990200302],
            [-1.6845587287991464, 48.11143214721878],
            [-1.684587919060533, 48.110191277092355],
            [-1.6831284059905727, 48.110191277092355],
            [-1.683118675903188, 48.11060057264447],
            [-1.6819705256214945, 48.11064604972694],
            [-1.681308879696985, 48.11087343453505],
            [-1.6814451009163918, 48.11240663154783],
          ],
        ],
      },
    },
  },
});
```

### Exercice 2.4 : Cas d'utilisation métier

1.

```js
db.createCollection("livraisons");

db.livraisons.insertOne({
  livre: {
    livreId: ObjectId("67c85dcd785accb610182bd6"),
    titre: "Its Only Art If Its Well Hung!",
  },
  utilisateur: {
    userId: ObjectId("67c82b96785accb6101804c0"),
    nom: "Gauthier",
    prenom: "Chloé",
    adresse: {
      rue: "112 Avenue Victor Hugo",
      ville: "Rennes",
      code_postal: "35000",
    },
  },
  pointDepart: {
    type: "Point",
    coordinates: [-1.682972724596425, 48.11131520785705],
  },
  pointArrivee: {
    type: "Point",
    coordinates: [-1.6727791162001013, 48.10997649922383],
  },
  positionActuelle: {
    coordinates: [-1.6818860919391625, 48.11019959918221],
    type: "Point",
  },
  itineraire: {
    coordinates: [
      [-1.6727788693297327, 48.10991362054489],
      [-1.6739596631343545, 48.10990352086043],
      [-1.6740442998165008, 48.11021556577137],
      [-1.683150188534512, 48.11019649127422],
      [-1.683123881330431, 48.11112352423308],
      [-1.683042140522133, 48.11132623974399],
    ],
    type: "LineString",
  },
  statut: "En cours",
});
```

2.

```js
function mettreAJourPositionLivraison(livraisonId, nouvellePosition){
  const resultat = await db.livraisons.updateOne(
      { _id: livraisonId },
      { $set: { positionActuelle: nouvellePosition } }
    );
}
```

3.

```js
db.livraisons.find({
  statut: "En cours",
  positionActuelle: {
    $near: {
      $geometry: {
        coordinates: [-1.6819211237145737, 48.111076743617446],
        type: "Point",
      },
      $maxDistance: 1000,
    },
  },
});
```

## TP 3 : Framework d'agrégation

### Exercice 3.1 : Agrégations de base

1.

```js
db.livres.aggregate([
  {
    $group: {
      _id: "$genre",

      nbLivre: { $sum: 1 },
      note_moyenne: { $avg: "$note_moyenne" },
      prix_moyen: { $avg: "$prix" },
      prix_min: { $min: "$prix" },
      prix_max: { $max: "$prix" },
    },
  },
]);
```

2.

```js
db.livres.aggregate([
  { $unwind: "$editeur" },
  {
    $group: {
      _id: "$editeur",
      nbLivre: { $sum: 1 },
      genres: { $addToSet: "$genre" },
      auteurs: { $addToSet: "$auteur" },
    },
  },
  {
    $project: {
      nbLivres: "$nbLivre",
      nbGenres: { $size: "$genres" },
      nbAuteurs: { $size: "$auteurs" },
    },
  },
]);
```
