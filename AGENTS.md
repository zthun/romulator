# Project Overview

Romulator is a management system. You can think of this project as a companion
to something like EmulationStation Desktop Edition; the main difference is its
primary purpose is to manage the media and metadata of games and systems.

## Development environment commands

- Use `yarn install` to initialize the project.
- Use `docker compose up` to run both the frontend and backend together.
- Use `yarn test` to run unit tests. Code coverage should be as close to 100%.
- Use `yarn lint` to run janitor-lint - a multi linter written by @zthun that
  runs eslint, prettier, cspell, markdownlint, and html-hint.
- Use `yarn check` to run a tsc build to check types.
- Use `yarn build` to build the project.

## Frameworks

- Use React for the frontend.
- Use NestJS for the backend.
- There is no database - the file system is used instead.
- Use @zthun/fashion-boutique for generating UI components.

## Testing

- Tests for UI should implement a component model and use @zthun/cirque-du-react
  and @zthun/cirque.
- Unit test coverage should be as close to 100% as you can get. Over 95% is
  acceptable.

## Coding Standards

- Never import from a bucket such as index.mts.
- Imports should always be relative within the same package.
- Imports across packages, even in the same repository should always assume
  they're in node_modules.
