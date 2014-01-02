Fractal Fun
===

I made this "fractal generator" using the HTML5 Canvas tag and some fancy
javascript. I've just been having fun with it and checking out the crazy images
that are produced. I've only really been testing this out on Google Chrome, so
If you want to check it out, i suggest you use Chrome. However, everything
appears to be working on other browsers as well with the exception of the fancy
HTML5 form elements at the top.

There are two sliders which define the two constants that get added during the
calculations which alter the results. I recently added the ability to switch
between several pre-defined functions which produce different patterns, as well
as some really simple zoom and pan functionality. The system uses jQuery BBQ to
handle the url hashing which makes it so you can save your favorite
configurations or send the url to someone and they will see the same image (more
or less).

I also experimented with getting the rendering process to utilize web-workers.
It took quite a while to get it working and unfortunately when i finally got it
working it actually performs quite poorly as compared to a simple iterative
process. I think i could get better performance out of the scheme if i broke the
job into equal parts and just provide each worker with a chunk of data to work
on rather than trying to assign one task at a time (actually one pixel at a
time). This would probably simplify the code a fair amount as well. Perhaps i'll
do that sometime in the future.


How it works
---

The "resolution" variable defines the height and width of the canvas (it's
square for simplicity's sake). The canvas is stretched to the window's
dimensions using CSS.

The fractal image appears between -2 and 2 (for whatever reason), and so i take
the x and y position of each pixel and basically shrink the values into a [-2,
2] space so that i can feed them into the fractal function and actually be able
to see something, this is also where i can apply a little trickery to apply zoom
and pan effects.

Then comes the fun part: I'm not really a math whiz [yet], so i can't really
tell you why this works, so i'll just describe how the code works. The fractal
function is recursive, the basic idea is that it keeps running this mathematical
function on the x and y values until the function "breaks out" (described
later). The basic function i'm using is labeled "Squared" which can be described
as such:

*Z = Z<sup>2</sup> + C*

The catch here is that Z is a complex number (numbers using the "imaginary unit"
i), such a number would look like this:

*a+bi*

The nifty thing is that we can plot these complex number using a standard
euclidean plane (just x and y values) by simply plotting the values (a,b) as
(x,y) on the graph. Now that we know Z is a complex number, we need to define
how to square such a number. I was able to derive this one by hand just using
the simple FOIL method taught in high-school algebra. So if you replaced Z with
a+bi you would get something looking like this:

*(a+bi)<sup>2</sup> = (a+bi)(a+bi) = a<sup>2</sup>+abi+abi+b<sup>2</sup>i<sup>2</sup>*

We know that i2 is -1 and so the last term becomes -b2 and the middle two become
2abi such that the final formula looks like this:

*a<sup>2</sup>-b<sup>2</sup>+2abi*

The nice thing to notice about this that there is only one term with i attached,
this allows us to think of it like this:

*x=a<sup>2</sup>-b<sup>2</sup>*
*y=2ab*

At this point I began implementing various trigonometric functions that could
operate on complex numbers (i didn't do the derivations myself). They ended up
using hyperbolic trig functions which Javascript does not natively provide, so i
needed to look up implementations of those as well. The last part to consider is
the "break out" condition i mentioned earlier, the trick is basically checking
for when the absolute value of Z is greater than 2. The actual implementation of
this looks much less simple. As it turns out the absolute value of a complex
number looks like this:

*sqrt(a<sup>2</sup>+b<sup>2</sup>) > 2*

We can save a step by squaring both sides of the equation. This gets rid of the
square root function since 2 squared is just a constant. This simplifies the
equation making the code run a little faster.
