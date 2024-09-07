import { requestOAuth } from './Account.js'

const Login42Button = {
    render(container) {
        const button = document.createElement('button');
        button.textContent = 'Login with 42';
        button.addEventListener('click', this.handleClick);
        container.appendChild(button);
    },

    handleClick() {
        requestOAuth();
    }
};

export default Login42Button;