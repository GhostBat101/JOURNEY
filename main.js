/**
 * JOURNEY — Primary Choreography & Interaction Controller
 * Orchestrates Lenis smooth scroll, GSAP ScrollTriggers, Matter.js physics, canvas film grain, and custom cursor; interfaces with DOM and vendor libraries.
 */

let lenisInstance = null;
let grainContext = null;
let grainWidth = 0;
let grainHeight = 0;
let grainImageData = null;
let grainFrameId = null;
let isReducedMotion = false;

let cursorEl = null;
let cursorDotEl = null;
let quickCursorX = null;
let quickCursorY = null;
let quickDotX = null;
let quickDotY = null;

let siteHeader = null;
let scrollProgressBar = null;
let heroContainer = null;
let heroStage = null;
let heroBgImg = null;
let heroWords = [];
let ticker1El = null;
let ticker2El = null;

let coastalContainer = null;
let coastalWrap = null;
let coastalWipePanel = null;
let coastWipeImg = null;

let storiesContainer = null;
let horizontalStage = null;
let horizontalTrack = null;

let roadPerspContainer = null;
let roadPerspWrap = null;
let perspCenterLine = null;
let perspCardLeft = null;
let perspCardRight = null;
let perspHeading = null;

let placesSection = null;
let placeCards = [];
let routeLine1 = null;
let routeLine2 = null;

let lookbookScroll = null;
let isDraggingLookbook = false;
let lookbookStartX = 0;
let lookbookScrollLeft = 0;

let physicsContainer = null;
let physicsCanvas = null;
let physicsEngine = null;
let physicsRender = null;
let physicsRunner = null;

let journalSection = null;
let journalRows = [];
let finalWrap = null;
let finalStage = null;
let finalBg = null;
let finalContentBox = null;
let finalGiantWordmark = null;

function cacheDomElements() {
  siteHeader = document.getElementById("site-header");
  scrollProgressBar = document.getElementById("scroll-progress");
  cursorEl = document.getElementById("custom-cursor");
  cursorDotEl = document.getElementById("custom-cursor-dot");

  heroContainer = document.getElementById("hero-scroll-container");
  heroStage = document.getElementById("hero-pinned-stage");
  heroBgImg = document.getElementById("hero-bg-img");
  heroWords = Array.from(document.querySelectorAll("#hero-main-title .masked-word"));

  ticker1El = document.getElementById("ticker-1");
  ticker2El = document.getElementById("ticker-2");

  coastalContainer = document.getElementById("coastal-dispatch");
  coastalWrap = document.getElementById("coastal-pinned-wrap");
  coastalWipePanel = document.getElementById("coastal-wipe-panel");
  coastWipeImg = document.getElementById("coast-wipe-img");

  storiesContainer = document.getElementById("stories-pin");
  horizontalStage = document.getElementById("horizontal-stage");
  horizontalTrack = document.getElementById("horizontal-track");

  roadPerspContainer = document.getElementById("road-perspective");
  roadPerspWrap = document.getElementById("road-persp-wrap");
  perspCenterLine = document.getElementById("persp-center-line");
  perspCardLeft = document.getElementById("persp-card-left");
  perspCardRight = document.getElementById("persp-card-right");
  perspHeading = document.getElementById("persp-heading");

  placesSection = document.getElementById("places");
  placeCards = Array.from(document.querySelectorAll(".place-card"));
  routeLine1 = document.getElementById("route-line-1");
  routeLine2 = document.getElementById("route-line-2");

  lookbookScroll = document.getElementById("lookbook-scroll");

  physicsContainer = document.getElementById("physics-canvas-container");
  physicsCanvas = document.getElementById("physics-canvas");

  journalSection = document.getElementById("journal");
  journalRows = Array.from(document.querySelectorAll(".journal-row"));

  finalWrap = document.getElementById("final-cinematic-wrap");
  finalStage = document.getElementById("final-cinematic-stage");
  finalBg = document.getElementById("final-cinematic-bg");
  finalContentBox = document.getElementById("final-content-box");
  finalGiantWordmark = document.getElementById("final-giant-wordmark");
}

function initLenis() {
  if (isReducedMotion) return;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.6
  });

  lenisInstance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

