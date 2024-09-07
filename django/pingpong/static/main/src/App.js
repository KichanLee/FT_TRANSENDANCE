import StartPage from './pages/StartPage.js';
import Component from './core/Component.js';
import { BackGround } from './threejs/BackGround.js';
import HomePage from './pages/HomePage.js';
import Home from './pages/Home.js';
import InGamePage from './pages/InGamePage.js';
import AiBattlePage from './pages/AiBattlePage.js';
import TournamentPage from './pages/TournamentPage.js';
import TourStandBy from './pages/TourStandBy.js';


// export default class App extends Component {
//   setup() {
//     this.$state = {
//       routes: [],
//     };
//   }
//   template() {
//     return `
//     <main data-component="container">
//       <div class="app-container">
//         <div data-component="background-container"></div>
//         <div data-component="start-page-container"></div>
//       </div>
//       </main>
//     `;
//   }

//   mounted() {
//     const $back = this.$target.querySelector(
//       '[data-component="background-container"]'
//     );
//     const $start = this.$target.querySelector(
//       '[data-component="start-page-container"]'
//     );

//     // Initialize BackGround
//     new BackGround($back);

//     // Initialize StartPage
//     new StartPage($start);

//   }
// }

export default class App extends Component {
  setup() {
    this.$state = {
      routes: [
        { path: '', component: HomePage },
        { path: "ingame-1", component: InGamePage },
 
        { path: "ai-battle", component: AiBattlePage },
        { path: "tournament", component: TournamentPage },
        { path: "standby-2", component: TourStandBy },
        
      ]
    };
    this.route = this.route.bind(this);
  }
  template() {
    return `
    <main data-component="container">
      </main>
    `;
  }

  setEvent() {
    window.addEventListener('hashchange', this.route);
  }

  mounted() {
    
    // const $main = this.$target.querySelector('main');
    // const pages = Home($main);
    // this.$state.routes.push({ fragment: '#/', component: pages.home });
    this.route();
  }
  // route() {
  //   const hash = window.location.hash || '#/';
  //   const routeInfo = this.$state.routes.find(route => route.fragment === hash) || this.$state.routes[0];

  //   if (typeof routeInfo.component === 'function') {
  //     // Instead of using 'new', we just call the function
  //     routeInfo.component();
  //   } else {
  //     console.error('Invalid component for route:', hash);
  //   }
  // }
  route() {
    const hash = window.location.hash.replace("#", "") || "";
    const routeInfo = this.$state.routes.find(route => route.path === hash) || this.$state.routes[0];

    const $main = this.$target.querySelector('main');
    new routeInfo.component($main);
  }
}
