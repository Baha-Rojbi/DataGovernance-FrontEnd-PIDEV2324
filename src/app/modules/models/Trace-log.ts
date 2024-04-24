export class TraceLog {
  id: number;
  action: string;
  fileName: string;
  description: string;
  timestamp: Date;
  // Assuming Utilisateur is another entity you need, include its properties as well
  utilisateurId: number;
  utilisateur: any; // Or define a Utilisateur class if needed

  constructor(data?: Partial<TraceLog>) {
      Object.assign(this, data);
  }
}
