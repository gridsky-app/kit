<p align="center">
  <img width="160" height="160" src="https://avatars.githubusercontent.com/u/189930701?s=160&v=4" />
</p>
<h1 align="center">Gridsky Social</h1>
<p align="center">
Gridsky isn’t just another client — it’s a fresh, customizable, and visually immersive way to experience the social web on the ATmosphere. Inspired by the aesthetics and usability of popular platforms, Gridsky brings a refined, user-friendly interface to Bluesky enriched by vibrant colors and other goodies to make you shine.
</p>
<p align="center">
<a href="https://bsky.app/profile/gridsky.app" style="margin: 0 4px;"><img alt="Bluesky" src="https://img.shields.io/badge/Bluesky-0285FF?logo=Bluesky&logoColor=white" /></a>
<a href="https://discord.gg/bPfgdDbj87" style="margin: 0 4px;"><img alt="Discord" src="https://img.shields.io/badge/Discord-5865F2?logo=Discord&logoColor=white" /></a>
<a href="https://github.com/gridsky-app/client" style="margin: 0 4px;"><img alt="GitHub" src="https://img.shields.io/github/stars/gridsky-app/client" /></a>
</p>

## About

<a href="https://gridsky.social">
  <img
    src="https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:jyrbp7bijccauz4eo5iuwbz5/bafkreihbziugsu2u7her4d6mw3tv5b5qo3st2wpjhzh6gd6hndiycnyvay@jpeg"
    alt="Gridsky, like Instagram on Bluesky. Supercharged"
  />
</a>

<br />
<br />

**gridsky-app/kit** is a monorepo playground for the Core and UI libraries of Gridsky.

The code is shared to support collaboration and transparency as the project evolves. While the official client won't be open source in the traditional sense, the license allows for contributions and involvement — just not wholesale cloning or rebranding. The more the community engages, the more open it may become.

[**Demo**](https://gridsky.app) · [**Lifetime Perks**](https://patreon.com/join/gridsky)

## Contributing

The main Gridsky App isn't open source yet — we're working on a compact version called Gridsky Pocket, designed to help fund development while focusing on the core libraries and essential features which will be available under the MIT license. Gridsky Pocket will be released under the Gridsky Community License.

```bash
# fork these two repositories

# https://github.com/gridsky-app/kit
# (name it "gridsky-playground")

# https://github.com/gridsky-app/pocket
# (leave it "pocket")

# clone your gridsky kit fork 
git clone git@github.com:<username>/gridsky-playground.git

# enter the directory you just cloned
cd gridsky-playground

# clone your gridsky pocket fork into /apps/pocket
git clone git@github.com:<username>/pocket.git /apps/pocket

# install dependencies
pnpm install

# start the pocket client
nx run pocket:serve
```

If you’d like to contribute to Gridsky, please join our [Discord](https://discord.gg/bPfgdDbj87) server — that’s where all discussions, feedback, and coordination happen. The project is being developed using TypeScript and the Vue.js ecosystem.

## Sponsoring

As we're getting started, early funding will be incredibly valuable in helping us grow faster.

## Supporting

Our main source of income will be from profile customizations and you will unlock lifetime perks once a certain contribution threshold is reached. Currently, you can support us through [Patreon](https://www.patreon.com/join/gridsky).

You're free to donate as much as you want, whenever you want. Even just $1 a month would keep us motivated, improving the app and enabling new integrations that directly benefit your experience.

> Once you reach 96 Æ, you'll unlock all current and future perks.  
> Æ stands for aesthetics. As you might guess, 1 Æ equals 1 USD

## License

`@gridsky/core` and `@gridsky/ui` packages are released under the [MIT License](LICENSE).
