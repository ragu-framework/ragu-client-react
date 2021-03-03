import * as React from "react";
import {render} from "@testing-library/react";
import {RaguComponent} from "./index";
import {Component} from "ragu-dom";
import waitForExpect from "wait-for-expect";

describe('Test', () => {
  const stubLoader = {
    load() {
      return Promise.reject(new Error('any load error'));
    },
    hydrationFactory() {
      return Promise.reject(new Error('any hydration'));
    }
  };

  const src = "http://my-micro-url";

  const componentResponse: Component<any, any> = {
    resolverFunction: 'la',
    state: {},
    props: {},
    client: 'client_url',
    html: 'Hello, World',
    render: async  () => {
    }
  };

  describe('rendering a wrapper', () => {
    it('creates a div by default', () => {
      const component = render(<RaguComponent src={src} loader={stubLoader as any} />);

      expect((component.container.firstChild as HTMLElement).tagName).toBe('DIV');
    });

    it('creates a wrapper with the given tag', () => {
      const component = render(<RaguComponent src={src} wrapper="section" loader={stubLoader as any} />);
      expect((component.container.firstChild as HTMLElement).tagName).toBe('SECTION');
    });
  });

  describe('Pre-fetch', () => {
    it('renders the prefetch content as HTML', () => {
      const component = render(<RaguComponent src={src} loader={stubLoader as any} prefetchResponse={`<div>Hello, World!</div>`} />);

      expect((component.container.firstChild as HTMLElement).innerHTML).toBe(`<div>Hello, World!</div>`);
    });
  });

  describe('disconnecting', () => {
    it('disconnects the component when unmount', async () => {
      const disconnectStub = jest.fn();
      const loadStub = jest.fn(() => Promise.resolve({...componentResponse, disconnect: disconnectStub}));

      const resolvedStubLoader = {
        ...stubLoader,
        load: loadStub
      }

      const component = render(<RaguComponent src={src} wrapper="section" loader={resolvedStubLoader as any}/>);

      setTimeout(() => {
        component.unmount();
      }, 0);

      await waitForExpect(() => {
        expect(disconnectStub).toBeCalled();
      });
    });
  });

  describe('rendering a component', () => {
    it('renders the component html', async () => {
      const loadStub = jest.fn(() => Promise.resolve(componentResponse));

      const resolvedStubLoader = {
        ...stubLoader,
        load: loadStub
      }

      const component = render(<RaguComponent src={src} wrapper="section" loader={resolvedStubLoader as any} />);

      await waitForExpect(() => {
        expect(component.getByText('Hello, World')).not.toBeNull();
      });

      expect(loadStub).toBeCalledWith(src);
    });

    it('hydrates the content', async () => {
      const componentResponseWithHydration: Component<any, any> = {
        ...componentResponse,
        render: async  (el) => {
          el.innerHTML = 'Hydrated hello!'
        }
      };

      const loadStub = jest.fn(() => Promise.resolve(componentResponseWithHydration));

      const resolvedStubLoader = {
        ...stubLoader,
        load: loadStub
      }


      const component = render(<RaguComponent src={src} wrapper="section" loader={resolvedStubLoader as any} />);

      await waitForExpect(() => {
        expect(component.getByText('Hydrated hello!')).not.toBeNull();
      });
    });

    it('updates the html when src changes', async () => {
      const loadStub = jest.fn((src) => Promise.resolve({
        ...componentResponse,
        html: src
      }));

      const resolvedStubLoader = {
        ...stubLoader,
        load: loadStub
      }

      const component = render(<RaguComponent src={src} wrapper="section" loader={resolvedStubLoader as any} />);

      const src2 = "http://my-src";
      component.rerender(<RaguComponent src={src2} wrapper="section" loader={resolvedStubLoader as any} />)

      await waitForExpect(() => {
        expect(component.getByText(src2)).not.toBeNull();
      });
    });
  });

  describe('event handling', () => {
    it('calls a fetch completed event after fetch', async () => {
      const loadStub = jest.fn(() => Promise.resolve(
          {...componentResponse, hydrate: () => new Promise(() => {})}
      ));

      const resolvedStubLoader = {
        ...stubLoader,
        load: loadStub
      }

      const onFetchStub = jest.fn();

      render(<RaguComponent src={src} wrapper="section" loader={resolvedStubLoader as any} onFetchCompleted={onFetchStub} />);

      await waitForExpect(() => expect(onFetchStub).toBeCalled());
    });

    it('calls a fetch fail event after fetch', async () => {
      const loadStub = jest.fn(() => Promise.reject());

      const resolvedStubLoader = {
        ...stubLoader,
        load: loadStub
      }

      const onFetchErrorStub = jest.fn();

      render(<RaguComponent src={src} wrapper="section" loader={resolvedStubLoader as any} onFetchFail={onFetchErrorStub} />);

      await waitForExpect(() => expect(onFetchErrorStub).toBeCalled());
    });

    it('calls a hydrated completed event after hydrate', (done) => {
      const onHydrateStub = jest.fn();

      const loadStub = jest.fn(() => Promise.resolve({
          ...componentResponse,

          render: () => new Promise(async (resolve) => {
            expect(onHydrateStub).not.toBeCalled()

            resolve();

            await waitForExpect(() => expect(onHydrateStub).toBeCalled());
            done();
          }
        )
      }));

      const resolvedStubLoader = {
        ...stubLoader,
        load: loadStub
      }

      render(<RaguComponent src={src} wrapper="section" loader={resolvedStubLoader as any} onHydrateCompleted={onHydrateStub} />);
    });
  });
});
