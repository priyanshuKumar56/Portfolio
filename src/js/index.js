import LocomotiveScroll from "locomotive-scroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copyText } from "./utils/index";
import { mapEach } from "./utils/dom";

gsap.registerPlugin(ScrollTrigger);

const scrollEl = document.querySelector("[data-scroll-container]");
const toContactButtons = document.querySelectorAll(".contact-scroll");
const footer = document.getElementById("js-footer");
const emailButton = document.querySelector("button.email");
const toCopyText = document.querySelector(".to-copy span");

const scroll = new LocomotiveScroll({
  el: scrollEl,
  smooth: true,
  lerp: 0.06,
  tablet: {
    breakpoint: 768,
  },
});

setTimeout(() => {
  scroll.update();
}, 1000);

scroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(scroll.el, {
  scrollTop(value) {
    return arguments.length
      ? scroll.scrollTo(value, 0, 0)
      : scroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
});

ScrollTrigger.addEventListener("refresh", () => scroll.update());
ScrollTrigger.refresh();

export default class Home {
  constructor(scroll) {
    this.locomotive = scroll;
    this.heroTextAnimation();
    this.homeIntro();
    this.homeAnimations();
    this.homeActions();
    this.initProjectHoverEffects();
  }

  homeActions() {
    mapEach(toContactButtons, (button) => {
      button.onclick = () => {
        this.locomotive.scrollTo(footer);
      };
    });

    emailButton.addEventListener("click", (e) => {
      copyText(e);
      toCopyText.textContent = "copied";

      setTimeout(() => {
        toCopyText.textContent = "Click To Copy";
      }, 2000);
    });
  }

  homeIntro() {
    const tl = gsap.timeline();

    gsap.to(scrollEl, {
      autoAlpha: 1,
    });

    tl.from(".home__nav", {
      duration: 0.5,
      delay: 0.3,
      opacity: 0,
      yPercent: -100,
      ease: "power4.out",
    })
      .from(".hero__title [title-overflow]", {
        duration: 0.7,
        yPercent: 100,
        stagger: {
          amount: 0.2,
        },
        ease: "power4.out",
      })
      .from(
        ".hero__title .bottom__right",
        {
          duration: 1,
          yPercent: 100,
          opacity: 0,
          ease: "power4.out",
        },
        "<20%"
      )
      .set(".hero__title .overflow", { overflow: "unset" })
      .from(
        ".hero__title .mobile",
        {
          duration: 0.7,
          yPercent: 100,
          stagger: {
            amount: 0.2,
          },
          ease: "power4.out",
        },
        "-=1.4"
      );
  }

  homeAnimations() {
    const $shape = document.querySelectorAll(".title-cover");
    const $text = document.querySelectorAll(".title-text");

    $shape.forEach((cover, index) => {
      gsap.to(cover, {
        duration: 0.9,
        scaleX: 0,
        transformOrigin: "left",
        delay: index * 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cover,
          scroller: "[data-scroll-container]",
          start: "top 80%",
          end: "top 60%",
          scrub: true,
        },
        onComplete: () => {
          gsap.to($text[index], {
            duration: 0.9,
            y: 0,
            ease: "power2.out",
          });
        },
      });
    });

    gsap.utils.toArray(".home__projects__line").forEach((el) => {
      const line = el.querySelector("span");
      gsap.from(line, {
        duration: 1.5,
        scrollTrigger: {
          trigger: el,
          scroller: "[data-scroll-container]",
        },
        scaleX: 0,
      });
    });

    gsap.utils.toArray("[data-fade-in]").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          scroller: "[data-scroll-container]",
        },
        duration: 1.5,
        yPercent: 100,
        opacity: 0,
        ease: "power4.out",
      });
    });

    if (window.innerWidth <= 768) {
      gsap.utils.toArray(".home__projects__project").forEach((el) => {
        const text = el.querySelector(".title__main");
        const link = el.querySelector(".project__link");
        gsap.from([text, link], {
          scrollTrigger: {
            trigger: el,
            scroller: "[data-scroll-container]",
          },
          duration: 1.5,
          yPercent: 100,
          stagger: {
            amount: 0.2,
          },
          ease: "power4.out",
        });
      });

      const awardsTl = gsap.timeline({
        defaults: {
          ease: "power1.out",
        },
        scrollTrigger: {
          trigger: ".home__awards",
          scroller: "[data-scroll-container]",
        },
      });
      awardsTl.from(".awards__title span", {
        duration: 1,
        opacity: 0,
        yPercent: 100,
        stagger: {
          amount: 0.2,
        },
      });
    }
  }

  heroTextAnimation() {
    gsap.to(".hero__title__dash.desktop", {
      scrollTrigger: {
        trigger: ".hero__title",
        scroller: "[data-scroll-container]",
        scrub: true,
        start: "-8% 9%",
        end: "110% 20%",
      },
      scaleX: 4,
      ease: "none",
    });
  }

  initProjectHoverEffects() {
    const projects = document.querySelectorAll(".home__projects__project");

    projects.forEach((project) => {
      const imageContainer = project.querySelector(".project__image-container");
      const title = project.querySelector(".home__projects__project__title");

      title.addEventListener("mouseenter", () => {
        gsap.to(imageContainer, {
          duration: 0.3,
          opacity: 1,
          transform: "translateY(0)",
        });
      });

      title.addEventListener("mouseleave", () => {
        gsap.to(imageContainer, {
          duration: 0.3,
          opacity: 0,
          transform: "translateY(-20px)",
        });
      });

      title.addEventListener("mousemove", (e) => {
        const rect = project.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        gsap.to(imageContainer, {
          duration: 0.3,
          x: offsetX - imageContainer.clientWidth / 2,
          y: offsetY - imageContainer.clientHeight / 2,
        });
      });
    });
  }
}

new Home(scroll);
