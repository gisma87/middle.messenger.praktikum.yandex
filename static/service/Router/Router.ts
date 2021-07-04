import { historyPush } from '../utils';

function isEqual(lhs: {}, rhs: {}) {
  return lhs === rhs;
}

export type Block = { remove: () => void; render: () => void };

class Route {
  _pathname: string;
  _block: Block;
  _props: { rootQuery: string | undefined };

  constructor(
    pathname: string,
    view: Block,
    props: { rootQuery: string | undefined },
  ) {
    this._pathname = pathname;
    this._block = view;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.remove();
    }
  }

  match(pathname: string) {
    return isEqual(pathname, this._pathname);
  }

  render() {
    this._block.render();
  }
}

class Router {
  private static __instance: Router;
  public routes: Route[] | [] | undefined;
  redirects:
    | { startPath: string; redirectPath: string; isActive: () => boolean }[]
    | undefined;
  private history: History | undefined;
  private _currentRoute: null | Route | undefined;
  private _rootQuery: string | undefined;
  public root: Element | null | undefined;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.redirects = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;
    this.rerender = this.rerender.bind(this);
    this.root = document.querySelector(rootQuery);

    Router.__instance = this;
  }

  addRedirect(
    startPath: string,
    redirectPath: string,
    isActive: () => boolean,
  ) {
    if (this.redirects) {
      this.redirects.push({ startPath, redirectPath, isActive });
    }
  }

  onRoute(pathname: string) {
    let isRedirect = false;
    if (this.redirects?.length) {
      this.redirects.forEach(redirect => {
        const isActive = redirect.isActive();

        if (redirect.startPath === pathname && isActive === true) {
          isRedirect = true;
          historyPush(redirect.redirectPath);
        }
      });
    }
    if (!isRedirect) this._onRoute(window.location.pathname);
  }

  use(pathname: string, block: Block) {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    (this.routes as Route[]).push(route);
    return this;
  }

  start() {
    window.onpopstate = () => {
      this.onRoute(document.location.pathname);
    };

    this.onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    let route = this.getRoute(pathname);
    if (!route) {
      console.log('404 Page Not Found');
      route = this.getRoute('/pageNotFound');
      if (!route) {
        return;
      }
    }

    if (this._currentRoute === null && this.routes !== undefined) {
      this.routes.forEach(item => {
        item.leave();
      });
    }

    if (this._currentRoute !== null) {
      if (this._currentRoute !== undefined) this._currentRoute.leave();
    }
    this._currentRoute = route;
    route.render();
  }

  rerender() {
    if (this.root) this.root.innerHTML = '';
    this.onRoute(window.location.pathname);
  }

  go(pathname: string) {
    if (this.history !== undefined) this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back() {
    if (this.history !== undefined) this.history.back();
  }

  forward() {
    if (this.history !== undefined) this.history.forward();
  }

  getRoute(pathname: string) {
    if (this.routes !== undefined) {
      return this.routes.find(route => route.match(pathname));
    }
  }
}

export { Router, Route };
