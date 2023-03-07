"use strict";

///////////////////////////////////////
// Modal window

const header = document.querySelector(".header");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");

const openModal = function (e) {
  // prevents page from jumping to the top
  e.preventDefault();

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);

// Replaced top for loop with more modern forEach() method
btnsOpenModal.forEach(function (btn) {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// prepend a cookie message and button to the beginning of the header section
const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML =
  "We use cookies for improved funtionality and analytics. Thanks for understanding. <button class='btn btn--close-cookie'>Got it!</button>";
header.append(message);

// remove "message" node when ".btn--close-cookie" button is clicked
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
  });

// setting styles of "message" node
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

// manipulating the height style of the "message" node using getComputedStyle()
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + "px";

// Smooth scrolling in "Learn more button"

btnScrollTo.addEventListener("click", function (e) {
  // Scrolling with a "smooth" animation

  // More modern smooth scroll functionlity and much more concise involves using scrollIntoView() where we also pass in an object but only specify the behavior as "smooth". This only works in modern browsers.
  section1.scrollIntoView({ behavior: "smooth" });
});

// Smooth scrolling in each navigation link (features, Operations, Testimonials) using the concept of "Event Delegation" or "Event Bubbling". We will add the event listener only to the COMMON PARENT element of all the navigation links.

// 1. Add event listener to common parent element
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // 2. Determine what element originated the event (e.target)

  // Check if e.target (the element we clicked) contains the class "nav__link". This ensures that clicking in between the nav links does not return an error.
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Tabbed component

// selecting all tabs
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

