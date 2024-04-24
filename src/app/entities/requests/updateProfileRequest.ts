export class UserProfileRequest {
    idUtilisateur: number;
    nom: string;
    dateNaissance: string;
    dateEmbauche: string;
    ncin: string;
    numTel: string;
    email: string;
    adresse: Address;
  
    constructor(
      idUtilisateur: number,
      nom: string,
      dateNaissance: string,
      dateEmbauche: string,
      ncin: string,
      numTel: string,
      email: string,
      adresse: Address
    ) {
      this.idUtilisateur = idUtilisateur;
      this.nom = nom;
      this.dateNaissance = dateNaissance;
      this.dateEmbauche = dateEmbauche;
      this.ncin = ncin;
      this.numTel = numTel;
      this.email = email;
      this.adresse = adresse;
    }
  }
  
  export class Address {
    pays: string;
    ville: string;
    codePostale: string;
    numRue: number;
  
    constructor(pays: string, ville: string, codePostale: string, numRue: number) {
      this.pays = pays;
      this.ville = ville;
      this.codePostale = codePostale;
      this.numRue = numRue;
    }
  }
  