function initFilmGrain() {
  const canvas = document.getElementById("film-grain");
  if (!canvas) return;

  grainContext = canvas.getContext("2d", { willReadFrequently: true });
  if (!grainContext) return;

  function resizeGrain() {
    grainWidth = Math.floor(window.innerWidth / 2.5);
    grainHeight = Math.floor(window.innerHeight / 2.5);
    canvas.width = grainWidth;
    canvas.height = grainHeight;
    grainImageData = grainContext.createImageData(grainWidth, grainHeight);
  }

  resizeGrain();
  window.addEventListener("resize", resizeGrain);

  let frameCount = 0;
  function renderGrain() {
    frameCount++;
    if (frameCount % 2 === 0 && grainImageData) {
      const buffer32 = new Uint32Array(grainImageData.data.buffer);
      const totalPixels = buffer32.length;
      for (let i = 0; i < totalPixels; i++) {
        if (Math.random() < 0.14) {
          const gray = (Math.random() * 255) | 0;
          buffer32[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
        } else {
          buffer32[i] = 0;
        }
      }
      grainContext.putImageData(grainImageData, 0, 0);
    }
    grainFrameId = requestAnimationFrame(renderGrain);
  }

  renderGrain();
}

function initCustomCursor() {
  if (!cursorEl || !cursorDotEl || window.matchMedia("(pointer: coarse)").matches) return;

  quickCursorX = gsap.quickTo(cursorEl, "x", { duration: 0.2, ease: "power3.out" });
  quickCursorY = gsap.quickTo(cursorEl, "y", { duration: 0.2, ease: "power3.out" });
  quickDotX = gsap.quickTo(cursorDotEl, "x", { duration: 0.04, ease: "none" });
  quickDotY = gsap.quickTo(cursorDotEl, "y", { duration: 0.04, ease: "none" });

  window.addEventListener("mousemove", (e) => {
    quickCursorX(e.clientX);
    quickCursorY(e.clientY);
    quickDotX(e.clientX);
    quickDotY(e.clientY);
  });

  const interactiveElements = document.querySelectorAll("a, button, .place-card, .lookbook-item, #physics-canvas-container, .journal-row");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursorEl.classList.add("is-hovering"));
    el.addEventListener("mouseleave", () => cursorEl.classList.remove("is-hovering"));
  });

  window.addEventListener("mousedown", () => cursorEl.classList.add("is-drag"));
  window.addEventListener("mouseup", () => cursorEl.classList.remove("is-drag"));
}

function initProgressBar() {
  if (!scrollProgressBar) return;
  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    scrollProgressBar.style.width = `${progress}%`;
  });
}

function initHeroChoreography() {
  if (!heroContainer || !heroStage) return;

  if (heroWords.length > 0) {
    gsap.to(heroWords, {
      y: "0%",
      duration: 1.1,
      stagger: 0.08,
      ease: "power4.out",
      delay: 0.15
    });
  }

  if (isReducedMotion) return;

  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroContainer,
      start: "top top",
      end: "+=80%",
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1
    }
  });

  if (heroBgImg) {
    heroTimeline.fromTo(heroBgImg, { scale: 1.0 }, { scale: 1.18, ease: "none" }, 0);
  }

  const titleEl = document.getElementById("hero-main-title");
  if (titleEl) {
    heroTimeline.to(titleEl, { y: -80, opacity: 0, ease: "power1.in" }, 0.2);
  }

  const subtitleEl = document.getElementById("hero-subtitle");
  if (subtitleEl) {
    heroTimeline.to(subtitleEl, { y: -50, opacity: 0, ease: "power1.in" }, 0.15);
  }
}

function initInterludes() {
  if (ticker1El) {
    gsap.to(ticker1El, {
      xPercent: -35,
      ease: "none",
      scrollTrigger: {
        trigger: "#interlude-1",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6
      }
    });
  }

  if (ticker2El) {
    gsap.to(ticker2El, {
      xPercent: 35,
      ease: "none",
      scrollTrigger: {
        trigger: "#interlude-2",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6
      }
    });
  }
}

function initCoastalDispatch() {
  if (!coastalContainer || !coastalWrap || isReducedMotion) return;

  const coastalTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: coastalContainer,
      start: "top top",
      end: "+=100%",
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1
    }
  });

  if (coastalWipePanel) {
    coastalTimeline.fromTo(coastalWipePanel,
      { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" },
      { clipPath: "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)", ease: "none" },
      0
    );
  }

  if (coastWipeImg) {
    coastalTimeline.fromTo(coastWipeImg, { scale: 1.15 }, { scale: 1.0, ease: "none" }, 0);
  }
}

function initHorizontalStories() {
  if (!storiesContainer || !horizontalStage || !horizontalTrack || isReducedMotion) return;

  function calculateDistance() {
    return Math.max(0, horizontalTrack.scrollWidth - window.innerWidth + 120);
  }

  gsap.to(horizontalTrack, {
    x: () => -calculateDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: storiesContainer,
      start: "top top",
      end: () => "+=" + calculateDistance(),
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });
}

