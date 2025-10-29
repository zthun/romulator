# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.18.0](https://github.com/zthun/romulator/compare/v1.17.0...v1.18.0) (2025-10-29)


### Features

* you can now view the system the game is under ([62748c9](https://github.com/zthun/romulator/commit/62748c900b18124ff9daff7bbec5b7a496774207))



## [1.17.0](https://github.com/zthun/romulator/compare/v1.16.0...v1.17.0) (2025-10-29)


### Features

* game builder now parses new fields ([b135470](https://github.com/zthun/romulator/commit/b135470854403ac711bbc36cfae8c453c3d6af99))
* game information and description now show on the game page ([b9575e0](https://github.com/zthun/romulator/commit/b9575e05dfe0b92db18605bc3bfb133ee3027863))
* players describes a player range ([0b4189f](https://github.com/zthun/romulator/commit/0b4189ff83e91d4fd405c07042b16c8e181692c1))
* players serialize converts a players structure into a string ([8adcd98](https://github.com/zthun/romulator/commit/8adcd98ad7b5164c1781a9039601ffa37bf33a14))



## [1.16.0](https://github.com/zthun/romulator/compare/v1.15.0...v1.16.0) (2025-10-28)


### Features

* game page shows information for a single game ([846b562](https://github.com/zthun/romulator/commit/846b5628bc35f866342e70dad88bb5844c6346d5))
* media now renders for the game page ([c317ae7](https://github.com/zthun/romulator/commit/c317ae7f15b6cd50d65d5b211a5b09b77249ce12))



## [1.15.0](https://github.com/zthun/romulator/compare/v1.14.1...v1.15.0) (2025-10-27)


### Features

* game menu item sub heading is now Browse your library ([4bc7154](https://github.com/zthun/romulator/commit/4bc7154a392560eb0afe46888cbab1f879c4c419))
* games page shows a list of all games across all systems ([9f029bd](https://github.com/zthun/romulator/commit/9f029bd79b486d084bd691a6edef765a5d8d9753))


### Bug Fixes

* tile lists are now constrained to the height properly ([0a7ca31](https://github.com/zthun/romulator/commit/0a7ca31452805ae40d764418f4d81f96ad6d9a40))



## [1.14.1](https://github.com/zthun/romulator/compare/v1.14.0...v1.14.1) (2025-10-26)


### Bug Fixes

* carousel should be centered ([f1eada2](https://github.com/zthun/romulator/commit/f1eada2dd7f9ed106673af111dabdc8d0f7be209))



## [1.14.0](https://github.com/zthun/romulator/compare/v1.13.0...v1.14.0) (2025-10-25)


### Features

* reduce media down to controller, picture, and wheel ([f4fdb85](https://github.com/zthun/romulator/commit/f4fdb8581c7a890653971b6033eb39cb04077d9b))
* system page now renders the media card ([d3a3673](https://github.com/zthun/romulator/commit/d3a3673e78aa731a53c057d67c97a51911cdd888))


### Bug Fixes

* remove the fixed extensions for system media type ([fd8b7b6](https://github.com/zthun/romulator/commit/fd8b7b6a4e0462cab5072ae852c30dab531d7f24))
* remove the steam and audits menu items ([abf4b62](https://github.com/zthun/romulator/commit/abf4b62a56114fa6b9e8f4a5ee50216f3544d3c1))



## [1.13.0](https://github.com/zthun/romulator/compare/v1.12.0...v1.13.0) (2025-10-25)


### Features

* the system builder now normalizes all extensions ([f1d36b5](https://github.com/zthun/romulator/commit/f1d36b5ede80a6b2236906cbec1401b605fc902a))



## [1.12.0](https://github.com/zthun/romulator/compare/v1.11.0...v1.12.0) (2025-10-25)


### Features

* add the system key values to the information card ([3cf7e92](https://github.com/zthun/romulator/commit/3cf7e92edeb45b44c97822b0fc5e5be9da0ec986))
* classification types now support unknown ([d366ba3](https://github.com/zthun/romulator/commit/d366ba32d47cba6d372701e728965a74dda6c2fb))
* system builder can now parse the production years ([6db05a6](https://github.com/zthun/romulator/commit/6db05a68eb0fa4bf3d084a32e939bf57260fcbd3))
* system now parses the classification from systems.json ([3208350](https://github.com/zthun/romulator/commit/3208350e8f47fdc944607f1e0a46622ec9f46537))



## [1.11.0](https://github.com/zthun/romulator/compare/v1.10.0...v1.11.0) (2025-10-25)


### Features

* file repository can now query games from the games folder ([9cd9881](https://github.com/zthun/romulator/commit/9cd98816548b8402b7c5ca1c1542708c37d89f78))
* files repository can now provide the config folders ([60079ea](https://github.com/zthun/romulator/commit/60079ea693ce6c514af24e73036a8584caf8713f))
* game can now parse an unknown object ([b02bd81](https://github.com/zthun/romulator/commit/b02bd81e160b9907fb87ded34a1e5997a880b3a8))
* the games repository returns all games found in the games folder ([659e8bc](https://github.com/zthun/romulator/commit/659e8bc59d0344132a2608c8504311a1c44c68c7))



## [1.10.0](https://github.com/zthun/romulator/compare/v1.9.0...v1.10.0) (2025-10-23)


### Features

* the files system json repository is responsible for reading systems.json and extracting the information ([4bf17c1](https://github.com/zthun/romulator/commit/4bf17c1069bb19eb1cf20b7e8a5cc643de24cfe8))


### Bug Fixes

* systems tiles should now scale to the page ([4c28a81](https://github.com/zthun/romulator/commit/4c28a8188d26f8257ef68839ece6ea2f2fa8d167))



## [1.9.0](https://github.com/zthun/romulator/compare/v1.8.0...v1.9.0) (2025-10-22)


### Features

* a new wheel/marquee is generated when you request media images that do not exist ([e36ab33](https://github.com/zthun/romulator/commit/e36ab33412b77ad0a55c7432ba0f926322e599fa))



## [1.8.0](https://github.com/zthun/romulator/compare/v1.7.1...v1.8.0) (2025-10-22)


### Features

* romulator scrape is the official scraper that retrieves media and info for games + systems ([ebb73eb](https://github.com/zthun/romulator/commit/ebb73eb8b9bd3fbccf6deb7efb06f2e4454660db))
* system builder can now add extensions ([9920831](https://github.com/zthun/romulator/commit/99208319e118993b144aaf82fbb3787348d49938))


### Bug Fixes

* page tiles on systems page should now align the same ([59bfb61](https://github.com/zthun/romulator/commit/59bfb613982e186471ffc257e76028ae75609028))



## [1.7.1](https://github.com/zthun/romulator/compare/v1.7.0...v1.7.1) (2025-10-21)

**Note:** Version bump only for package romulator





## [1.7.0](https://github.com/zthun/romulator/compare/v1.6.0...v1.7.0) (2025-10-21)


### Features

* system builder can now redact rogue properties ([eadba62](https://github.com/zthun/romulator/commit/eadba6256fe9186a2e2d0f071450a335e782b64b))
* you can now get individual systems, media, and info out of the files service ([5068c7e](https://github.com/zthun/romulator/commit/5068c7ee0992a45e90c1f4f6238cdf2e3aedd781))



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
