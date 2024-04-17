import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
<<<<<<< Updated upstream

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
=======
import { AppModule } from 'app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
                        .catch(err => console.error(err));
>>>>>>> Stashed changes