function initPerspectiveRoad() {
  if (!roadPerspContainer || !roadPerspWrap || isReducedMotion) return;

  if (perspCenterLine) {
    gsap.to(perspCenterLine, {
      strokeDashoffset: -200,
      repeat: -1,
      ease: "none",
      duration: 1.2
    });
  }

  const roadTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: roadPerspContainer,
      start: "top top",
      end: "+=120%",
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1
    }
  });

  if (perspCardLeft) {
    roadTimeline.fromTo(perspCardLeft,
      { scale: 0.2, opacity: 0, x: -140, y: 160 },
      { scale: 1.05, opacity: 1, x: 0, y: 0, ease: "power2.out" },
      0.1
    );
    roadTimeline.to(perspCardLeft, {
      scale: 1.3,
      opacity: 0,
      x: -180,
      y: 70,
      ease: "power2.in"
    }, 0.5);
  }

  if (perspCardRight) {
    roadTimeline.fromTo(perspCardRight,
      { scale: 0.2, opacity: 0, x: 140, y: -140 },
      { scale: 1.05, opacity: 1, x: 0, y: 0, ease: "power2.out" },
      0.35
    );
    roadTimeline.to(perspCardRight, {
      scale: 1.3,
      opacity: 0,
      x: 180,
      y: -60,
      ease: "power2.in"
    }, 0.75);
  }

  if (perspHeading) {
    roadTimeline.fromTo(perspHeading,
      { scale: 0.94, y: 20 },
      { scale: 1.06, y: -10, ease: "none" },
      0.15
    );
  }
}

function initTopographyMap() {
  if (routeLine1) {
    gsap.fromTo(routeLine1,
      { strokeDashoffset: 400 },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: placesSection,
          start: "top 75%",
          end: "bottom 80%",
          scrub: 1
        }
      }
    );
  }

  if (routeLine2) {
    gsap.fromTo(routeLine2,
      { strokeDashoffset: -400 },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: placesSection,
          start: "top 75%",
          end: "bottom 80%",
          scrub: 1
        }
      }
    );
  }

  placeCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const route = card.getAttribute("data-route");
      if (route === "coast" && routeLine1) {
        routeLine1.setAttribute("stroke", "#1062b8");
        routeLine1.setAttribute("stroke-width", "4");
      } else if (route === "southwest" && routeLine2) {
        routeLine2.setAttribute("stroke", "#a23e18");
        routeLine2.setAttribute("stroke-width", "4");
        routeLine2.setAttribute("opacity", "1");
      }
    });

    card.addEventListener("mouseleave", () => {
      if (routeLine1) {
        routeLine1.setAttribute("stroke", "#1062b8");
        routeLine1.setAttribute("stroke-width", "2.5");
      }
      if (routeLine2) {
        routeLine2.setAttribute("stroke", "#a23e18");
        routeLine2.setAttribute("stroke-width", "2");
        routeLine2.setAttribute("opacity", "0.6");
      }
    });
  });
}

function initLookbookDraggable() {
  if (!lookbookScroll) return;

  lookbookScroll.addEventListener("mousedown", (e) => {
    isDraggingLookbook = true;
    lookbookStartX = e.pageX - lookbookScroll.offsetLeft;
    lookbookScrollLeft = lookbookScroll.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDraggingLookbook = false;
  });

  lookbookScroll.addEventListener("mousemove", (e) => {
    if (!isDraggingLookbook) return;
    e.preventDefault();
    const x = e.pageX - lookbookScroll.offsetLeft;
    const walk = (x - lookbookStartX) * 1.8;
    lookbookScroll.scrollLeft = lookbookScrollLeft - walk;
  });
}

