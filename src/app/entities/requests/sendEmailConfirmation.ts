export class EmailConfirmationRequest {
    email: string;
    jwtToken: string;

    constructor(userEmail: string, jwtToken: string) {
        this.email = userEmail;
        this.jwtToken = jwtToken;
    }
}