// using event delegation on common parent element of the tabs buttons and content
tabsContainer.addEventListener("click", function (e) {
  // make sure target of element is always the tab (button, text, and span element) by getting the closest parent element with the  ".operations__tab" class
  const clicked = e.target.closest(".operations__tab");

  // if statement that will return early and breakout of the function if we click in the operations tab container but not on the buttons themselves, yielding no error ---- this is called a Guard Clause (More Modern)
  if (!clicked) return;

  // remove "opeartons__tab--active" class on all the tab buttons
  tabs.forEach((btn) => btn.classList.remove("operations__tab--active"));

  // add "operations__tab--active" class to clicked tab
  clicked.classList.add("operations__tab--active");

  // Display content of clicked tab button

  /* 
  1. get the "data-tab" attribute of clicked tab button (remember when an attibute has "data" in front, we must use "dataset" and then the word(s) after it)

  2. remove "operations__content--active" class on all the tab's content

  3. add the "operations__content--active" class to the clicked tab's content
  */

  tabsContent.forEach((content) =>
    content.classList.remove("operations__content--active")
  );

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

/*
Menu fade animation: 

Here, we implement the hover effect over the navigation links. Hovering over a nav link grays out all the other links, "Open Account" Button, as well as the logo using Event Delegation!
*/

// get the parent element of the logo, links, and "Open Account" button, which is the element with ".nav" class
const nav = document.querySelector(".nav");

const handleHover = function (e) {
  // because of the bind() function, the "this" keyword in this function refers to the opacity (because that is the value that we are passing in through the bind() function). We could even take out the "opacity" parameter in this function and it would still work because of the bind() method's redefining of "this" keyword

  // check if target is actually a nav link
  if (e.target.classList.contains("nav__link")) {
    const navLink = e.target;

    //select sibling elements of nav link by first getting the overall parent (.nav) using closest() and then get all the "navLink"'s siblings using querySelector()
    const siblings = navLink.closest(".nav").querySelectorAll(".nav__link");

    // get the logo by first traversing to find the common parent element of the nav link and then selecting any img elements (we could have directly selected the logo by its class name, but for practice did not)
    const logo = navLink.closest(".nav").querySelector("img");

    // change opacity (gray out) of each sibling NOT INCLUDING the nav link itself, hence if statement
    siblings.forEach((link) => {
      if (link !== navLink) {
        // link.style.opacity = opacity;
        link.style.opacity = this;
      }
    });
    // logo.style.opacity = opacity;
    logo.style.opacity = this;
  }
};

// We can use the bind() function to pass in arguments into the exported call back function of the event listener. Recall that the bind() function allows us to set the "this" keyword on a function or method with whatever value we pass in and also returns a new function
nav.addEventListener("mouseover", handleHover.bind(0.5)); // sets "this" to 0.5 in the handHover() function

nav.addEventListener("mouseout", handleHover.bind(1)); // sets "this" to 1 in the handHover() function

const obsCallBack = function (entries, observer) {
  //entries.forEach((entry) => console.log(entry));
  console.log(entries);
};

// --------- Intersection Observer API with the Header section as the target element ----------- //

// select header section
const headerSection = document.querySelector(".header");

// use the "getBoundingClientRect()" function to get the height property of the nav bar from the resulting object (90px)
const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(
  function (entries) {
    // gets first element out of "entries" array using destructuring. Also there is only going to be one element or entry in the array anyway since we only have 1 threshold value.
    const [entry] = entries;

    /*
    The IntersectionObserverEntry has a boolean property called "isIntersecting" which lets us know whether target element and root are intersecting. When we leave the header section, it has a threshold of 0% which will trigger the call back function, but the header section is NOT INTERSECTING with the viewport (not visible in the viewport), which means that the "isIntersecting" property will be "false". This is when we want the nav bar to become sticky (position: fixed).

    However, as we scroll up, we enter the header section (threshold of 0%) and the section intersects with the viewport (its visible in the viewport), thus the "isIntersecting" property will be set to "true". This is when we want the nav bar to NOT become sticky.
    */
    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
  },
  // IntersectionObserver object (threshold is 0 because we want call back function to fire when 0% of the header section is visible in the viewport). The call back function will fire when the header section enters or leaves the viewport.
  {
    root: null,
    threshold: 0,
    /*
    The "rootMargin" property applies a set amount of pixels around the target element (headerSection) kinda like a margin. It basically increases or decreases the intersection point or size of the target element by a certain amount, causing the call back function to fire when the "headerSection + some value" point is reached.

    However, we want a more dynamic, responsive way of getting the height of the nav bar, so let's use the "getBoundingClientRect()" function

    Note: Only pixels unit work. NEGATIVE values decrease the target element's box size margin, while positive values increase it. A negative value will pull in the margin, while a positive value will increase it. 90px is the height of the nav bar.
    */
    // rootMargin: "-90px",

    // pulling the margin of the target element (header Section) by however many pixels the height of the nav bar is (90px)
    rootMargin: `-${navHeight}px`,
  }
);

// "headerObserver" object will observe the "headerSection" element
headerObserver.observe(headerSection);

// ---------- Revealing Elements in Each Section on Scroll using IntersectionObserver API --------- //

// Add "section--hidden" class to each section, causing them to be invisible (opacity of 0) and move them 8rem down (translateY(8rem)). Then when we remove this class, the sections will become visible and "slide up" when translateY becomes 0 ------- We will use JS to both add and remove the "section--hidden" class

// get all sections
const allSection = document.querySelectorAll(".section");

// call back function
const revealSection = function (entries, observer) {
  // gets first (and only) entry from the "entries" array
  const [entry] = entries;

  // we use a Guard Clause here to return early if the section is not intersecting the viewport.
  if (!entry.isIntersecting) return;

  // We use the "target" property on the "IntersectionObserverEntry" object to remove() the "section--hidden" class of that specific section only
  entry.target.classList.remove("section--hidden");

  // to prevent the sections from being endlessly observed after they have been initially observed and logged to the console with numerous IntersectionObserverEntries, we can unobserve() them in the call back section. To do this we attach the unobserve() function to the original observer object (which can also be passed into the call back function as the 2nd paramter) ------- Helps with performance!
  observer.unobserve(entry.target);
};

// we are going to observe all the 4 section using the same observer object
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(function (section) {
  // add "section--hidden" class to each section
  section.classList.add("section--hidden");

  // call observe() method in call back function of forEach() as we loop over all the sections in "allsection"
  sectionObserver.observe(section);
});

// ---------- Lazy Loading Images ---------- //

// selecting all images that have the attribute "data-src"
const imgTargets = document.querySelectorAll("img[data-src]");

// call back function of observer object
const loadImg = function (entries, observer) {
  // get first entry
  const [entry] = entries;

  // Guard Clause
  if (!entry.isIntersecting) return;

  // replace "src" image with "data-src" image
  entry.target.src = entry.target.dataset.src;

  /*
  Although we can immediately use "classList.remove()" to remove the "lazy-img" class to remove the blur filter, it is horrible for performance on slow connections!

  Therefore, we want use to the "load" event to load the blurry image to avoid any performance issues, so that the class is only removed once the image itself has loaded into the window.
  */
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  // unobserve images once they have been loaded - again for performance
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,

  // image loads (blur filter is removed) 4 pixels before we reach them
  rootMargin: "4px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

// ------------ Testimonial Slider Component ------------ //

/*
Each slide is next to each other on the right side initially. The slides move to the right and left sides, while the main slide is displayed in the center. (Turn off "overflow: hidden" to see this in action)
*/

const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

// starts at first slide
let currentSlide = 0;

// max slide is the third slide
const maxSlide = 2;

// move slide function
const moveSlide = function (curSlide) {
  slides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${100 * (index - curSlide)}%)`)
  );
};

// next slide function
const nextSlide = function () {
  // if current slide is the last slide, then go back to the first slide
  if (currentSlide === maxSlide) {
    currentSlide = 0;
  } else {
    // increase current slide
    currentSlide++;
  }

  moveSlide(currentSlide);
  activeDot(currentSlide);
};

// previous slide function
const prevSlide = function () {
  // if current slide is the first slide, then go to the last slide
  if (currentSlide === 0) {
    currentSlide = maxSlide;
  } else {
    currentSlide--;
  }
  moveSlide(currentSlide);
  activeDot(currentSlide);
};

// right button functionality -- refactored
btnRight.addEventListener("click", nextSlide);

// left button functionality
btnLeft.addEventListener("click", prevSlide);

// --------- Adding keyboard events for Slider ---------- //

// left and right arrow keys to move slides
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();

  // using short circuiting instead if statement
  // e.iey === "ArrowLeft" && prevSlide();
  // e.key === "ArrowRight" && nextSlide();
});

// --------------- Dot Implementation ---------------- //

const dotContainer = document.querySelector(".dots");

// createDots function
const createDots = function () {
  // using _ because of we don't need to use the "slide" element, only need the index
  slides.forEach(function (_, index) {
    // adds a button with "dots__dot" class styles after the last child of "dots" element
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

// add event listener to common parent element of dots (dotContainer) and use event delegation
dotContainer.addEventListener("click", function (e) {
  // the only target we want are the dots themselves in the parent container, not the space between or around them
  if (e.target.classList.contains("dots__dot")) {
    // get the "slide" value from "data-slide" attribute of each "dot" element
    moveSlide(e.target.dataset.slide);
    activeDot(e.target.dataset.slide);
  }
});

// changes color of current slide dot
const activeDot = function (slide) {
  // remove active color from all dots by removing the "dots__dot--active" class
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  // select the dot with "dots__dot" class that has the "data-slide" attribute of the current slide, and add the "dots__dot--active" class to it
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

// initialization function
const init = function () {
  // starts at slide 0, moves all other slides to the right;
  moveSlide(0);
  createDots();
  // starts with the first dot as the active dot
  activeDot(0);
};

init();
