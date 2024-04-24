import { Route } from '@angular/router';
import { CryptoComponent } from './crypto.component';
import { CryptoResolver } from './crypto.resolvers';

export const cryptoRoutes: Route[] = [
    {
        path     : '',
        component: CryptoComponent,
        resolve  : {
            data: CryptoResolver
        }
    }
];
