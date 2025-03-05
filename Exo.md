# Exercice

## TP2

### Exercice 1

2. ![alt text](image.png) pour tester
   puis db.ecommerce_produits.insertMany([]) avec 9 autres éléments

### Exercice 2

1.

```js
db.ecommerce_produits.find({ categorie: "Vetements" });
```

2.

```js
db.ecommerce_produits.find({
  $and: [{ prix: { $gt: 50 } }, { prix: { $lt: 200 } }],
});
```

3.

```js
db.ecommerce_produits.find({ stock: { $gt: 0 } });
```

4.

```js
db.ecommerce_produits.find({ $expr: { $gte: [{ $size: "$avis" }, 3] } });
```

### Exercice 3

1.

```js
db.ecommerce_produits.updateMany(
  { categorie: "Vetement" },
  { $mul: { prix: 1.05 } }
);
```

2.

```js
db.ecommerce_produits.updateMany(
  { categorie: "Vetement" },
  { $set: { promotions: "-50%" } }
);
```

3.

```js
db.ecommerce_produits.updateMany(
  { categorie: "Vetement" },
  { $push: { tags: "Geek" } }
);
```

4.

```js
db.ecommerce_produits.updateMany(
  { _id: ObjectId("67c589d6f1c87978b638f9ce") },
  { $inc: { stock: -1 } }
);
```

### Exercice 4

1.

```js
db.ecommerce_produits.find({
  $and: [{ tags: "pull" }, { tags: "color" }],
});
```

2.

```js
db.ecommerce_produits.updateMany(
  { prix: { $gt: 75 } },
  { $set: { premium: true } }
);
db.ecommerce_produits.find({
  $and: [{ premium: true }, { stock: { $lt: 5 } }],
});
```

3.

```js
db.ecommerce_produits.find({
  avis: {
    $elemMatch: { note: { $eq: 5 } },
  },
});
```

4.

```js
db.ecommerce_produits
  .find({ categorie: "Vetements" })
  .limit(5)
  .sort({ prix: -1 });
```

## TP3

### Partie 2

1.

```js
db.livres.find({ disponible: true });
```

2.

```js
db.livres.find({ annee_publication: { $gt: 2000 } });
```

3.

```js
db.livres.find({ auteur: "George Orwell" });
```

4.

```js
db.livres.find(
  { note_moyenne: { $gt: 4 } },
  { titre: 1, auteur: 1, note_moyenne: 1 }
);
```

5.

```js
db.utilisateurs.find({ "adresse.ville": "Lyon" });
```

6.

```js
db.livres.find({ genre: { $all: ["Drame"] } });
```

7.

```js
db.livres.find(
  {
    prix: { $lt: 15 },
    note_moyenne: { $gt: 4 },
  },
  { titre: 1, auteur: 1, note_moyenne: 1, prix: 1 }
);
```

8.

```js
db.utilisateurs.find({ livres_empruntes: { $elemMatch: { titre: "1984" } } });
```

### Partie 3

1.

```js
db.livres.updateOne(
  { _id: ObjectId("67c6c1cd7016240f166382c3") },
  { $set: { titre: "Arsène Lupin, gentleman cambrioleur" } }
);
```

2.

```js
db.livres.updateMany({}, { $set: { stock: 5 } });
```

3.

```js
db.livres.updateOne(
  { _id: ObjectId("67c6c1cd7016240f166382c3") },
  { $set: { disponible: false } }
);
```

4.

```js
db.utilisateurs.updateOne(
  { _id: ObjectId("67c6b9fc7016240f166382bf") },
  {
    $push: {
      livres_empruntes: {
        livre_id: ObjectId("67c6c1cd7016240f166382c3"),
        titre: "Arsène Lupin, gentleman cambrioleur",
        date_emprunt: new Date("2025-03-01"),
        date_retour_prevue: new Date("2025-04-01"),
      },
    },
  }
);
```

5.

