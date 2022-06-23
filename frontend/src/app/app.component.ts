import { Component } from '@angular/core';
import { camelCase, kebabCase, snakeCase} from 'literal-case';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Variables Block
  imageMadcodersSrc = '/assets/img/madcoders-logo-slogan.png'
  imageMadcodersAlt = 'Madcoders Logo'
  title = 'test';

  // Set Variables Block
  async ngOnInit(): Promise<void> {
    this.pluginNameVariantsInputShow();
    this.transformValueForPluginNameInputCamel();
    this.transformValueForPluginNameInputSnake();
    this.transformValueForPluginComposePackageName();
  }

  //  pluginNameVariantsInputShow
  pluginNameVariantsInputShow() {
    const pluginNameInput = document.getElementById('pluginNameInput') as HTMLInputElement | null;
    if (pluginNameInput)  {
      pluginNameInput.addEventListener('keyup', function handleClick() {
        const pluginNameInputCamel = document.getElementById('pluginNameInputCamel') as HTMLInputElement | null;
        const pluginNameInputSnake = document.getElementById('pluginNameInputSnake') as HTMLInputElement | null;
        const pluginComposePackageName = document.getElementById('pluginComposePackageName') as HTMLInputElement | null;
        if (pluginNameInputCamel && pluginNameInputCamel.parentElement) {
          pluginNameInputCamel.value = camelCase(pluginNameInput.value);
          pluginNameInputCamel.parentElement.classList.add('block')
          pluginNameInputCamel.parentElement.classList.remove('hidden')
        }
        if (pluginNameInputSnake && pluginNameInputSnake.parentElement) {
          pluginNameInputSnake.value = snakeCase(pluginNameInput.value);
          pluginNameInputSnake.parentElement.classList.add('block')
          pluginNameInputSnake.parentElement.classList.remove('hidden')
        }
        if (pluginComposePackageName && pluginComposePackageName.parentElement) {
          pluginComposePackageName.value = kebabCase(pluginNameInput.value);
          pluginComposePackageName.parentElement.classList.add('block')
          pluginComposePackageName.parentElement.classList.remove('hidden')
        }
      })
      pluginNameInput.addEventListener('blur', function handleClick() {
        const pluginNameInputCamel = document.getElementById('pluginNameInputCamel');
        const pluginNameInputSnake = document.getElementById('pluginNameInputSnake');
        const pluginComposePackageName = document.getElementById('pluginComposePackageName');
        if (pluginNameInput.value == null || pluginNameInput.value == "") {
          pluginNameInputCamel?.parentElement?.classList.add('hidden');
          pluginNameInputCamel?.parentElement?.classList.remove('block');
          pluginNameInputSnake?.parentElement?.classList.add('hidden');
          pluginNameInputSnake?.parentElement?.classList.remove('block');
          pluginComposePackageName?.parentElement?.classList.add('hidden');
          pluginComposePackageName?.parentElement?.classList.remove('block');
        }
      })
    }
  };

  // transform value for pluginNameInputCamel
  transformValueForPluginNameInputCamel() {
    const pluginNameInputCamel = document.getElementById('pluginNameInputCamel') as HTMLInputElement | null;
    if (pluginNameInputCamel) {
      pluginNameInputCamel.addEventListener('keyup', function handleClick() {
        pluginNameInputCamel.value = camelCase(pluginNameInputCamel.value);
      })
    }
  };

  // transform value for pluginNameInputSnake
  transformValueForPluginNameInputSnake() {
    const pluginNameInputSnake = document.getElementById('pluginNameInputSnake') as HTMLInputElement | null;
    if (pluginNameInputSnake) {
      pluginNameInputSnake.addEventListener('keyup', function handleClick() {
        pluginNameInputSnake.value = snakeCase(pluginNameInputSnake.value);
      })
    }
  };

  // transform value for pluginComposePackageName
  transformValueForPluginComposePackageName() {
    const pluginComposePackageName = document.getElementById('pluginComposePackageName') as HTMLInputElement | null;
    if (pluginComposePackageName) {
      pluginComposePackageName.addEventListener('keyup', function handleClick() {
        pluginComposePackageName.value = kebabCase(pluginComposePackageName.value);
      })
    }
  };
}
