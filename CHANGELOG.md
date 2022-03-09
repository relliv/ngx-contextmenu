# CHANGELOG

## [Unreleased]

### BREAKING CHANGES

- Remove Bootstrap dependency in favor of CSS variables based theming
- Remove contextMenuActions as it is not a building block of a `contextMenu`
- Remove `IContextMenuOptions`, `CONTEXT_MENU_OPTIONS`
- Remove unneeded `ContextMenuModule#forRoot` method and `autofocus` options
- Replace all reference to `any` type
- Rename interfaces and class properties for more consistency across the codebase

### Added

- Support for rtl contextmenu
- Better ARIA support
- context menu items are now typed with by [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)


### Fixed

- Fix opening submenu with the keyboard would not always properly position it next to its parent menu

## 7.0.0 - 2022-02-07

- Create tests and add code coverage

## 7.0.0-alpha.0 - (2022-01-20)

### BREAKING CHANGES

- **Dependency**: Require Angular 13

## 6.0.0 - 2022-02-03

- Improve README
- Setup github workflows

## 6.0.0-alpha.1 - 2022-02-03

- Setup the CI

## 6.0.0-alpha.0 - 2022-01-20

- Project forked from <https://github.com/isaacplmann/ngx-contextmenu>
