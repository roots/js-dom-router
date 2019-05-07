import Router from './index';

describe('DOM router', () => {
  function makeElement(className:string) : HTMLElement {
    const el = document.createElement('div');
    el.className = className;
    document.body.append(el);
    return el;
  }

  test('it should fire an event for each class name', () => {
    const el = makeElement('kjo apray');
    const callback = jest.fn(() => el.className);

    el.addEventListener('router.kjo', callback);
    el.addEventListener('router.apray', callback);

    new Router(el); // tslint:disable-line

    expect(callback).toMatchSnapshot();
  });

  test('it should use body classes when document is passed', () => {
    const callback = jest.fn(() => document.body.className);
    document.body.className = 'kjo apray';

    document.addEventListener('router.kjo', callback);
    document.addEventListener('router.apray', callback);

    new Router(document); // tslint:disable-line

    expect(callback).toMatchSnapshot();
  });

  test('it should watch target for new classes', (done) => {
    const el = makeElement('kjo');
    const callback = jest.fn(() => el.className);

    const router = new Router(el);

    router.watch();

    el.addEventListener('router.kjo', callback);
    el.addEventListener('router.apray', callback);
    el.addEventListener('router.bdubs', callback);

    setTimeout(() => el.className += ' apray', 100);
    setTimeout(() => el.className += ' budbs', 200);
    setTimeout(() => el.className = 'kjo swalk apray bdubs', 300);
    setTimeout(() => {
      expect(callback).toMatchSnapshot()
      done();
    }, 400);
  });
});
