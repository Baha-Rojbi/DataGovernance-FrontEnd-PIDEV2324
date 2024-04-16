export class User {
  idUtilisateur: number = 0;
  nom: string = '';
  dateNaissance: Date = new Date();
  dateEmbauche: Date = new Date();
  ncin: string ;
  motDePasse: string = '';
  numTel: string = '';
  email: string = '';
  role: Role = Role.ADMINISTRATEUR; // Default role is ADMINISTRATEUR
  poste: Poste = Poste.DIRECTEUR_GENERALE; // Default poste is DIRECTEUR_GENERALE
  status: UserStatus = UserStatus.PENDING; // Default status is PENDING
  adresse: Adresse = new Adresse();
  enabled: boolean = true;
  password: string = '';
  description : string = ''
  societe : string = ''
  credentialsNonExpired: boolean = true;
  accountNonExpired: boolean = true;
  accountNonLocked: boolean = true;
  username: string = '';
  _status:string
  avatar?: string;
  sexe : string
  ownedTeam: Team | null = null; // Represents the team owned by the user
  teams: Team[] = []; // Represents the teams the user is a member of
  ownedTeamMembers : User[] = [] // contains all the members of the owned team 

  constructor(data?: any) {
      if (data) {
          this.idUtilisateur = data.idUtilsateur;
          this.nom = data.nom;
          this.dateNaissance = new Date(data.dateNaissance);
          this.dateEmbauche = new Date(data.dateEmbauche);
          this.ncin = data.ncin;
          this.motDePasse = data.motDePasse;
          this.numTel = data.numTel;
          this.email = data.email;
          this.role = data.role;
          this.poste = data.poste;
          this.status = data.status;
          this.adresse = data.adresse;
          this.enabled = data.enabled;
          this.password = data.password;
          this.credentialsNonExpired = data.credentialsNonExpired;
          this.accountNonExpired = data.accountNonExpired;
          this.accountNonLocked = data.accountNonLocked;
          this.username = data.username;
          this.sexe = data.sexe
          this.ownedTeam = data.teamOwned || null;
          this.teams = data.teams || [];
          this.ownedTeamMembers = data.ownedTeamMembers
          this.description = data.description
          this.societe = data.societe
      }
  }
}

export class Authority {
  authority: string = '';
}

export enum Role {
  ADMINISTRATEUR = 'ADMINISTRATEUR',
  AUDITEUR = 'AUDITEUR',
  RESPONSABLE_ANALYSE = 'RESPONSABLE_ANALYSE',
  RESPONSABLE_ADMINISTRATION = 'RESPONSABLE_ADMINISTRATION'
}

export enum Poste {
  DIRECTEUR_GENERALE = 'DIRECTEUR_GENERALE',
  DIRECTEUR_FINANCIER = 'DIRECTEUR_FINANCIER',
  DIRECTEUR_RH = 'DIRECTEUR_RH',
  DIRECTEUR_IT = 'DIRECTEUR_IT'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  LOCKED = 'LOCKED'
}

export class Adresse {
  idAdresse: number = 0;
  pays: string = '';
  ville: string = '';
  codePostale: string = '';
  numRue: number = 0;
}

export class Team {
  id: number = 0;
  name: string = '';
  members: User[] = []; // Represents the members of the team

  constructor(data?: any) {
    if (data) {
      this.id = data.id || 0;
      this.name = data.name || '';
      this.members = data.members || [];
    }
  }
}
export const userPosteValues = ['DIRECTEUR_GENERALE','DIRECTEUR_FINANCIER','DIRECTEUR_RH','DIRECTEUR_IT']

