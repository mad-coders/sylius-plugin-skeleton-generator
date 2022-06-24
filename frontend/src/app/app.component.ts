import {Component} from '@angular/core';
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {camelCase, kebabCase, snakeCase} from "literal-case";
import {GeneratorService} from "./services/generator.service";
import {IPluginNameRequestData} from "./ interfaces/plugin-name-request-data.interface";
import {IPluginAuthors} from "./ interfaces/plugin-authors.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  // Variables Block
  imageMadcodersSrc = '/assets/img/madcoders-logo-slogan.png';
  imageMacopediaSrc = '/assets/img/logo_macopedia_rgb.png';
  imageMadcodersAlt = 'Madcoders Logo';
  imageMacopediaAlt = 'Macopedia Logo';
  title = 'Generator Sylius Plugin';

  pluginNameForm = this.fb.group({
    syliusVersion: ['', Validators.required],
    namespace: ['', Validators.required],
    pluginNameInput: ['', Validators.required],
    pluginNameInputCamel: ['', Validators.required],
    pluginNameInputSnake: ['', Validators.required],
    pluginComposePackageName: ['', Validators.required],
    pluginDescription: ['', Validators.required],
    emailForSendingPlugin: ['',
      Validators.compose([
        Validators.email,
        Validators.required
      ])],
    rodoCheckbox: [false, Validators.requiredTrue],
    authors: this.fb.array([])
  });

  constructor(private fb: FormBuilder,
              public generatorService: GeneratorService) {
  }

  async ngOnInit(): Promise<void> {
    await this.init();
  }

  async init(): Promise<void> {
    this.pluginNameVariantsInputShow();
    this.transformValueForPluginNameInputCamel();
    this.transformValueForPluginNameInputSnake();
    this.transformValueForPluginComposePackageName();
    this.addAuthor();
  }

  get authors() {
    return this.pluginNameForm.controls["authors"] as FormArray;
  }

  addAuthor() {
    const authorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['',
        Validators.compose(
          [Validators.email, Validators.required])]
    });

    this.authors.push(authorForm);
  }

  deleteAuthor(i: number) {
    this.authors.removeAt(i);
  }

  //  pluginNameVariantsInputShow
  pluginNameVariantsInputShow() {
    const formRaw = this.pluginNameForm;
    const pluginNameInputForm = document.getElementById('pluginNameInput') as HTMLInputElement | null;
    const pluginNameInputCamelForm = document.getElementById('pluginNameInputCamel') as HTMLInputElement | null;
    const pluginNameInputSnakeForm = document.getElementById('pluginNameInputSnake') as HTMLInputElement | null;
    const pluginComposePackageNameForm = document.getElementById('pluginComposePackageName') as HTMLInputElement | null;
    pluginNameInputForm?.addEventListener('keyup', function handleClick() {
      formRaw.controls.pluginNameInputCamel.setValue(camelCase(pluginNameInputForm?.value));
      pluginNameInputCamelForm?.parentElement?.classList.add('block')
      pluginNameInputCamelForm?.parentElement?.classList.remove('hidden')
      formRaw.controls.pluginNameInputSnake.setValue(snakeCase(pluginNameInputForm.value));
      pluginNameInputSnakeForm?.parentElement?.classList.add('block')
      pluginNameInputSnakeForm?.parentElement?.classList.remove('hidden')
      formRaw.controls.pluginComposePackageName.setValue(kebabCase(pluginNameInputForm.value));
      pluginComposePackageNameForm?.parentElement?.classList.add('block')
      pluginComposePackageNameForm?.parentElement?.classList.remove('hidden')
    })
    pluginNameInputForm?.addEventListener('blur', function handleClick() {
      const pluginNameInputCamel = document.getElementById('pluginNameInputCamel');
      const pluginNameInputSnake = document.getElementById('pluginNameInputSnake');
      const pluginComposePackageName = document.getElementById('pluginComposePackageName');
      if (pluginNameInputForm.value == null || pluginNameInputForm.value == "") {
        pluginNameInputCamel?.parentElement?.classList.add('hidden');
        pluginNameInputCamel?.parentElement?.classList.remove('block');
        pluginNameInputSnake?.parentElement?.classList.add('hidden');
        pluginNameInputSnake?.parentElement?.classList.remove('block');
        pluginComposePackageName?.parentElement?.classList.add('hidden');
        pluginComposePackageName?.parentElement?.classList.remove('block');
      }
    })
  };

  // transform value for pluginNameInputCamel
  transformValueForPluginNameInputCamel() {
    const pluginNameInputCamel = document.getElementById('pluginNameInputCamel') as HTMLInputElement | null;
    pluginNameInputCamel?.addEventListener('keyup', function handleClick() {
      pluginNameInputCamel.value = camelCase(pluginNameInputCamel.value);
    })
  };

  // transform value for pluginNameInputSnake
  transformValueForPluginNameInputSnake() {
    const pluginNameInputSnake = document.getElementById('pluginNameInputSnake') as HTMLInputElement | null;
    pluginNameInputSnake?.addEventListener('keyup', function handleClick() {
      pluginNameInputSnake.value = snakeCase(pluginNameInputSnake.value);
    })
  };

  // transform value for pluginComposePackageName
  transformValueForPluginComposePackageName() {
    const pluginComposePackageName = document.getElementById('pluginComposePackageName') as HTMLInputElement | null;
    pluginComposePackageName?.addEventListener('keyup', function handleClick() {
      pluginComposePackageName.value = kebabCase(pluginComposePackageName.value);
    })
  };

  generatePlugin() {
    const sendingFormBlock = document.getElementById('sendingFormBlock') as HTMLInputElement | null;
    const submitFormBlock = document.getElementById('submitFormBlock') as HTMLInputElement | null;
    sendingFormBlock?.classList.add('block');
    sendingFormBlock?.classList.remove('hidden');
    submitFormBlock?.classList.add('hidden');
    submitFormBlock?.classList.remove('block');
  }

  async onSubmit(): Promise<void> {
    console.log('this.pluginNameForm.invalid: ', this.pluginNameForm.invalid)
    if (this.pluginNameForm.invalid || this.pluginNameForm.pristine) {
      console.log('invalid:');
      return;
    }

    const formRaw = this.pluginNameForm.getRawValue();
    const syliusVersion = formRaw.syliusVersion ? formRaw.syliusVersion : '';
    const namespace = formRaw.namespace ? formRaw.namespace : '';
    const pluginNameInput = formRaw.pluginNameInput ? formRaw.pluginNameInput : '';
    const pluginNameInputCamel = formRaw.pluginNameInputCamel ? formRaw.pluginNameInputCamel : '';
    const pluginNameInputSnake = formRaw.pluginNameInputSnake ? formRaw.pluginNameInputSnake : '';
    const pluginComposePackageName = formRaw.pluginComposePackageName ? formRaw.pluginComposePackageName : '';
    const pluginDescription = formRaw.pluginDescription ? formRaw.pluginDescription : '';
    const rodoCheckboxChecked = formRaw.rodoCheckbox ? formRaw.rodoCheckbox : false;
    const emailForSendingPlugin = formRaw.emailForSendingPlugin ? formRaw.emailForSendingPlugin : '';
    // @ts-ignore
    const authorsList: IPluginAuthors[] = formRaw.authors;

    const pluginGeneratorRequestData: IPluginNameRequestData = {
      syliusVersion,
      namespace,
      pluginNameInput,
      pluginNameInputSnake,
      pluginNameInputCamel,
      pluginComposePackageName,
      pluginDescription,
      rodoCheckboxChecked,
      emailForSendingPlugin,
      authorsList
    };

    const request = await this.generatorService.startPluginGenerate(pluginGeneratorRequestData).toPromise();
    if (request) {
      console.log('request: ', request);
    }
  }
}
