// The slide carousel: chips, arrows, swiping (native scroll snapping), and the height of the visible slide.
import { $ } from "./dom.js";
import { saveState, state } from "./state.js";
import { renderNearSlides } from "./render/tiles.js";

const panels = () => $("panels");
const slides = () => [...panels().children];

/** Fits the carousel to the visible slide (slides differ in height). */
export const fitHeight = () => {
  const slide = slides()[state.slide];
  if (slide) panels().style.height = `${slide.offsetHeight}px`;
};

/** Called whenever the visible slide changed. */
function onSlide() {
  saveState();
  renderNearSlides();
  requestAnimationFrame(fitHeight);
  $("chips")
    .querySelectorAll(".chip")
    .forEach((chip, i) => chip.setAttribute("aria-selected", i === state.slide));
  $("prev").disabled = state.slide === 0;
  $("next").disabled = state.slide === slides().length - 1;
}

export function goSlide(i) {
  state.slide = Math.max(0, Math.min(slides().length - 1, i));
  panels().scrollTo({ left: slides()[state.slide].offsetLeft - panels().offsetLeft });
  onSlide();
}

export function initCarousel() {
  let timer;
  panels().addEventListener("scroll", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.slide = Math.round(panels().scrollLeft / (panels().clientWidth + 16));
      onSlide();
    }, 80);
  });
  if (state.slide > 0) goSlide(state.slide);
  else onSlide();
}
