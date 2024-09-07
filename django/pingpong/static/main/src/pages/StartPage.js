import Component from '../core/Component.js';
import * as Utils from '../Utils.js';
import { requestOAuth, setup2FA, verify2FA } from './Account.js';

export default class StartPage extends Component {
  constructor($target, props) {
    super($target);
    this.props = props;
  }

  setup() {
    this.state = {
      isLoggedIn: Utils.isAuthenticated(),
      is2FAEnabled: false,
      is2FAVerified: false,
      qrUrl: ''
    };
  }

  template() {
    const { isLoggedIn, is2FAEnabled, is2FAVerified } = this.state;
    return `
      <div class="start-page">
        <h1 class="welcome">Welcome to the Game</h1>
        <button type="button" class="btn btn-light game-start">GAME START</button>
        ${isLoggedIn && !is2FAEnabled ? `<button type="button" class="btn btn-primary setup-2fa">Setup 2FA</button>` : ''}
        ${isLoggedIn && is2FAEnabled && !is2FAVerified ? `<button type="button" class="btn btn-warning verify-2fa">Verify 2FA</button>` : ''}
        <div id="twofa-content"></div>
      </div>
    `;
  }

  setEvent() {
    const { $target } = this;
    $target.addEventListener('click', ({ target }) => {
      if (target.classList.contains('game-start')) {
        this.handleGameStart();
      } else if (target.classList.contains('setup-2fa')) {
        this.props.onSetup2FA();
      } else if (target.classList.contains('verify-2fa')) {
        this.props.onVerify2FA();
      }
    });
  }

  handleGameStart() {
    if (this.state.isLoggedIn) {
      if (this.state.is2FAVerified) {
        console.log('Game started!');
        this.routeToGame();
      } else {
        console.log('2FA verification required');
        alert('Please set up Two-Factor Authentication before starting the game.');
        this.props.onVerify2FA();
      }
    } else {
      console.log('Login required to start the game');
      requestOAuth();
    }
  }

  routeToGame() {
    window.location.hash = '#ingame-1';
  }

  showTwoFAVerification() {
    const twofaContent = this.$target.querySelector('#twofa-content');
    if (twofaContent) {
      twofaContent.innerHTML = `
        <h2>2FA Verification Required</h2>
        <p>Please enter your 2FA code to complete login:</p>
        <input type="text" id="login-2fa-code" placeholder="Enter 2FA code" />
        <button id="verify-login-2fa-button">Verify</button>
      `;
      document.getElementById('verify-login-2fa-button')?.addEventListener('click', () => this.handleLoginVerify2FA());
    }
  }

  updateTwoFAUI() {
    const twofaContent = this.$target.querySelector('#twofa-content');
    if (!twofaContent) return;

    if (this.state.isLoggedIn) {
      if (!this.state.is2FAEnabled && this.state.qrUrl) {
        console.log("2FA setup UI is being rendered");
        twofaContent.innerHTML = `
          <h2>Set up Two-Factor Authentication</h2>
          <p>Scan the QR code with your authenticator app:</p>
          <img id="qr-code" src="${this.state.qrUrl}" alt="2FA QR Code" />
          <input type="text" id="verification-code" placeholder="Enter verification code" />
          <button id="verify-2fa-button">Verify and Enable 2FA</button>
        `;
        document.getElementById('verify-2fa-button')?.addEventListener('click', () => this.handleVerify2FA());
      } else if (!this.state.is2FAVerified) {
        this.showTwoFAVerification();
      } else {
        twofaContent.innerHTML = '<p>2FA is enabled and verified for your account.</p>';
      }
    } else {
      twofaContent.innerHTML = '';
    }
  }

  async handleVerify2FA() {
    const verificationCode = document.getElementById('verification-code')?.value;
    if (!verificationCode) {
      alert('Please enter a verification code.');
      return;
    }
    const result = await verify2FA(verificationCode);
    if (result.success) {
      this.setState({ is2FAEnabled: true, is2FAVerified: true });
      Utils.set2FAToken(result.temp_token);
      alert('2FA verification successful and enabled.');
      this.updateTwoFAUI();
    } else {
      alert(result.message || 'Verification failed. Please try again.');
    }
  }

  async handleLoginVerify2FA() {
    const code = document.getElementById('login-2fa-code')?.value;
    if (!code) {
      alert('Please enter a 2FA code.');
      return;
    }
    const result = await verify2FA(code);
    if (result.success) {
      Utils.set2FAToken(result.temp_token);
      this.setState({ is2FAVerified: true });
      this.updateTwoFAUI();
    } else {
      alert('2FA verification failed. Please try again.');
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
    this.updateTwoFAUI();
  }
}