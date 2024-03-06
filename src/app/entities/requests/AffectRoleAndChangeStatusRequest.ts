import { Role, UserStatus } from "../User";

export class AffectRoleAndChangeStatus {
    private idUtilisateur: number;
    private role: Role;
    private status: UserStatus;

    constructor(idUtilisateur: number, role: Role, status: UserStatus) {
        this.idUtilisateur = idUtilisateur;
        this.role = role;
        this.status = status;
    }
}