import Component from "../core/Component.js";

export default class TourStandBy extends Component
{
    setup()
    {
        super.setup(); 
        this.$state = 
        {
            image: '../../main/public/doublepong.png',
        }
    }
    
    template()
    {
        const { image } = this.$state; 
        return `
        <div class="ingame-container">
            <div class="account-image">
                <img src="${image}" alt="pong">
            </div>
            <div class="account-image">
                <div class="pick-option">
                    <input type="text" class="match-opt" data-option="opt1">
                    <input type="text" class="match-opt" data-option="opt2">
                    <button class="match-btn">MATCH</button>
                </div>
            </div>
        </div>
      `
    }

    setEvent(){
        const { $target } = this;
        $target.addEventListener('input', ({ target }) => {
            if (target.matches('.option')) {
                console.log('Input value:', target.value);
            }
        })
        $target.addEventListener('click', ({ target }) => {
            if ( target.closest('.account-image img'))
            {
                this.goToHome();
            }
            if (target.matches('.match-btn')) {
                this.handleMatchButtonClick();
            }
        });
    }
    handleMatchButtonClick() {
        console.log('Match button clicked');
    
        const opt1Value = this.$target.querySelector('.match-opt[data-option="opt1"]').value;
        const opt2Value = this.$target.querySelector('.match-opt[data-option="opt2"]').value;
        console.log('Option 1:', opt1Value);
        console.log('Option 2:', opt2Value);
    }
    
    goToHome()
    {
        window.location.hash = '#ingame-1';
    }

    mounted()
    {
        this.setEvent();
    }
}