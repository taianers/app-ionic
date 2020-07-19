import { OnInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { OverlayService } from 'src/app/core/services/overlay.service';

import { AuthService } from 'src/app/core/services/auth.service';
import { AuthProvider } from './../../../core/services/auth.types';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authForm: FormGroup;
  authProviders = AuthProvider;
  configs = {
    isSignIn: true,
    action: 'Entrar',
    actionChange: 'Cadastrar',
  };
  private nameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  private createForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get name(): FormControl {
    return this.authForm.get('name') as FormControl;
  }
  get email(): FormControl {
    return this.authForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.authForm.get('password') as FormControl;
  }

  changeAuthAction(): void {
    this.configs.isSignIn = !this.configs.isSignIn;
    const { isSignIn } = this.configs;
    this.configs.action = isSignIn ? 'Entrar' : 'Cadastrar';
    this.configs.actionChange = isSignIn ? 'Cadastrar' : 'Já tenho uma conta';
    !isSignIn ? this.authForm.addControl('name', this.nameControl) : this.authForm.removeControl('name');
  }
  async onSubmit(provider: AuthProvider): Promise<void> {
    const loading = await this.overlayService.loading();
    try {
      const credentials = await this.authService.authenticate({
        isSignIn: this.configs.isSignIn,
        user: this.authForm.value,
        provider,
      });
      this.navCtrl.navigateForward(this.route.snapshot.queryParamMap.get('redirect') || '/tasks');
    } catch (e) {
      console.log('Auth error:', e);
      const toast = await this.overlayService.toast({
        message: e.message,
      });
    } finally {
      loading.dismiss();
    }
  }
}
