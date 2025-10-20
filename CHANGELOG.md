# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.0](https://github.com/zthun/romulator/compare/v1.5.0...v1.6.0) (2025-10-20)


### Features

* add support for assign in the system builder ([106ef1d](https://github.com/zthun/romulator/commit/106ef1db3cd57b610f4b3ae0eb4058c53bf55117))
* expand system types ([575139d](https://github.com/zthun/romulator/commit/575139d67aa9e5694fcb6d1e88b9d33b647f7b43))


### Bug Fixes

* split media type from system to game ([0e8d3a4](https://github.com/zthun/romulator/commit/0e8d3a4ee01c987d6384e0bb30e1d50ede2549e5))
* system page tiles are now centered ([1ee902e](https://github.com/zthun/romulator/commit/1ee902e1df48351c384384f2af2a3e64fc0a501f))



## [1.5.0](https://github.com/zthun/romulator/compare/v1.4.0...v1.5.0) (2025-10-14)


### Features

* add a game list to the system page ([72f362b](https://github.com/zthun/romulator/commit/72f362bb8517d1791f40a6e58d8a624027f98f0a))
* game tile displays a game in a tile to navigate to the games page ([057aef9](https://github.com/zthun/romulator/commit/057aef94f1c28f8211d95c9503dd8ea4c8ba06e7))
* games list shows a grid view list of games given a request ([c1ab661](https://github.com/zthun/romulator/commit/c1ab661dc1b3f0a19750ce25332313f15220a50c))
* games service allows you to query the games list ([b31d2ab](https://github.com/zthun/romulator/commit/b31d2ab011869030df743a68a0164dd8688deeee))


### Bug Fixes

* system page should now renew game list when url id is changed by the user ([f58919e](https://github.com/zthun/romulator/commit/f58919ea788efdb70cb7a8afa37f505ad920c447))



## [1.4.0](https://github.com/zthun/romulator/compare/v1.3.5...v1.4.0) (2025-10-12)


### Features

* games service api ([9dfe8f3](https://github.com/zthun/romulator/commit/9dfe8f3db5a19d10d62fef1a65857c788cef51fb))



## [1.3.5](https://github.com/zthun/romulator/compare/v1.3.4...v1.3.5) (2025-10-04)

**Note:** Version bump only for package romulator





## [1.3.4](https://github.com/zthun/romulator/compare/v1.3.3...v1.3.4) (2025-09-09)

**Note:** Version bump only for package romulator





## [1.3.3](https://github.com/zthun/romulator/compare/v1.3.2...v1.3.3) (2025-09-06)

**Note:** Version bump only for package romulator





## [1.3.2](https://github.com/zthun/romulator/compare/v1.3.1...v1.3.2) (2025-07-18)

**Note:** Version bump only for package romulator





## [1.3.1](https://github.com/zthun/romulator/compare/v1.3.0...v1.3.1) (2025-07-01)

**Note:** Version bump only for package romulator





## [1.3.0](https://github.com/zthun/romulator/compare/v1.2.0...v1.3.0) (2025-06-29)


### Features

* media api allows consumers to retrieve the media found in the media folder ([e54d305](https://github.com/zthun/romulator/commit/e54d305ddc9341eb86c7e40ddb6d89ee9508b605))
* media model describes a media item for a system or game ([91a958e](https://github.com/zthun/romulator/commit/91a958ec6b6ca1a0ab6808145f534aa8e8033cf2))
* media/id endpoint now uses content negotiation for the format ([769cf2b](https://github.com/zthun/romulator/commit/769cf2b5c0ddc547156672faf7204119a113c0cf))
* you can list media ([666a8cb](https://github.com/zthun/romulator/commit/666a8cb26e5d1413135c016d269c4daf627cd94c))
* you can now delete media ([d9ffe6e](https://github.com/zthun/romulator/commit/d9ffe6e14cb776fae4b73e534389c12e76ebc802))
* you can now determine if a system slug is a supported system ([2d74442](https://github.com/zthun/romulator/commit/2d7444286b408179e8bb511e5903d4c5998f783b))
* you can now figure out and retrieve media information from a file path ([1e311ba](https://github.com/zthun/romulator/commit/1e311bad76e5b5a6bfcaf6971520b8262e3f592c))
* you can retrieve an individual piece of media ([2440eb0](https://github.com/zthun/romulator/commit/2440eb0624410fc1ab795b5b85b986138cc42b07))


### Bug Fixes

* config known now returns consistent types ([ad73940](https://github.com/zthun/romulator/commit/ad73940fc8911e4b3bde0326f1d60bcf422fed44))
* known systems now return the correct types ([e34edac](https://github.com/zthun/romulator/commit/e34edac44028c04c7529f88cd4593350325965aa))



## [1.2.0](https://github.com/zthun/romulator/compare/v1.1.0...v1.2.0) (2025-06-22)


### Features

* media and game folder now have fallback values ([ec03c5a](https://github.com/zthun/romulator/commit/ec03c5acad22bff08a0c15d0544cc2435a07c0f6))
* systems now show in order of generation and by wheels on the systems page ([09266c3](https://github.com/zthun/romulator/commit/09266c39b1be1ef057c761ae52a2443ee00db17a))
* systems now use the games config ([67d063f](https://github.com/zthun/romulator/commit/67d063fbf6ac2ed88c637f67225fb7eddcb4b10a))


### Bug Fixes

* point to correct main ([d3fea27](https://github.com/zthun/romulator/commit/d3fea27a670d2e12884371a0f4b7689fa9906e0b))



## 1.1.0 (2025-06-21)


### Features

* application configuration will be under the application directory at .zthunworks/romulator ([6515e11](https://github.com/zthun/romulator/commit/6515e116c52cdb2a082cdbc0d8280e5ebddcae0a))
* clicking the see games button navigates to the system page ([7d593da](https://github.com/zthun/romulator/commit/7d593da39ffe288fa63e5b5e6c2040f5e9447800))
* config describes where things are located and what options to use ([fc51ee7](https://github.com/zthun/romulator/commit/fc51ee7660b54f0acf4adbd07ee8f26beebf4885))
* menu is used for navigation ([d9d4b98](https://github.com/zthun/romulator/commit/d9d4b98c10c253489a3b74da577b47685fb4ed3c))
* patch config updates a configs contents ([d6c4981](https://github.com/zthun/romulator/commit/d6c49810fba8c2eb1690bd7351905f8f33f9441c))
* price information describes original prices of things ([ac54b67](https://github.com/zthun/romulator/commit/ac54b67912d73a46ad3279dd34d2f07a25b0ddb7))
* romulator api adds an api for managing the games and media folder ([a567d54](https://github.com/zthun/romulator/commit/a567d5408a07f142a4ecda7637d4df55b2769030))
* romulator api adds support to get information based on your roms directory ([58d61a6](https://github.com/zthun/romulator/commit/58d61a65317fa33b0478f39cec9ca124d16a8618))
* romulator client is a client app that defines models and services to connect to the romulator-api ([db02593](https://github.com/zthun/romulator/commit/db025938bc7335249a9c2f7443d9c685f04bb9d6))
* romulator library system builder ([7b46bad](https://github.com/zthun/romulator/commit/7b46bad372cc8da464afc0de4c53706026d7d1e7))
* romulator supports a known set of systems ([d971455](https://github.com/zthun/romulator/commit/d9714559f1142366f2a33c0ab5a87daea727f378))
* romulator ui favicon ([d93d464](https://github.com/zthun/romulator/commit/d93d46431e181e8e310d58e217d6eea60cf733dd))
* setting page allows the user to modify an individual config ([53cd620](https://github.com/zthun/romulator/commit/53cd6203dfbb145c7883dd90363e649467a7a2d3))
* settings page allows user to edit settings ([f13fdcb](https://github.com/zthun/romulator/commit/f13fdcbc5f28a651c3f015fdff537b934d935ad2))
* settings page let's you navigate the settings files ([c72a8cf](https://github.com/zthun/romulator/commit/c72a8cfa174cb5de5e3ee30537214901d79bd1e5))
* snes ([feb6a7c](https://github.com/zthun/romulator/commit/feb6a7ceae773d39e3fd3386c121e24ed406c1e8))
* system api now supports reading an individual system ([1e875cb](https://github.com/zthun/romulator/commit/1e875cb7d7190805ac422b2b02b0dbdd9166bb6a))
* system page shows information about a system ([43059e8](https://github.com/zthun/romulator/commit/43059e8345738bebd0bafa928e713a32d42820de))
* system page shows information about the system ([b7927e9](https://github.com/zthun/romulator/commit/b7927e9380c0664806691ebff6b2179118096a04))
* systems page shows a list of available systems ([8872851](https://github.com/zthun/romulator/commit/887285170f9ab8409573167b792846febc7d3201))
* systems service retrieves the current systems that are discovered ([468c7b5](https://github.com/zthun/romulator/commit/468c7b5d63563c27ed233ecb370088ba39b3df68))
* the systems page renders all available systems ([f2edab6](https://github.com/zthun/romulator/commit/f2edab6067f78d25900846e3efbe9a06d9a688ad))
* you can now list and read configs through the api ([b78defb](https://github.com/zthun/romulator/commit/b78defb94865ced973311f33a08f32beb711be4c))
