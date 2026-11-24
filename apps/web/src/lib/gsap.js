import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin)

gsap.defaults({ ease: "power3.out", duration: 0.9 })

export { gsap, ScrollTrigger, SplitText, MotionPathPlugin }
