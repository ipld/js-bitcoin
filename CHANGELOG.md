### [1.0.1](https://github.com/ipld/js-bitcoin/compare/v1.0.0...v1.0.1) (2022-04-26)


### Bug Fixes

* publish as public ([54ad017](https://github.com/ipld/js-bitcoin/commit/54ad01787aef3078e67bf45cf8453669c408c5bd))

## 1.0.0 (2022-04-26)


### ⚠ BREAKING CHANGES

* huge upgrade (Uint8Array, ESM, multiformats@9, etc.)
* **package:** Returned v1 CIDs now default to base32 encoding

Previous versions returned a base58 encoded string when `toString()`/
`toBaseEncodedString()` was called on a CIDv1. It now returns a base32
encoded string.
* The API is now async/await based

There are numerous changes, the most significant one is that the API
is no longer callback based, but it using async/await.

For the full new API please see the [IPLD Formats spec].

[IPLD Formats spec]: https://github.com/ipld/interface-ipld-format

### Features

* add defaultHashAlg ([#17](https://github.com/ipld/js-bitcoin/issues/17)) ([6e28d3e](https://github.com/ipld/js-bitcoin/commit/6e28d3e6f52d2d436cee81fbdfc8f1f58a2e1b12))
* Add resolve() method ([25cef82](https://github.com/ipld/js-bitcoin/commit/25cef8217c1e95949e037f807dc8b2c80037d796))
* Add tree() method ([685889d](https://github.com/ipld/js-bitcoin/commit/685889d195e4362eea6d226ea155255d3d77f39c))
* add util.cid options ([#18](https://github.com/ipld/js-bitcoin/issues/18)) ([eab262f](https://github.com/ipld/js-bitcoin/commit/eab262fc101cab90f90c32af959ff2d0fde3687f))
* encode full merkle (wit & segwit), encode/decode witness commitment ([f001c27](https://github.com/ipld/js-bitcoin/commit/f001c276c0a55c9304b993eb778c41beb6cfbcb0))
* huge upgrade (Uint8Array, ESM, multiformats@9, etc.) ([bd04fb0](https://github.com/ipld/js-bitcoin/commit/bd04fb0717d74a1c11ccb8afc4b5b8e0ebf549f7))
* implement & test new interfaces against new multiformats ([710ee74](https://github.com/ipld/js-bitcoin/commit/710ee7434f0fa06f56976263b916f871ef2481de))
* initial commit ([525d003](https://github.com/ipld/js-bitcoin/commit/525d0036bbae01838a8e58b670ee35e1e74da4fb))
* new IPLD Format API ([1a799aa](https://github.com/ipld/js-bitcoin/commit/1a799aa322320f55e1f5086af400e278ee579d71))
* switch to bitcoin-block for encode/decode ([3d3827d](https://github.com/ipld/js-bitcoin/commit/3d3827dbfa0dc5b64a92d53e779b78275c611436))
* types, basic docs, example ([3e1ab8b](https://github.com/ipld/js-bitcoin/commit/3e1ab8b33605006f5da5b2db7d9e5734e4c80b8b))


### Bug Fixes

* add browser testing ([3242e54](https://github.com/ipld/js-bitcoin/commit/3242e54c0b90c49e9d93a597819b4f7e655ed086))
* add missing async dependency ([c070fdf](https://github.com/ipld/js-bitcoin/commit/c070fdf9729afecf66e6f864a598804020e8fca5))
* add proper error handling for util API ([dacb7b1](https://github.com/ipld/js-bitcoin/commit/dacb7b1eef24f7a90e25dbc715dfc082261bcb8c))
* bad CIDs, add `tx` link in vin's that have txid ([040f54e](https://github.com/ipld/js-bitcoin/commit/040f54eb2a6e2d76532e77648fab8071fbc486f0))
* do not ignore cid.options ([#20](https://github.com/ipld/js-bitcoin/issues/20)) ([177ddc5](https://github.com/ipld/js-bitcoin/commit/177ddc5a41504d2902db242381b1223f08449809))
* export `multicodec` property ([8e6ec75](https://github.com/ipld/js-bitcoin/commit/8e6ec75e7ae85eaaddb9858cc7338291ac33520e))
* move dirty-chai to dev dependencies ([3805fc1](https://github.com/ipld/js-bitcoin/commit/3805fc15a3786432133fc5d79d4362c583c705f6))
* **package:** update bitcoinjs-lib to version 4.0.2 ([64cde6c](https://github.com/ipld/js-bitcoin/commit/64cde6cf1e4125eb5bc4e3bdd89a47c5bfc6ee5d))
* **package:** update bitcoinjs-lib to version 5.0.0 ([ef99508](https://github.com/ipld/js-bitcoin/commit/ef99508c7188e5a9c14df1ad3dfda35470568e08))
* **package:** update cids to version 0.6.0 ([cd36640](https://github.com/ipld/js-bitcoin/commit/cd36640b6d263d11f6e3e8ef5cd5ab72c0aef2cc))
* **package:** update cids to version 0.7.0 ([6b2745e](https://github.com/ipld/js-bitcoin/commit/6b2745e01f9350060539f0e7f2c80279a04bef2e))
* **package:** update cids to version 0.8.0 ([bf67862](https://github.com/ipld/js-bitcoin/commit/bf6786242335352663ab47b7efb783ce0d57c108))
* **package:** update multicodec to version 1.0.0 ([fb8226e](https://github.com/ipld/js-bitcoin/commit/fb8226ee00cd3f3bee18b113f2379611bf696f26))
* **package:** update multihashing-async to version 0.6.0 ([9dc7bb7](https://github.com/ipld/js-bitcoin/commit/9dc7bb700c5ef8baad702709478a5ba6001c43e4))
* **package:** update multihashing-async to version 0.8.0 ([5ef0714](https://github.com/ipld/js-bitcoin/commit/5ef07140813d781893db269c0cbfa69a721caaf3))
* path never start with a slash ([d790c9b](https://github.com/ipld/js-bitcoin/commit/d790c9b5b1de329e1eb9d0097c54240abbb3be97))
* remove git-validate as a dependency ([84d0ffc](https://github.com/ipld/js-bitcoin/commit/84d0ffce1a78566951375b3900c54aae8b7e9bcd))
* replace license files with proper text ([ae62fc2](https://github.com/ipld/js-bitcoin/commit/ae62fc20babf647c48926f2e8e3b583229fca688))
* **tests:** Aegir changed fixture API ([c7e6c79](https://github.com/ipld/js-bitcoin/commit/c7e6c79027d653dd3cd15f1102e1bd3f25efde36))
* the option in tree() is called `values` ([568c075](https://github.com/ipld/js-bitcoin/commit/568c075cbced1e398e84f4e4fe27dfa04a83e603))
* update & fix for bitcoin-block, address CAR test timing problems ([8f321a7](https://github.com/ipld/js-bitcoin/commit/8f321a7c6b30e97c542d5a35bc86772bf30a5c7f))
* use block headers only ([ef05359](https://github.com/ipld/js-bitcoin/commit/ef0535960f0bc641aeff900ff77e2338b751880a))
* use multihasing-async [#14](https://github.com/ipld/js-bitcoin/issues/14) ([#19](https://github.com/ipld/js-bitcoin/issues/19)) ([77354ac](https://github.com/ipld/js-bitcoin/commit/77354ac7a3464d98db89bf0bc575b85265a36c32))


### Tests

* add more tests ([60f134a](https://github.com/ipld/js-bitcoin/commit/60f134af27e4c371519611c943855c1d89b9e6f2))
* Add tests for invalid blocks ([3234a1b](https://github.com/ipld/js-bitcoin/commit/3234a1b98c661a6a078f28e59da77b283a1e40c7))


### Trivial Changes

* add better contributing guidelines ([5925a48](https://github.com/ipld/js-bitcoin/commit/5925a48f1fb3e13eeeb1641598fc161c9fffe25a))
* Add inline API documentation ([14bcedc](https://github.com/ipld/js-bitcoin/commit/14bcedca0b6340f44aa8514c8b5395d2a8ca21f7))
* add module Lead Maintainer ([847be51](https://github.com/ipld/js-bitcoin/commit/847be51f26d9c8f773ed94b4c4ae39159e0f456a))
* add pre-push hooks ([a924bfb](https://github.com/ipld/js-bitcoin/commit/a924bfb10ca36807ace5a8d2ae707f08073cea73))
* clarify README a bit ([4fdaf5d](https://github.com/ipld/js-bitcoin/commit/4fdaf5dbbda2f45b388fd4dc315990b7efa83f76))
* dependabot & auto-release ([3a635fb](https://github.com/ipld/js-bitcoin/commit/3a635fb59087cb26edd2dd8dfecd0bf1bec9a7f6))
* enable Travis for CI ([80da208](https://github.com/ipld/js-bitcoin/commit/80da2086114f89ddc5f6049631efa45c7dd97c1a))
* lots more docs ([7ba0bcc](https://github.com/ipld/js-bitcoin/commit/7ba0bcccae9e3ccac2938c16bac3c01eb34fb7fb))
* **package:** update aegir to version 17.0.1 ([2bf087d](https://github.com/ipld/js-bitcoin/commit/2bf087dae70572b65c99c36dfb920937b199ceda)), closes [#30](https://github.com/ipld/js-bitcoin/issues/30)
* **package:** update aegir to version 17.1.0 ([e65c47a](https://github.com/ipld/js-bitcoin/commit/e65c47a45a9ea35d624ddf74794d3175f67f936a))
* **package:** update aegir to version 18.0.2 ([3238bcf](https://github.com/ipld/js-bitcoin/commit/3238bcf7b2f9ed1e22df1132011dcd419f5b8002)), closes [#39](https://github.com/ipld/js-bitcoin/issues/39)
* **package:** update aegir to version 18.2.0 ([d7d8e4f](https://github.com/ipld/js-bitcoin/commit/d7d8e4f10f758c4b5ccdf7958775d6742947f8bf))
* **package:** update aegir to version 19.0.3 ([cac365c](https://github.com/ipld/js-bitcoin/commit/cac365c4c4d3ee473db5e2a82ecea54cb5ec6ff7)), closes [#50](https://github.com/ipld/js-bitcoin/issues/50)
* **package:** update aegir to version 20.0.0 ([bb2ff5a](https://github.com/ipld/js-bitcoin/commit/bb2ff5a54bfb3f3158aa893933435b6178d81aa4))
* **package:** update aegir to version 21.0.1 ([23e4ff2](https://github.com/ipld/js-bitcoin/commit/23e4ff2f507fa896709bba18015cf92fc35146ad)), closes [#56](https://github.com/ipld/js-bitcoin/issues/56)
* **package:** update dependencies ([0202834](https://github.com/ipld/js-bitcoin/commit/02028346a947b125b59329884b94cf85f1f788de))
* **readme:** add Greenkeeper badge ([58e411e](https://github.com/ipld/js-bitcoin/commit/58e411e87e9925215ca4b269a2e2493e09617d45))
* release version v0.1.1 ([fae9a11](https://github.com/ipld/js-bitcoin/commit/fae9a111c908cf393ef766de0230bf5c2a8f756e))
* release version v0.1.2 ([d4ef53e](https://github.com/ipld/js-bitcoin/commit/d4ef53e9c7506428af7cfa6dee9ec582135d12ba))
* release version v0.1.3 ([3b6ffc9](https://github.com/ipld/js-bitcoin/commit/3b6ffc9d119dffca59f5f2d96753d3747ddc8621))
* release version v0.1.4 ([c64c58f](https://github.com/ipld/js-bitcoin/commit/c64c58f3aab52a298c0403086841ca23768886d5))
* release version v0.1.5 ([b409026](https://github.com/ipld/js-bitcoin/commit/b409026ef9ea3cbeaef7beb69bb8947066360df7))
* release version v0.1.6 ([3ce5f66](https://github.com/ipld/js-bitcoin/commit/3ce5f6626f95c58b1a5b75cbd3a9de4460f2e6bc))
* release version v0.1.7 ([b75bb64](https://github.com/ipld/js-bitcoin/commit/b75bb649a930d2149bb722b46a6eb6bf0fbdd4f8))
* release version v0.1.8 ([29390e7](https://github.com/ipld/js-bitcoin/commit/29390e778c49df4bc8bbd73164473ab2c928c2ff))
* release version v0.1.9 ([4b897a7](https://github.com/ipld/js-bitcoin/commit/4b897a77f5b5842c2e488367a649ad075f8f5847))
* release version v0.2.0 ([9bdb211](https://github.com/ipld/js-bitcoin/commit/9bdb211f0becf83e544f913049fef4a7276189d7))
* release version v0.3.0 ([21b034f](https://github.com/ipld/js-bitcoin/commit/21b034f326f6afdff3e46952f673cdd696e434a7))
* release version v0.3.1 ([b5a0288](https://github.com/ipld/js-bitcoin/commit/b5a02884849296b7847025d7c08212f1772ce802))
* remove CI files ([da57e42](https://github.com/ipld/js-bitcoin/commit/da57e420dc9dad6712e3e673a244936b72c61142))
* remove pre-push ([96188e5](https://github.com/ipld/js-bitcoin/commit/96188e5139adf3063652ef3053dd36a242f35f3d))
* rm coverage run from travis ([e38b1f4](https://github.com/ipld/js-bitcoin/commit/e38b1f43fe774e448eb871508fdaccb5a28bf676))
* send coverage report to coveralls ([c2220c5](https://github.com/ipld/js-bitcoin/commit/c2220c5faa48369d1ca508265bd4eb34f5719dcc))
* update contributors ([5cefa55](https://github.com/ipld/js-bitcoin/commit/5cefa5521dbb5f5e3f7ea7a92ef885bcfeed59ea))
* update contributors ([7c29f67](https://github.com/ipld/js-bitcoin/commit/7c29f672a90f930823ee9e36e6161a667ab5847e))
* update contributors ([bfecd6b](https://github.com/ipld/js-bitcoin/commit/bfecd6b29a34df43e5a31e472ef9c1e5ebbcdc1a))
* update contributors ([15665c4](https://github.com/ipld/js-bitcoin/commit/15665c4d0d2f7dac3d5b1ee2c631e3fcacf6f146))
* update contributors ([11993ab](https://github.com/ipld/js-bitcoin/commit/11993ab0674fe17e142400bea52c283aacb5c3df))
* update contributors ([4cbec3c](https://github.com/ipld/js-bitcoin/commit/4cbec3c7ac3826a6124f242cc4bf2557fc140de2))
* update contributors ([4f68d15](https://github.com/ipld/js-bitcoin/commit/4f68d15955d135a06dcdad7dc7c571a3cd6bd937))
* update contributors ([e084d21](https://github.com/ipld/js-bitcoin/commit/e084d213439d002da2d34545d641423c722f9bcc))
* update contributors ([11e79ad](https://github.com/ipld/js-bitcoin/commit/11e79ad42539947f57aa644d413b5974c2d5c55d))
* update contributors ([07fc747](https://github.com/ipld/js-bitcoin/commit/07fc747e404a16976bf8549cbd88c93c65da2be9))
* update contributors ([8ddf7d0](https://github.com/ipld/js-bitcoin/commit/8ddf7d04250c49422e00da4cbe4d59730563736e))
* update contributors ([c30a18b](https://github.com/ipld/js-bitcoin/commit/c30a18ba34aa0f3f38a2599a4fa26d0373a8f673))
* update dependencies ([c628468](https://github.com/ipld/js-bitcoin/commit/c6284684a33941a29e0524ae080519318182b309))
* update dependencies ([34bed43](https://github.com/ipld/js-bitcoin/commit/34bed43a3521bb33ad1d8c5ebd0ad94931e1b8bf))
* upgrade Aegir to 12.4.0 ([f91da35](https://github.com/ipld/js-bitcoin/commit/f91da35acc0c57fd0223ea773332c40b30a17c93))
* use correct URL for the repository ([92290b7](https://github.com/ipld/js-bitcoin/commit/92290b79c8d1d08b685ac9deda068ed993c319bc))
