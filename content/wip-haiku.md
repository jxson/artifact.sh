= yaml =
title: Yet Another Refactor
date: 2013-12-12
draft: true
= yaml =

# Preamble

I have been working on `haiku` for far too long for it to be in it's current condition. It has literally gotten to the point where I am coding static site generators in my dreams as if it's a normal thing to do; like going to school naked, or waking up late for work only to wake up late again. Anyways, I decided to approach this current refactor a little  differently. I am going to write here about how it should work then code it up until it's possible to make that thing happen and get this post online. This process will be nice for a couple of reasons: it will serve as initial drafts for future documentation as well as direct and focus my attention. 

I am going to start with the configuring the CLI since that is the thing that most people would interface with first.

# haiku config

I want `haiku` to do a very simple thing: compile a directory of [mustached][mustache] markdown and some additional templates into a directory of static html. I would like the `haiku` command to run from any directory to make automation a little bit easier (this becomes important for [CD systems][continious-deployment]). From a configuration point of view that means there are about five settings that are important:

* `src`: The source of the project or site, defaults to process.cwd()
* `content-dir`: the content directory where the markdown content lives. Defaults to the cwd + '/content'
* `build-dir`: where the compiled site will be saved to. Defaults to the cwd + '/build'
* `templates-dir`: layouts and additional templates go here, Defaults to the cwd + '/templates'
* `public-dir`: static content that does not need to be compiled can be saved, will get merged into the build directory at compile time. Defaults to the cwd + '/public'

The defaults seem pretty sane to me and haven't changed much for the 20 or so sites I have build with earlier versions of `haiku` but ya'll like some crazy stuff so I figure it cant hurt to make these things configurable.

# Via The CLI

While all the options will be configurable via CLI flags I am also exposing a sub command to saving config options similar to the `git config` command. So like git, haiku will stash the settings in an [ini file] to be recalled later. I am thinking something like:

		haiku config [set|get] [option]

So if you want to change the name of the `public` directory to "static" you could do:

		haiku config set public-dir static

And then the `haiku config get public dir` would say something like:

		haiku config get public-dir

It's late and Im on vacation so thats as far as I am gonna get for now...

[mustache]: #
[continious-deployment]: #
[ini]: #

