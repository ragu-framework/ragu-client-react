import * as React from "react";
import {ComponentLoader, RaguComponent as RaguDOMComponent} from "ragu-dom";

export interface RaguComponentProps {
  src: string;
  wrapper?: string;
  loader?: ComponentLoader;
  prefetchResponse?: string;
  onFetchFail?: () => void;
  onFetchCompleted?: () => void;
  onHydrateCompleted?: () => void;
}


export class RaguComponent extends React.Component<RaguComponentProps, {}>{
  private readonly ref: React.RefObject<HTMLElement>;
  private raguDOMComponent!: RaguDOMComponent;

  constructor(props: RaguComponentProps) {
    super(props);

    this.ref = React.createRef();
  }

  render() {
    return React.createElement(this.props.wrapper || 'div', {ref: this.ref});
  }

  componentDidMount() {
    this.registerRaguDom();
  }

  shouldComponentUpdate(nextProps: Readonly<RaguComponentProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    if (this.props.src !== nextProps.src) {
      this.raguDOMComponent.disconnectComponent();
      return true;
    }
    return false;
  }

  private registerRaguDom() {
    if (this.props.prefetchResponse) {
      this.ref.current.innerHTML = this.props.prefetchResponse;
    }

    this.ref.current.addEventListener('ragu:fetched', () => {
      this.props.onFetchCompleted && this.props.onFetchCompleted();
    });

    this.ref.current.addEventListener('ragu:fetch-fail', () => {
      this.props.onFetchFail && this.props.onFetchFail();
    });

    this.ref.current.addEventListener('ragu:hydrated', () => {
      this.props.onHydrateCompleted && this.props.onHydrateCompleted();
    });

    this.raguDOMComponent = new RaguDOMComponent(this.ref.current, this.props.loader);
    this.raguDOMComponent.fetchComponent(this.props.src);
  }

  componentDidUpdate() {
    this.registerRaguDom();
  }

  componentWillUnmount() {
    this.raguDOMComponent.disconnectComponent();
  }
}
