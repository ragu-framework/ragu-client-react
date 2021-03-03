<p align="center" style="color: #343a40">
  <p align="center" >
    <img src="repository-assets/banner.png" alt="Ragu" align="center" style="max-width: 100%">
  </p>
  <h1 align="center">Ragu Client React</h1>
</p>

![Testing](https://github.com/ragu-framework/ragu-client-react/workflows/Testing/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ragu-framework/ragu-client-react/badge.svg?branch=main)](https://coveralls.io/github/ragu-framework/ragu-client-react?branch=main)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![npm version](https://badge.fury.io/js/ragu-client-react.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A React Client for [Ragu Server - A micro-frontend framework](https://ragu-framework.github.io).

## Installation

```shell script
npm install ragu-client-react
```

## Usage

```jsx
import {RaguComponent} from "ragu-client-react";


<RaguComponent src="https://my-micro-frontend-url/" />
```


| Property           	| Description                                                                           	| Required 	| Default 	|
|--------------------	|---------------------------------------------------------------------------------------	|----------	|---------	|
| src                	| The micro-frontend URL                                                                	| true     	| -       	|
| wrapper            	| The tag that wraps the micro-frontend                                                 	| false    	| "div"   	|
| prefetchResponse   	| A pre-fetch HTML version of the component (used for SSR)                              	| false    	| -       	|
| onFetchCompleted   	| A callback called when component fetch is finished.                                   	| false    	| -       	|
| onFetchFail        	| A callback called when component fetch fails.                                         	| false    	| -       	|
| onHydrateCompleted 	| A callback called when component was hydrated (it means, the render process finished) 	| false    	| -       	|
