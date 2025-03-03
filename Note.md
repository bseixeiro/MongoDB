# MongoDB
## NoSQL

Schema flexible ou absent

Scalabilité horizontale ( résistance à la charge )

|   Concept SQL   |   Concept MongoDB |  Description |
|---    |:-:    |:-:    |
|   Database   |   Database   |   Conteneur physique pour les collections |
|   Table   |   Collection  |  Groupe de documents MongoDB |
|   Row   |   Document   |   Enregistrement unique dans une collection |
|   Column   |   Field   |   Paire clé-valeur dans un document |
|   Index   |   Index   |   Améliore les performances des requêtes |
|   JOIN   |   $lookup & Embedding   |   Association entre documents |
|   Primary Key   |   _id Field   |   Identifiant unique pour chaque document |

Il n'y a pas de relations ( foreign key ) en MongoDB

Différence entre SQL et MongoDB

Schéma : Fixe VS Flexible
Relations : Jointure VS Documents imbriqués
Scalabilité: Verticale VS Horizontale
Requêtes : SQL VS Syntaxe orientée objet

MongoDB = Des fichiers dans des dossiers
Données enregistrer en BSON ( Binary JSON = JSON étendu )

Si bcp de lecture et peu d'écriture => MongoDB
si bcp de référence et d'écriture => SQL
