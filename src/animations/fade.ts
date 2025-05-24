import { animate, stagger } from "animejs"

// Fade in animation
export const fadeIn = (element: HTMLElement, delay = 0, duration = 800) => {
  return animate(element, {
    opacity: [0, 1],
    translateY: [20, 0],
    ease: "outExpo",
    duration,
    delay,
  })
}

// Fade out animation
export const fadeOut = (element: HTMLElement, delay = 0, duration = 500) => {
  return animate(element, {
    opacity: [1, 0],
    translateY: [0, 20],
    ease: "inExpo",
    duration,
    delay,
  })
}

// Staggered fade in for multiple elements
export const staggerFadeIn = (elements: HTMLElement[], staggerDelay = 100, duration = 800) => {
  return animate(elements, {
    opacity: [0, 1],
    translateY: [20, 0],
    ease: "outExpo",
    duration,
    delay: stagger(staggerDelay),
  })
}

// Pulse animation
export const pulse = (element: HTMLElement, scale = [1, 1.05], duration = 1000) => {
  return animate(element, {
    scale: scale,
    ease: "inOutSine",
    duration,
    loop: true,
    alternate: true,
  })
}
