# Shining

A presentation framework to be used with Webkit. Yeah, it's all in-browser.

# Installation

    $ sudo gem install shining

# How to use

Create a new presentation by

    $ shine mypreso
    
Where "mypreso" is the directory name you'll use for it. A base presentation has the
following base structure.

* ROOT
  * config.json
  * slides
  * index.html
  
Which leads us to...

# Configuration

Presentation-wide configuration happens through the **config.json** file. Existing
parameters are:

* slides: an array containing the name of the presentation's slides. If you're using
the generator to add slides, don't worry about editing it.
* transitions: See next section.

# Transitions

Transitions take effect when you navigate back or forward your slides. Valid options are:

* "fade": Fades slides out/in.
* "slide": Slides them horizontally.
* "slice": Cool horizontal slicing effect.
* false: Setting to false disables transitions altogether.

For anything not false, make sure you're passing a proper string.

# Slides

Easy way first. Change the directory to the presentation's directory first. Then

    $ shine slide mynewslide
    
Where "mynewslide" is the name of the slide. This will create a slide in
**ROOT/slides/mynewslide.html**, and a slide script in **ROOT/slides/mynewslide.js**.
It will also automagically edit the **config.json** file for you, adding the new slide.

You can also create slides manually by adding an HTML file to **ROOT/slides**, and then
adding the file name (minus the extension) to **config.json**. Though really, just use 
the generator.

# Slide templates

Shining supports Haml and ERb templates. For now, you can use it by manually dropping
a template file or either of those formats in **ROOT/slides**, and then running (from
inside the presentation's directory)

    $ shine compile
    
Say you have a slide template named **ROOT/slides/test.haml**. Running the aforementioned
command will generate a new **test.html** from it. Note that this will _overwrite_ an
existing **test.html** slide if one exists.

# Slide scripts

Slides can have an associated script which you can use to trigger certain actions
(e.g.: effects) at a predetermined time. If you used the generator to create a slide,
you'll notice a .js file got created along with it. That's the script we're talking
about. So for instance, say you have 2 hidden paragraphs in your slide, and you intent 
to show one after another. Open that .js file and do

    1, $('p:first').effect('fades-in')
    3, $('p:eq(1)').effect('fades-in')
    
The above translates to: 1 second into this slide, fade in the first
paragraph. 3 seconds in, fade in the second paragraph.

This is handy if you want to schedule things you'd like to see happening at certain
stages during a presentation.

# Steps to winning

Quickly outline of things I'm going to do with this project:

* More effects, because there's no such thing as visually appealing enough. Some
fine tuning of the existing ones is in order as well.
* More themes.
* Add a CSS parser, so I can build jQuery queues with the effects and order them
without the end-user needing to make sure things happen when they expect.
* Better generators. For now the requirements are simple enough so they can stay
as a single file, but I'm confident that will change.
* Better DSL for slide scripts. I know it's awesome already, but there's always
room for improvement.
* Macros, or configurable shortcuts for adding things like audio and video
without having to know how to use the tags.
* Did I say I wanna add macros, so you'll need to know next to zero HTML in order
to create *really* awesome presentations?

# License

The MIT License

Copyright (c) 2010 Julio Cesar Ody.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.