/**
 * Watcher options
 */
const watcherOptions = {
  attributeFilter: ['class'],
  attributeOldValue: true,
  attributes: true,
  characterData: false,
  characterDataOldValue: false,
  childList: false,
  subtree: false
};

declare type Options = boolean | AddEventListenerOptions | undefined;
declare interface IListener { handler:EventListener, options:Options }
declare interface IListenerWithType extends IListener { type:string }

declare type IListOfListeners = {
  [key:string]: EventListener | IListener
} | IListenerWithType[]

/**
 * Event-based DOM-based Routing
 *
 * Originally based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 */
export default class Router {
  public static namespace: string = 'router';
  protected bind: HTMLElement|Document;
  protected target: HTMLElement;
  protected watching:boolean = false;

  /**
   * Create a new Router
   */
  constructor(bind: HTMLElement | Document, target?:HTMLElement) {
    this.bind = bind;
    this.target = target || (bind instanceof Document ? bind.body : bind);
  }

  /**
   * Attach a new event listener
   * @param {string|IListOfListeners} type A case-sensitive string representing an event type
   * @param {EventListenerOrEventListenerObject} listener The object which receives a notification
   * @param {Options} options An options object that specifies characteristics about the event listener.
   */
  public on(typeOrTypes:string|IListOfListeners, listener?:EventListener, options?: Options) : this {
    if (typeof typeOrTypes === 'string') {
      this.bind.addEventListener(`${Router.namespace}.${typeOrTypes}`, listener as EventListener, options);
      return this;
    }
    if (typeOrTypes instanceof Array) {
       // tslint:disable-next-line no-shadowed-variable
      typeOrTypes.forEach(listener => this.on(listener.type, listener.handler, listener.options));
      return this;
    }
    Object.keys(typeOrTypes).forEach((type) => {
      const listener = typeOrTypes[type]; // tslint:disable-line no-shadowed-variable
      if ('handler' in listener) {
        this.on(type, listener.handler, listener.options);
        return;
      }
      this.on(type, listener);
    });
    return this;
  }

  /**
   * Attach a new event listener
   * @param type A case-sensitive string representing an event type
   * @param listener The object which receives a notification
   * @param options An options object that specifies characteristics about the event listener.
   */
  public one(type:string, listener:EventListenerOrEventListenerObject, options?: Options) : this {
    options = typeof options === 'object' ? options : { passive: options };
    options.once = true;
    this.bind.addEventListener(`${Router.namespace}.${type}`, listener, options);
    return this;
  }

  /**
   * Detach an event listener
   * @param type A case-sensitive string representing an event type
   * @param listener The object which receives a notification
   * @param options An options object that specifies characteristics about the event listener.
   */
  public off(type:string, listener:EventListenerOrEventListenerObject, options?: Options) : this {
    this.bind.removeEventListener(`${Router.namespace}.${type}`, listener, options);
    return this;
  }

  /**
   * Watch for new class names
   */
  public watch() : this {
    if (this.watching) {
      return this;
    }

    const observer = new MutationObserver(mutations => {
      mutations
        .filter(mutation => mutation.oldValue)
        .forEach(mutation => {
          const old = (mutation.oldValue as string).split(/\s+/);
          Array.from((mutation.target as HTMLElement).classList)
            .filter(className => old.indexOf(className) === -1)
            .forEach(this.dispatch.bind(this));
        });
      observer.observe(this.target, watcherOptions);
    });

    observer.observe(this.target, watcherOptions);

    this.watching = true;

    return this;
  }

  public fire() : this {
    Array.from(this.target.classList).forEach(this.dispatch.bind(this));
    return this;
  }

  public ready() : this {
    if (document.readyState !== 'loading') {
      window.setTimeout(this.fire.bind(this), 0);
      return this;
    }
    document.addEventListener('DOMContentLoaded', this.fire.bind(this));

    return this;
  }

  /**
   * Dispatch Router events
   */
  public dispatch(className: string) : this {
    this.bind.dispatchEvent(new Event(`${Router.namespace}.${className}`));
    return this;
  }
}

export const router = new Router(document);