function initPhysicsSandbox() {
  if (!physicsContainer || !physicsCanvas || typeof Matter === "undefined") return;

  const width = physicsContainer.clientWidth || 1200;
  const height = physicsContainer.clientHeight || 380;

  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const Runner = Matter.Runner;
  const Bodies = Matter.Bodies;
  const Composite = Matter.Composite;
  const Mouse = Matter.Mouse;
  const MouseConstraint = Matter.MouseConstraint;

  physicsEngine = Engine.create({ gravity: { x: 0, y: 0.9, scale: 0.001 } });
  const world = physicsEngine.world;

  physicsRender = Render.create({
    canvas: physicsCanvas,
    engine: physicsEngine,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: "#242521",
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
    }
  });

  Render.run(physicsRender);
  physicsRunner = Runner.create();
  Runner.run(physicsRunner, physicsEngine);

  const wallThickness = 80;
  const wallOptions = { isStatic: true, render: { visible: false } };
  const ground = Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, wallOptions);
  const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, wallOptions);
  const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, wallOptions);

  Composite.add(world, [ground, leftWall, rightWall]);

  const tagBigSur = Bodies.rectangle(width * 0.22, 60, 180, 50, {
    chamfer: { radius: 10 },
    restitution: 0.45,
    friction: 0.3,
    render: {
      fillStyle: "#1062b8",
      strokeStyle: "#ffffff",
      lineWidth: 2
    }
  });

  const tagLonePine = Bodies.rectangle(width * 0.42, 30, 200, 55, {
    chamfer: { radius: 8 },
    restitution: 0.4,
    friction: 0.35,
    render: {
      fillStyle: "#121311",
      strokeStyle: "#fe8357",
      lineWidth: 2
    }
  });

  const stampRoute66 = Bodies.circle(width * 0.6, 80, 42, {
    restitution: 0.55,
    friction: 0.25,
    render: {
      fillStyle: "#a23e18",
      strokeStyle: "#fbf9f4",
      lineWidth: 2.5
    }
  });

  const badgePacific = Bodies.rectangle(width * 0.78, 40, 160, 52, {
    chamfer: { radius: 12 },
    restitution: 0.5,
    friction: 0.3,
    render: {
      fillStyle: "#30312e",
      strokeStyle: "#a8c8ff",
      lineWidth: 2
    }
  });

  const dinerMatchbook = Bodies.rectangle(width * 0.5, -40, 130, 70, {
    chamfer: { radius: 4 },
    restitution: 0.35,
    friction: 0.4,
    render: {
      fillStyle: "#fbf9f4",
      strokeStyle: "#1062b8",
      lineWidth: 2
    }
  });

  Composite.add(world, [tagBigSur, tagLonePine, stampRoute66, badgePacific, dinerMatchbook]);

  const mouse = Mouse.create(physicsCanvas);
  const mouseConstraint = MouseConstraint.create(physicsEngine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });

  Composite.add(world, mouseConstraint);
  physicsRender.mouse = mouse;

  Matter.Events.on(physicsRender, "afterRender", () => {
    const ctx = physicsRender.context;
    ctx.font = "bold 13px 'Anton', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.save();
    ctx.translate(tagBigSur.position.x, tagBigSur.position.y);
    ctx.rotate(tagBigSur.angle);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("BIG SUR // HWY 1", 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(tagLonePine.position.x, tagLonePine.position.y);
    ctx.rotate(tagLonePine.angle);
    ctx.fillStyle = "#fe8357";
    ctx.fillText("LONE PINE MOTEL #07", 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(stampRoute66.position.x, stampRoute66.position.y);
    ctx.rotate(stampRoute66.angle);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("ROUTE 66", 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(badgePacific.position.x, badgePacific.position.y);
    ctx.rotate(badgePacific.angle);
    ctx.fillStyle = "#d0e0ff";
    ctx.fillText("PACIFIC CREST", 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(dinerMatchbook.position.x, dinerMatchbook.position.y);
    ctx.rotate(dinerMatchbook.angle);
    ctx.fillStyle = "#1062b8";
    ctx.fillText("NEON DINER", 0, 0);
    ctx.restore();
  });
}

function initJournalAndOutro() {
  if (journalRows.length > 0) {
    gsap.from(journalRows, {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: journalSection,
        start: "top 80%"
      }
    });
  }

  if (!finalWrap || !finalStage || isReducedMotion) return;

  const finalTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: finalWrap,
      start: "top top",
      end: "+=80%",
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1
    }
  });

  if (finalBg) {
    finalTimeline.fromTo(finalBg,
      { scale: 1.0, opacity: 0.5 },
      { scale: 1.22, opacity: 0.9, ease: "none" },
      0
    );
  }

  if (finalContentBox) {
    finalTimeline.fromTo(finalContentBox,
      { y: 60, opacity: 0.7 },
      { y: -30, opacity: 1, ease: "none" },
      0
    );
  }

  if (finalGiantWordmark) {
    finalTimeline.fromTo(finalGiantWordmark,
      { scale: 0.85, opacity: 0.08, y: 50 },
      { scale: 1.12, opacity: 0.35, y: -20, ease: "none" },
      0.1
    );
  }
}

function bootstrapApp() {
  isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.registerPlugin(ScrollTrigger);

  cacheDomElements();
  initLenis();
  initFilmGrain();
  initCustomCursor();
  initProgressBar();
  initHeroChoreography();
  initInterludes();
  initCoastalDispatch();
  initHorizontalStories();
  initPerspectiveRoad();
  initTopographyMap();
  initLookbookDraggable();
  initPhysicsSandbox();
  initJournalAndOutro();

  ScrollTrigger.refresh();
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
}

window.addEventListener("DOMContentLoaded", bootstrapApp);
