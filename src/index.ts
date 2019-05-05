/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
export default class Router {
  public static namespace: string = 'router';
  protected bind: HTMLElement|Document;
  protected target: HTMLElement;

  /**
   * Create a new Router
   */
  constructor(bind: HTMLElement | Document, target = bind) {
    this.bind = bind;
    this.target = (target instanceof Document ? target.body : target);

    Array.from(this.target.classList).forEach(this.fire.bind(this));
  }

  /**
   * Watch for new class names
   */
  public watch() : void {
    const options = {
      attributeFilter: ['class'],
      attributeOldValue: true,
      attributes: true,
      characterData: false,
      characterDataOldValue: false,
      childList: false,
      subtree: false
    };

    const observer = new MutationObserver(mutations => {
      mutations
        .filter(mutation => mutation.oldValue)
        .forEach(mutation => {
          const old = (mutation.oldValue as string).split(/\s+/);
          (mutation.target as HTMLElement).className.split(/\s+/)
            .filter(className => old.indexOf(className) === -1)
            .forEach(this.fire.bind(this));
        });
      observer.observe(this.target, options);
    });

    observer.observe(this.target, options);
  }

  /**
   * Fire Router events
   */
  protected fire(className: string) {
    this.bind.dispatchEvent(new Event(`${Router.namespace}.${className}`));
  }
}