```js
db.utilisateurs.updateOne(
  { _id: ObjectId("67c6b9fc7016240f166382bf") },
  {
    $set: {
      adresse: {
        rue: "7 rue des Capitaux",
        ville: "Lyon",
        code_postal: "69007",
      },
    },
  }
);
```

6.

```js
db.utilisateurs.updateOne(
  { _id: ObjectId("67c6b9fc7016240f166382bf") },
  { $push: { tags: "meurtre" } }
);
```

7.

```js
db.livres.updateOne(
  { _id: ObjectId("67c6c1cd7016240f166382c3") },
  { $set: { note_moyenne: 3.9 } }
);
```

### Partie 4

1.

```js
db.livres.deleteOne({ titre: "L'avare" });
```

2.

```js
db.livres.deleteMany({ auteur: "Karl Marx" });
```

3.

```js
db.utilisateurs.deleteOne({ email: "Charles.leclerc@example.com" });
```

### Partie 5

1.

```js
db.livres.find().sort({ note_moyenne: -1 });
```

2.

```js
db.livres.find().sort({ annee_publication: 1 }).limit(3);
```

3.

```js
db.livres.find({ auteur: "Victor Hugo" }).count();
```

4.

```js
db.livres.find({}, { _id: 0, titre: 1, auteur: 1, note_moyenne: 1 });
```

5.

```js
db.utilisateurs.find({ $expr: { $gt: [{ $size: "$livres_empruntes" }, 1] } });
```

6.

```js
db.livres.find({ titre: { $regex: /^Le/ } });
```

7.

```js
db.livres.find({
  prix: { $gte: 10, $lte: 20 },
});
```

## Partie 6

### 6.1 Modèle embarqué vs référence

1. Créez une nouvelle collection `emprunts` qui utilise des références vers les livres et les utilisateurs
2. Insérez au moins 3 emprunts dans cette collection
3. Comparez cette approche avec celle où les emprunts sont directement intégrés dans le document utilisateur

Modèle pour la collection `emprunts` :

```js
{
  utilisateur_id: ObjectId("..."),
  livre_id: ObjectId("..."),
  date_emprunt: new Date("2023-02-20"),
  date_retour_prevue: new Date("2023-03-20"),
  date_retour_effective: null,
  statut: "en cours" // en cours, retourné, en retard
}
```

### 6.2 Réflexion sur la modélisation

Répondez aux questions suivantes :

1. Quels sont les avantages et inconvénients de chaque approche ?

#### Tableau Comparatif

| Critère                    | Collection `emprunts` séparée                          | Emprunts intégrés dans `utilisateurs`                     |
| -------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| **Facilité de requêtage**  | Facile pour chercher un emprunt spécifique             | Facile pour récupérer tous les emprunts d'un utilisateur  |
| **Mises à jour**           | Faciles et indépendantes                               | Complexes (besoin de `$set` et `$elemMatch`)              |
| **Scalabilité**            | Meilleure gestion des grands volumes                   | Peut devenir trop volumineux                              |
| **Suppression**            | Nécessite de supprimer les emprunts séparément         | Suppression automatique avec l’utilisateur                |
| **Performance en lecture** | Requiert `$lookup` pour joindre utilisateurs et livres | Plus rapide pour récupérer un utilisateur et ses emprunts |

2. Quelle approche privilégieriez-vous pour une application réelle et pourquoi ?

L'utilisation de la collection emprunts sera privilégier dans le cas d'une application qui gère beaucoup d’emprunts (bibliothèque réelle avec milliers d’emprunts). Une meilleure scalabilité et des requêtes plus efficaces semble donc la meilleurs approche.

3. Comment modéliseriez-vous les cas où un même livre peut exister en plusieurs exemplaires ?

Il est possible d'utiliser la même approche qu'avec les emprunts, et de renseigné tout les exemplaire avec l'id du livre dans une nouvelle collection. Cela apporterai les même avantages : une meilleur scalabilité, et des mise à jour plus faciles.
