import { MotionProvider as e } from "./motion.js";
import { AnimatePresence as t, LayoutGroup as n, Reorder as r, animate as i, m as a, useAnimationFrame as o, useDragControls as s, useInView as c, useMotionValue as l, useMotionValueEvent as u, useReducedMotion as d, useScroll as f, useSpring as p, useTransform as m } from "motion/react";
import { useCallback as h, useEffect as g, useId as _, useMemo as v, useRef as y, useState as b } from "react";
import { Fragment as x, jsx as S, jsxs as C } from "react/jsx-runtime";
import { createPortal as w, flushSync as T } from "react-dom";
import { assignInlineVars as E } from "@vanilla-extract/dynamic";
// src/lib/cx.ts
function D(...e) {
	return e.filter(Boolean).join(" ");
}
// src/accordion/accordion.css.ts
var O = "_1rvf35c0", k = "_1rvf35c1", A = "_1rvf35c2", j = "_1rvf35c3";
// src/accordion/accordion.tsx
function M({ items: e, multiple: r = !1, duration: i = .3, className: o, itemClassName: s, triggerClassName: c, panelClassName: l }) {
	let u = _(), f = d(), [p, m] = b([]), h = {
		duration: f ? 0 : i,
		ease: [
			.22,
			1,
			.36,
			1
		]
	};
	function g(e) {
		m((t) => t.includes(e) ? t.filter((t) => t !== e) : r ? [...t, e] : [e]);
	}
	return /* @__PURE__ */ S(n, {
		id: u,
		children: /* @__PURE__ */ S("div", {
			className: D(O, o),
			children: e.map((e) => {
				let n = p.includes(e.id), r = `${u}-${e.id}-panel`, i = `${u}-${e.id}-trigger`;
				return /* @__PURE__ */ C(a.div, {
					layout: !f && "position",
					transition: h,
					className: D(k, s),
					children: [/* @__PURE__ */ S("h3", {
						className: A,
						children: /* @__PURE__ */ C("button", {
							type: "button",
							id: i,
							"aria-expanded": n,
							"aria-controls": r,
							className: D(j, c),
							onClick: () => g(e.id),
							children: [/* @__PURE__ */ S("span", { children: e.title }), /* @__PURE__ */ S(a.svg, {
								viewBox: "0 0 16 16",
								width: "16",
								height: "16",
								"aria-hidden": !0,
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "1.75",
								strokeLinecap: "round",
								animate: { rotate: n ? 45 : 0 },
								transition: h,
								children: /* @__PURE__ */ S("path", { d: "M8 3v10M3 8h10" })
							})]
						})
					}), /* @__PURE__ */ S(t, {
						initial: !1,
						mode: "popLayout",
						children: n && /* @__PURE__ */ S(a.section, {
							id: r,
							"aria-labelledby": i,
							className: D("_1rvf35c4", l),
							initial: {
								opacity: 0,
								y: f ? 0 : -6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: {
								opacity: 0,
								transition: { duration: 0 }
							},
							transition: h,
							children: e.content
						})
					})]
				}, e.id);
			})
		})
	});
}
// src/analog-clock/analog-clock.css.ts
var N = "vg0cmh0", P = "vg0cmh1", F = "vg0cmh2", I = "vg0cmh3", L = "vg0cmh4", R = "vg0cmh5", z = "vg0cmh7", B = 90;
function V(e, t) {
	let n = t ? e.getMilliseconds() / 1e3 : 0, r = e.getHours() * 3600 + e.getMinutes() * 60 + e.getSeconds() + n;
	return {
		hour: r / 120 % 720,
		minute: r / 10,
		second: r * 6
	};
}
function H({ smooth: e = !1, secondHand: t = !0, size: n = 200, label: r = "Analog clock", className: a }) {
	let s = d(), [c] = b(() => V(/* @__PURE__ */ new Date(), e)), u = l(c.hour), f = l(c.minute), p = l(c.second);
	return o(() => {
		if (!e) return;
		let t = V(/* @__PURE__ */ new Date(), !0);
		u.set(t.hour), f.set(t.minute), p.set(t.second);
	}), g(() => {
		if (e) return;
		let t = setInterval(() => {
			let e = V(/* @__PURE__ */ new Date(), !1);
			u.set(e.hour), f.set(e.minute), s ? p.set(e.second) : i(p, e.second, {
				type: "spring",
				stiffness: 700,
				damping: 18
			});
		}, 1e3);
		return () => clearInterval(t);
	}, [
		e,
		s,
		u,
		f,
		p
	]), /* @__PURE__ */ C("svg", {
		className: D(N, a),
		width: n,
		height: n,
		viewBox: "-100 -100 200 200",
		role: "img",
		"aria-label": r,
		children: [
			/* @__PURE__ */ S("circle", {
				className: P,
				r: B
			}),
			Array.from({ length: 60 }, (e, t) => {
				let n = t % 5 == 0;
				return /* @__PURE__ */ S("line", {
					className: n ? F : I,
					y1: -90 + (n ? 12 : 6),
					y2: -88,
					transform: `rotate(${t * 6})`
				}, t);
			}),
			/* @__PURE__ */ S(U, {
				angle: u,
				length: 46,
				className: L
			}),
			/* @__PURE__ */ S(U, {
				angle: f,
				length: 68,
				className: R
			}),
			t && /* @__PURE__ */ S(U, {
				angle: p,
				length: 76,
				tail: 16,
				className: "vg0cmh6"
			}),
			/* @__PURE__ */ S("circle", {
				className: z,
				r: 3.5
			})
		]
	});
}
function U({ angle: e, length: t, tail: n = 0, className: r }) {
	let i = y(null);
	return u(e, "change", (e) => i.current?.setAttribute("transform", `rotate(${e})`)), /* @__PURE__ */ S("g", {
		ref: i,
		transform: `rotate(${e.get()})`,
		children: /* @__PURE__ */ S("line", {
			className: r,
			y1: n,
			y2: -t
		})
	});
}
// src/command-palette/command-palette.css.ts
var W = "_165a7d20", ee = "_165a7d21", te = "_165a7d29", ne = "_165a7d2b", G = "_165a7d2e";
// src/command-palette/command-palette.tsx
function re(e, t) {
	let n = [], r = e.toLowerCase();
	for (let e = r.indexOf(t); e !== -1; e = r.indexOf(t, e + t.length)) n.push([e, e + t.length]);
	return n;
}
var K = (e, t) => {
	let n = t.toLowerCase().split(/\s+/).filter(Boolean);
	if (n.length === 0) return {};
	let r = [
		e.label,
		e.hint ?? "",
		...e.keywords ?? []
	].join(" ").toLowerCase();
	if (!n.every((e) => r.includes(e))) return null;
	let i = e.label.toLowerCase(), a = t.trim().toLowerCase(), o = i.startsWith(a) ? 3 : RegExp(`(^|\\s)${a.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(i) ? 2 : +!!i.includes(a);
	return {
		ranges: n.flatMap((t) => re(e.label, t)),
		score: o
	};
};
function ie(e) {
	let t = [...e].filter(([e, t]) => t > e).toSorted((e, t) => e[0] - t[0]), n = [];
	for (let [e, r] of t) {
		let t = n.at(-1);
		t && e <= t[1] ? t[1] = Math.max(t[1], r) : n.push([e, r]);
	}
	return n;
}
function ae(e, t, n) {
	if (!t?.length) return e;
	let r = [], i = 0;
	for (let [a, o] of ie(t)) a > i && r.push(e.slice(i, a)), r.push(/* @__PURE__ */ S("mark", {
		className: D(G, n),
		children: e.slice(a, o)
	}, a)), i = o;
	return i < e.length && r.push(e.slice(i)), r;
}
var q = (e) => e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey) && !e.altKey;
function oe({ commands: e, onRun: n, trigger: r, label: i = "Command palette", placeholder: o = "Type a command", emptyLabel: s = "No matching commands", match: c = K, markClassName: l, hotkey: u = "global", contained: f = !0, className: p, panelClassName: m }) {
	let h = _(), x = d(), [T, E] = b(!1), [O, k] = b(""), [A, j] = b(0), M = y(null), N = y(null), { sections: P, hits: F } = v(() => {
		let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
		for (let r of e) {
			let e = c(r, O);
			e && (t.set(r, e), n.set(r.group, [...n.get(r.group) ?? [], r]));
		}
		return {
			sections: [...n].map(([e, n]) => ({
				group: e,
				items: n.toSorted((e, n) => (t.get(n)?.score ?? 0) - (t.get(e)?.score ?? 0))
			})),
			hits: t
		};
	}, [
		e,
		O,
		c
	]), I = v(() => P.flatMap((e) => e.items), [P]), L = I[Math.min(A, I.length - 1)];
	function R() {
		k(""), j(0), E(!0);
	}
	function z(e) {
		E(!1), e && M.current?.focus({ preventScroll: !0 });
	}
	let B = y({
		show: R,
		hide: z
	});
	g(() => {
		B.current = {
			show: R,
			hide: z
		};
	});
	let V = (e) => f || typeof document > "u" ? e : w(/* @__PURE__ */ S("div", {
		className: D(W, p),
		children: e
	}), document.body);
	function H(e) {
		z(!0), n(e);
	}
	g(() => {
		if (u !== "global") return;
		let e = (e) => {
			q(e) && !e.defaultPrevented && (e.preventDefault(), B.current.show());
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [u]), g(() => {
		if (!T) return;
		let e = (e) => {
			e.key === "Escape" && N.current?.contains(document.activeElement) && (e.stopImmediatePropagation(), B.current.hide(!0));
		};
		return window.addEventListener("keydown", e, { capture: !0 }), () => window.removeEventListener("keydown", e, { capture: !0 });
	}, [T]), g(() => {
		L && document.getElementById(`${h}-${L.id}`)?.scrollIntoView({ block: "nearest" });
	}, [L, h]);
	function U(e) {
		let t = e === L;
		return /* @__PURE__ */ C("div", {
			id: `${h}-${e.id}`,
			role: "option",
			tabIndex: -1,
			"aria-selected": t,
			className: te,
			onPointerMove: () => j(I.indexOf(e)),
			onMouseDown: (e) => e.preventDefault(),
			onClick: () => H(e),
			children: [
				t && /* @__PURE__ */ S(a.span, {
					layoutId: `${h}-active`,
					className: "_165a7d2a",
					transition: x ? { duration: 0 } : {
						type: "spring",
						stiffness: 600,
						damping: 40
					}
				}),
				/* @__PURE__ */ S("span", {
					className: ne,
					children: ae(e.label, F.get(e)?.ranges, l)
				}),
				e.hint && /* @__PURE__ */ S("span", {
					className: "_165a7d2c",
					children: e.hint
				})
			]
		}, e.id);
	}
	function G(e) {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			if (e.preventDefault(), I.length === 0) return;
			let t = e.key === "ArrowDown" ? 1 : -1;
			j((e) => (Math.min(e, I.length - 1) + t + I.length) % I.length);
		} else e.key === "Enter" && L && (e.preventDefault(), H(L));
	}
	return /* @__PURE__ */ C("div", {
		className: D(W, p),
		onKeyDown: (e) => {
			u === "focus" && q(e) && (e.preventDefault(), R());
		},
		children: [/* @__PURE__ */ S("button", {
			ref: M,
			type: "button",
			className: ee,
			"aria-haspopup": "dialog",
			"aria-expanded": T,
			onClick: R,
			children: r
		}), V(/* @__PURE__ */ S(t, { children: T && /* @__PURE__ */ C(a.div, {
			className: f ? "_165a7d22" : "_165a7d23 _165a7d22",
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: {
				opacity: 0,
				pointerEvents: "none"
			},
			transition: { duration: x ? 0 : .15 },
			children: [/* @__PURE__ */ S("div", {
				className: "_165a7d24",
				"aria-hidden": !0,
				onClick: () => z(!1)
			}), /* @__PURE__ */ C(a.div, {
				ref: N,
				role: "dialog",
				"aria-label": i,
				className: D("_165a7d25", m),
				initial: !x && {
					scale: .96,
					y: -8
				},
				animate: {
					scale: 1,
					y: 0
				},
				exit: x ? void 0 : {
					scale: .98,
					y: -4
				},
				transition: x ? { duration: 0 } : {
					type: "spring",
					stiffness: 500,
					damping: 36
				},
				onBlur: (e) => {
					e.currentTarget.contains(e.relatedTarget) || z(!1);
				},
				children: [
					/* @__PURE__ */ S("input", {
						autoFocus: !0,
						className: "_165a7d26",
						role: "combobox",
						"aria-label": i,
						"aria-expanded": !0,
						"aria-controls": `${h}-list`,
						"aria-autocomplete": "list",
						"aria-activedescendant": L ? `${h}-${L.id}` : void 0,
						placeholder: o,
						value: O,
						onChange: (e) => {
							k(e.target.value), j(0);
						},
						onKeyDown: G
					}),
					/* @__PURE__ */ S("div", {
						id: `${h}-list`,
						role: "listbox",
						"aria-label": i,
						className: "_165a7d27",
						children: P.map(({ group: e, items: t }, n) => e === void 0 ? t.map(U) : /* @__PURE__ */ C("div", {
							role: "group",
							"aria-labelledby": `${h}-g${n}`,
							children: [/* @__PURE__ */ S("div", {
								id: `${h}-g${n}`,
								role: "presentation",
								className: "_165a7d28",
								children: e
							}), t.map(U)]
						}, e))
					}),
					I.length === 0 && /* @__PURE__ */ S("p", {
						className: "_165a7d2d",
						children: s
					})
				]
			})]
		}) }))]
	});
}
// src/compare-slider/compare-slider.css.ts
var se = "_1xk98l70", J = "_1xk98l71", ce = "_1xk98l72", le = "_1xk98l73", ue = "_1xk98l74", Y = (e) => Math.min(100, Math.max(0, e));
function de({ before: e, after: t, label: n = "Divider position", initial: r = 50, step: i = 5, className: o, handleClassName: s }) {
	let c = d(), u = y(null), [f, h] = b(Y(r)), g = l(f), _ = p(g, {
		stiffness: 700,
		damping: 60
	}), v = c ? g : _, x = m(v, (e) => `inset(0 ${100 - e}% 0 0)`), w = m(v, (e) => `${e}%`);
	function T(e, t) {
		let n = Y(e);
		h(n), g.set(n), t && _.jump(n);
	}
	function E(e) {
		let t = u.current?.getBoundingClientRect();
		t && t.width !== 0 && T((e - t.left) / t.width * 100, !0);
	}
	function O(e) {
		let t = {
			ArrowLeft: f - i,
			ArrowDown: f - i,
			ArrowRight: f + i,
			ArrowUp: f + i,
			PageDown: f - 25,
			PageUp: f + 25,
			Home: 0,
			End: 100
		}[e.key];
		t !== void 0 && (e.preventDefault(), T(t, !1));
	}
	return /* @__PURE__ */ C("div", {
		ref: u,
		className: D(se, o),
		onPointerDown: (e) => {
			e.button === 0 && (e.currentTarget.setPointerCapture(e.pointerId), E(e.clientX));
		},
		onPointerMove: (e) => {
			e.currentTarget.hasPointerCapture(e.pointerId) && E(e.clientX);
		},
		children: [
			/* @__PURE__ */ S("div", {
				className: J,
				children: t
			}),
			/* @__PURE__ */ S(a.div, {
				className: J,
				style: { clipPath: x },
				children: e
			}),
			/* @__PURE__ */ C(a.div, {
				className: ce,
				style: { x: w },
				children: [/* @__PURE__ */ S("span", { className: le }), /* @__PURE__ */ S("div", {
					role: "slider",
					tabIndex: 0,
					"aria-label": n,
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-valuenow": Math.round(f),
					"aria-valuetext": `${Math.round(f)}%`,
					"aria-orientation": "horizontal",
					className: D(ue, s),
					onKeyDown: O,
					children: /* @__PURE__ */ S("svg", {
						viewBox: "0 0 16 16",
						width: "14",
						height: "14",
						"aria-hidden": !0,
						children: /* @__PURE__ */ S("path", {
							d: "M6 4L2 8l4 4M10 4l4 4-4 4",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.75"
						})
					})
				})]
			})
		]
	});
}
// src/count-up/count-up.tsx
function fe({ to: e, from: t = 0, duration: n = 1.6, format: r, locale: o, className: s }) {
	let u = y(null), f = c(u, { once: !0 }), p = d(), h = l(t), _ = v(() => new Intl.NumberFormat(o, {
		maximumFractionDigits: 0,
		...r
	}), [o, r]), b = m(h, (e) => _.format(e));
	return g(() => {
		if (!f) return;
		if (p) {
			h.set(e);
			return;
		}
		let t = i(h, e, {
			duration: n,
			ease: [
				.22,
				1,
				.36,
				1
			]
		});
		return () => t.stop();
	}, [
		f,
		p,
		h,
		e,
		n
	]), /* @__PURE__ */ S(a.span, {
		ref: u,
		className: s,
		children: b
	});
}
// src/cursor-follower/cursor-follower.css.ts
var pe = "var(--zhjiaq0)", me = "zhjiaq1", he = "zhjiaq2";
// src/cursor-follower/cursor-follower.tsx
function ge({ children: e, size: t = 32, stiffness: n = 300, className: r, dotClassName: i }) {
	let o = d(), [s, c] = b(!1), u = {
		stiffness: n,
		damping: 28,
		mass: .6
	}, f = p(l(0), u), m = p(l(0), u);
	function h(e) {
		let t = e.currentTarget.getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
		o || !s ? (f.jump(n), m.jump(r)) : (f.set(n), m.set(r)), c(!0);
	}
	return /* @__PURE__ */ C("div", {
		className: D(me, r),
		style: E({ [pe]: `${t}px` }),
		onPointerMove: h,
		onPointerLeave: () => c(!1),
		children: [e, /* @__PURE__ */ S(a.div, {
			"aria-hidden": !0,
			className: D(he, i),
			style: {
				x: f,
				y: m
			},
			animate: {
				opacity: +!!s,
				scale: s ? 1 : .4
			},
			transition: { duration: .2 }
		})]
	});
}
// src/magnetic-button/magnetic-button.tsx
function _e({ strength: e = .35, style: t, ...n }) {
	let r = d(), i = p(l(0), {
		stiffness: 250,
		damping: 18
	}), o = p(l(0), {
		stiffness: 250,
		damping: 18
	});
	function s(t) {
		if (r) return;
		let n = t.currentTarget.getBoundingClientRect();
		i.set((t.clientX - n.left - n.width / 2) * e), o.set((t.clientY - n.top - n.height / 2) * e);
	}
	function c() {
		i.set(0), o.set(0);
	}
	return /* @__PURE__ */ S(a.button, {
		...n,
		style: {
			...t,
			x: i,
			y: o
		},
		onPointerMove: s,
		onPointerLeave: c,
		whileTap: { scale: .95 }
	});
}
// src/line-draw/line-draw.css.ts
var ve = "ny9vgz0", ye = "ny9vgz1", be = "ny9vgz2";
// src/line-draw/path.ts
function xe(e, t = .5) {
	if (e.length < 2) return "";
	let [n] = e, r = `M${n[0]},${n[1]}`;
	for (let n = 0; n < e.length - 1; n++) {
		let i = e[n - 1] ?? e[n], a = e[n], o = e[n + 1], s = e[n + 2] ?? o, c = t / 3, l = a[0] + (o[0] - i[0]) * c, u = a[1] + (o[1] - i[1]) * c, d = o[0] - (s[0] - a[0]) * c, f = o[1] - (s[1] - a[1]) * c;
		r += ` C${l},${u} ${d},${f} ${o[0]},${o[1]}`;
	}
	return r;
}
// src/line-draw/line-draw.tsx
var Se = 8;
function Ce({ series: e, duration: t = 2, thickness: n = 2.5, width: r = 320, height: i = 160, label: o = "Line chart", className: s, lineClassName: c }) {
	let l = d(), u = e.flat(), f = Math.max(...u, 0), p = Math.min(...u, 0), m = f - p || 1, h = e.map((e) => {
		let t = (r - 16) / Math.max(e.length - 1, 1), n = e.map((e, n) => [Se + n * t, Se + (1 - (e - p) / m) * (i - 16)]);
		return {
			d: xe(n),
			end: n.at(-1)
		};
	});
	return /* @__PURE__ */ C(a.svg, {
		className: D(ve, s),
		initial: "hidden",
		whileInView: "shown",
		viewport: {
			once: !0,
			amount: .4
		},
		viewBox: `0 0 ${r} ${i}`,
		role: "img",
		"aria-label": o,
		children: [[
			.25,
			.5,
			.75
		].map((e) => /* @__PURE__ */ S("line", {
			className: ye,
			x1: 0,
			x2: r,
			y1: i * e,
			y2: i * e
		}, e)), h.map(({ d: e, end: r }, i) => {
			let o = l ? 0 : i * .25, s = l ? 0 : t;
			return /* @__PURE__ */ C("g", {
				className: c?.(i),
				children: [/* @__PURE__ */ S(a.path, {
					d: e,
					className: be,
					style: { strokeWidth: n },
					variants: {
						hidden: {
							pathLength: 0,
							opacity: 0
						},
						shown: {
							pathLength: 1,
							opacity: 1,
							transition: {
								pathLength: {
									duration: s,
									delay: o,
									ease: [
										.65,
										0,
										.35,
										1
									]
								},
								opacity: {
									duration: .01,
									delay: o
								}
							}
						}
					}
				}), r && /* @__PURE__ */ S(a.circle, {
					className: "ny9vgz3",
					cx: r[0],
					cy: r[1],
					r: n + 2,
					variants: {
						hidden: { scale: 0 },
						shown: {
							scale: 1,
							transition: {
								delay: o + s,
								type: "spring",
								stiffness: 500,
								damping: 18
							}
						}
					}
				})]
			}, i);
		})]
	});
}
// src/marquee/marquee.css.ts
var we = "var(--_1jzxqkx0)", Te = "var(--_1jzxqkx1)", Ee = "_1jzxqkx3", De = "_1jzxqkx4", Oe = "_1jzxqkx7";
// src/marquee/marquee.tsx
function ke({ children: e, duration: t = 20, gap: n = "2rem", direction: r = "left", pauseOnHover: i = !0, className: a }) {
	let o = D(De, r === "right" && "_1jzxqkx5", i && "_1jzxqkx6");
	return /* @__PURE__ */ S("div", {
		className: D(Ee, a),
		style: E({
			[we]: `${t}s`,
			[Te]: n
		}),
		children: /* @__PURE__ */ C("div", {
			className: o,
			children: [/* @__PURE__ */ S("div", {
				className: Oe,
				children: e
			}), /* @__PURE__ */ S("div", {
				className: Oe,
				"aria-hidden": !0,
				children: e
			})]
		})
	});
}
// src/morph-modal/morph-modal.css.ts
var Ae = "gth5q00", je = "gth5q01", Me = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";
function Ne(e) {
	return [...e.querySelectorAll(Me)].filter((e) => e.tabIndex >= 0 && !e.closest("[inert]") && e.checkVisibility({
		visibilityProperty: !0,
		opacityProperty: !1
	}));
}
function Pe(e, t) {
	let n = Ne(t), r = n[0], i = n.at(-1);
	if (!r || !i) {
		e.preventDefault();
		return;
	}
	let a = document.activeElement, o = !t.contains(a);
	e.shiftKey && (o || a === r) ? (e.preventDefault(), i.focus()) : !e.shiftKey && (o || a === i) && (e.preventDefault(), r.focus());
}
// src/morph-modal/morph-modal.tsx
function Fe({ preview: e, children: n, label: r, duration: i = .5, bounce: o = .15, contained: s = !1, className: c, panelClassName: l, backdropClassName: u, closeLabel: f = "Close", closeClassName: p }) {
	let m = _(), h = d(), [v, T] = b(!1), E = y(null), O = y(null), k = y(null), A = h ? { duration: 0 } : {
		type: "spring",
		visualDuration: i,
		bounce: o
	};
	g(() => {
		if (!v) return;
		O.current?.focus({ preventScroll: !0 });
		let e = (e) => {
			let t = k.current;
			if (t?.contains(document.activeElement)) {
				if (e.key === "Tab" && !s) return Pe(e, t);
				e.key === "Escape" && (e.stopImmediatePropagation(), T(!1));
			}
		};
		window.addEventListener("keydown", e, { capture: !0 });
		let t = document.documentElement, n = t.style.overflow;
		return s || (t.style.overflow = "hidden"), () => {
			window.removeEventListener("keydown", e, { capture: !0 }), s || (t.style.overflow = n);
		};
	}, [v, s]);
	function j() {
		T(!1);
	}
	let M = (e) => s || typeof document > "u" ? e : w(e, document.body);
	function N() {
		E.current?.focus({ preventScroll: !0 });
	}
	return /* @__PURE__ */ C(x, { children: [/* @__PURE__ */ S(a.button, {
		ref: E,
		type: "button",
		layoutId: `${m}-shell`,
		layoutCrossfade: !1,
		transition: A,
		className: D(Ae, c),
		"aria-haspopup": "dialog",
		"aria-expanded": v,
		onClick: () => T(!0),
		children: /* @__PURE__ */ S(a.span, {
			layout: "position",
			className: je,
			children: e
		})
	}), M(/* @__PURE__ */ S(t, {
		onExitComplete: N,
		children: v && /* @__PURE__ */ C(a.div, {
			ref: k,
			className: s ? "gth5q03" : "gth5q02",
			exit: { pointerEvents: "none" },
			children: [/* @__PURE__ */ S(a.div, {
				className: D("gth5q04", u),
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: h ? 0 : .2 },
				onClick: j
			}), /* @__PURE__ */ C(a.dialog, {
				open: !0,
				"aria-modal": !s,
				"aria-label": r,
				layoutId: `${m}-shell`,
				layoutCrossfade: !1,
				transition: A,
				className: D("gth5q05", l),
				children: [/* @__PURE__ */ S(a.div, {
					layout: "position",
					className: "gth5q01",
					initial: { opacity: 0 },
					animate: {
						opacity: 1,
						transition: { delay: h ? 0 : i * .4 }
					},
					exit: {
						opacity: 0,
						transition: { duration: .08 }
					},
					children: n
				}), /* @__PURE__ */ S("button", {
					ref: O,
					type: "button",
					className: D("gth5q06", p),
					onClick: j,
					children: f
				})]
			})]
		})
	}))] });
}
// src/lib/visually-hidden.css.ts
var X = "nm2k3g0", Ie = "nhdnau0", Le = "nhdnau1", Re = "nhdnau2", ze = {
	handle: (e) => `Reorder ${e}. Use arrow up and down.`,
	moved: (e, t, n) => `${e}, position ${t} of ${n}`
}, Be = (e) => e;
function Ve({ items: e, onReorder: t, renderItem: n, itemLabel: i = Be, className: a, itemClassName: o, handleClassName: s, messages: c }) {
	let l = {
		...ze,
		...c
	}, [u, d] = b("");
	function f(n, r) {
		let a = e.indexOf(n), o = a + r;
		if (o < 0 || o >= e.length) return;
		let s = [...e];
		s.splice(a, 1), s.splice(o, 0, n), t(s), d(l.moved(i(n), o + 1, e.length));
	}
	return /* @__PURE__ */ C(x, { children: [/* @__PURE__ */ S(r.Group, {
		axis: "y",
		values: [...e],
		onReorder: t,
		className: D(Ie, a),
		children: e.map((e) => /* @__PURE__ */ S(He, {
			item: e,
			handleLabel: l.handle(i(e)),
			onMove: (t) => f(e, t),
			className: o,
			handleClassName: s,
			children: n(e)
		}, e))
	}), /* @__PURE__ */ S("p", {
		className: X,
		"aria-live": "polite",
		children: u
	})] });
}
function He({ item: e, handleLabel: t, onMove: n, className: i, handleClassName: a, children: o }) {
	let c = s(), l = d();
	function u(e) {
		(e.key === "ArrowUp" || e.key === "ArrowDown") && (e.preventDefault(), n(e.key === "ArrowUp" ? -1 : 1));
	}
	return /* @__PURE__ */ C(r.Item, {
		value: e,
		dragListener: !1,
		dragControls: c,
		tabIndex: -1,
		className: D(Le, i),
		layout: "position",
		whileDrag: l ? void 0 : { scale: 1.02 },
		children: [/* @__PURE__ */ S("button", {
			type: "button",
			className: D(Re, a),
			"aria-label": t,
			onPointerDown: (e) => c.start(e),
			onKeyDown: u,
			children: /* @__PURE__ */ C("svg", {
				viewBox: "0 0 16 16",
				width: "16",
				height: "16",
				"aria-hidden": !0,
				fill: "currentColor",
				children: [
					/* @__PURE__ */ S("circle", {
						cx: "5.5",
						cy: "4",
						r: "1.25"
					}),
					/* @__PURE__ */ S("circle", {
						cx: "10.5",
						cy: "4",
						r: "1.25"
					}),
					/* @__PURE__ */ S("circle", {
						cx: "5.5",
						cy: "8",
						r: "1.25"
					}),
					/* @__PURE__ */ S("circle", {
						cx: "10.5",
						cy: "8",
						r: "1.25"
					}),
					/* @__PURE__ */ S("circle", {
						cx: "5.5",
						cy: "12",
						r: "1.25"
					}),
					/* @__PURE__ */ S("circle", {
						cx: "10.5",
						cy: "12",
						r: "1.25"
					})
				]
			})
		}), o]
	});
}
// src/parallax/parallax.tsx
function Ue({ children: e, speed: t = .5, distance: n = 120, container: r, className: i }) {
	let o = y(null), s = d(), { scrollYProgress: c } = f({
		target: o,
		container: r,
		offset: ["start end", "end start"]
	}), l = m(c, [0, 1], [n * t, -n * t]);
	return /* @__PURE__ */ S(a.div, {
		ref: o,
		className: i,
		style: { y: s ? 0 : l },
		children: e
	});
}
// src/number-ticker/number-ticker.css.ts
var We = "_4440av0", Ge = "_4440av1", Ke = "_4440av2", qe = "_4440av3", Je = "_4440av4", Ye = "_4440av5", Xe = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
];
function Ze({ value: e, duration: n = .6, stagger: r = .04, format: i, locale: o, className: s }) {
	let l = d(), u = y(null), f = c(u, {
		once: !0,
		amount: .5
	}), p = v(() => new Intl.NumberFormat(o, {
		maximumFractionDigits: 0,
		...i
	}).format(e), [
		e,
		o,
		i
	]), m = [...p].map((e, t, n) => ({
		char: e,
		place: n.length - 1 - t
	})), h = [
		.22,
		1,
		.36,
		1
	], g = l ? {} : {
		initial: {
			opacity: 0,
			scale: .4
		},
		animate: {
			opacity: 1,
			scale: 1
		},
		exit: {
			opacity: 0,
			scale: .4
		}
	}, _ = l ? { duration: 0 } : {
		duration: n,
		ease: h
	};
	return /* @__PURE__ */ C("span", {
		ref: u,
		className: D(We, s),
		children: [/* @__PURE__ */ S("span", {
			className: X,
			children: p
		}), /* @__PURE__ */ S("span", {
			"aria-hidden": !0,
			className: Ge,
			children: /* @__PURE__ */ S(t, {
				initial: !1,
				mode: "popLayout",
				children: m.map(({ char: e, place: t }) => /\d/.test(e) ? /* @__PURE__ */ S(a.span, {
					layout: !l && "position",
					className: Ke,
					transition: _,
					...g,
					children: /* @__PURE__ */ S(Qe, {
						digit: Number(e),
						target: Number(e),
						fromZero: !f,
						transition: l ? { duration: 0 } : {
							duration: n,
							delay: t * r,
							ease: h
						}
					})
				}, t) : /* @__PURE__ */ S(a.span, {
					layout: !l && "position",
					className: Ye,
					transition: _,
					...g,
					children: e
				}, `${t}${e}`))
			})
		})]
	});
}
function Qe({ digit: e, target: t, fromZero: n, transition: r }) {
	let [i] = b(() => n ? 0 : e);
	return /* @__PURE__ */ S(a.span, {
		className: qe,
		initial: { y: `${-i * 10}%` },
		whileInView: { y: `${-t * 10}%` },
		viewport: { once: !0 },
		transition: r,
		children: Xe.map((e) => /* @__PURE__ */ S("span", {
			className: Je,
			children: e
		}, e))
	});
}
// src/scroll-reveal/scroll-reveal.tsx
function $e({ children: e, offset: t = 40, delay: n = 0, once: r = !0 }) {
	let i = d();
	return /* @__PURE__ */ S(a.div, {
		initial: {
			opacity: 0,
			y: i ? 0 : t
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: r,
			amount: .3
		},
		transition: {
			duration: .6,
			delay: n,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		children: e
	});
}
// src/scroll-highlight/scroll-highlight.css.ts
var et = "_5zdmf20";
// src/scroll-highlight/scroll-highlight.tsx
function tt({ text: e, dim: t = .5, container: n, className: r }) {
	let i = y(null), a = d(), { scrollYProgress: o } = f({
		target: i,
		container: n,
		offset: ["start 0.85", "end 0.45"]
	}), s = e.split(" ");
	return /* @__PURE__ */ C("p", {
		ref: i,
		className: D(et, r),
		children: [/* @__PURE__ */ S("span", {
			className: X,
			children: e
		}), /* @__PURE__ */ S("span", {
			"aria-hidden": !0,
			children: s.map((e, n) => /* @__PURE__ */ S(nt, {
				progress: o,
				range: [n / s.length, (n + 1) / s.length],
				dim: a ? 1 : t,
				children: e
			}, n))
		})]
	});
}
function nt({ progress: e, range: t, dim: n, children: r }) {
	let i = m(e, t, [n, 1]);
	return /* @__PURE__ */ C(x, { children: [/* @__PURE__ */ S(a.span, {
		"data-word": !0,
		style: { opacity: i },
		children: r
	}), " "] });
}
var Z = 10;
function Q(e, t, n) {
	let r = Z / 2;
	return `${t},${e} ${t + r},${e - r} ${n - r},${e - r} ${n},${e} ${n - r},${e + r} ${t + r},${e + r}`;
}
function $(e, t, n) {
	let r = Z / 2;
	return `${e},${t} ${e + r},${t + r} ${e + r},${n - r} ${e},${n} ${e - r},${n - r} ${e - r},${t + r}`;
}
var rt = Z / 2, it = 56 - Z / 2, at = Z / 2, ot = 50, st = 100 - Z / 2, ct = [
	Q(at, 7, 49),
	$(it, 7, 48),
	$(it, 52, 93),
	Q(st, 7, 49),
	$(rt, 52, 93),
	$(rt, 7, 48),
	Q(ot, 7, 49)
], lt = {
	0: [
		1,
		1,
		1,
		1,
		1,
		1,
		0
	],
	1: [
		0,
		1,
		1,
		0,
		0,
		0,
		0
	],
	2: [
		1,
		1,
		0,
		1,
		1,
		0,
		1
	],
	3: [
		1,
		1,
		1,
		1,
		0,
		0,
		1
	],
	4: [
		0,
		1,
		1,
		0,
		0,
		1,
		1
	],
	5: [
		1,
		0,
		1,
		1,
		0,
		1,
		1
	],
	6: [
		1,
		0,
		1,
		1,
		1,
		1,
		1
	],
	7: [
		1,
		1,
		1,
		0,
		0,
		0,
		0
	],
	8: [
		1,
		1,
		1,
		1,
		1,
		1,
		1
	],
	9: [
		1,
		1,
		1,
		1,
		0,
		1,
		1
	],
	"-": [
		0,
		0,
		0,
		0,
		0,
		0,
		1
	],
	" ": [
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]
}, ut = "_18ffjlb0", dt = "_18ffjlb1", ft = "_18ffjlb2", pt = 12;
function mt({ value: e, ghost: t = !0, skew: n = 6, height: r = 64, className: i }) {
	let o = d(), s = [...e], c = 0, l = s.map((e) => {
		let t = {
			char: e,
			x: c
		};
		return c += (e === ":" ? 18 : 56) + pt, t;
	}), u = Math.max(c - pt, 0), f = Math.tan(n * Math.PI / 180) * 100;
	return /* @__PURE__ */ S("svg", {
		className: D(ut, i),
		viewBox: `${-f / 2} 0 ${u + f} 100`,
		height: r,
		role: "img",
		"aria-label": e,
		children: /* @__PURE__ */ S("g", {
			transform: `translate(${f / 2} 0) skewX(${-n}) translate(${-f / 2} 0)`,
			children: l.map(({ char: e, x: n }, r) => e === ":" ? /* @__PURE__ */ C("g", {
				transform: `translate(${n} 0)`,
				children: [/* @__PURE__ */ S("circle", {
					className: ft,
					cx: 9,
					cy: 30,
					r: 5
				}), /* @__PURE__ */ S("circle", {
					className: ft,
					cx: 9,
					cy: 70,
					r: 5
				})]
			}, r) : /* @__PURE__ */ S("g", {
				transform: `translate(${n} 0)`,
				children: ct.map((n, r) => {
					let i = lt[e]?.[r] === 1;
					return /* @__PURE__ */ S(a.polygon, {
						points: n,
						className: dt,
						initial: !1,
						animate: { opacity: i ? 1 : t ? .08 : 0 },
						transition: { duration: o ? 0 : .18 }
					}, r);
				})
			}, r))
		})
	});
}
// src/split-text/split-text.css.ts
var ht = "_189aezp0", gt = "_189aezp1", _t = "_189aezp2";
// src/split-text/split-text.tsx
function vt({ text: e, stagger: t = .03, className: n }) {
	let r = d(), i = e.split(" "), o = 0;
	return /* @__PURE__ */ C(a.span, {
		className: D(ht, n),
		initial: "hidden",
		whileInView: "visible",
		viewport: { once: !0 },
		children: [/* @__PURE__ */ S("span", {
			className: X,
			children: e
		}), /* @__PURE__ */ S("span", {
			"aria-hidden": !0,
			children: i.map((e, n) => /* @__PURE__ */ C("span", { children: [n > 0 && " ", /* @__PURE__ */ S("span", {
				className: gt,
				children: [...e].map((e) => {
					let n = o++;
					return /* @__PURE__ */ S(a.span, {
						"data-char": !0,
						className: _t,
						variants: {
							hidden: {
								opacity: 0,
								y: r ? 0 : "0.6em",
								filter: "blur(6px)"
							},
							visible: {
								opacity: 1,
								y: 0,
								filter: "blur(0px)",
								transition: {
									duration: .5,
									delay: r ? 0 : n * t,
									ease: [
										.22,
										1,
										.36,
										1
									]
								}
							}
						},
						children: e
					}, n);
				})
			})] }, n))
		})]
	});
}
// src/sticky-story/sticky-story.css.ts
var yt = "_1cokhij0", bt = "_1cokhij1", xt = "_1cokhij2", St = "_1cokhij3";
// src/sticky-story/sticky-story.tsx
function Ct({ steps: e, renderVisual: t, container: n, className: r }) {
	let [i, a] = b(0);
	return /* @__PURE__ */ C("div", {
		className: D(yt, r),
		children: [/* @__PURE__ */ S("div", {
			className: bt,
			children: t(i)
		}), /* @__PURE__ */ S("ol", {
			className: xt,
			children: e.map((e, t) => /* @__PURE__ */ S(wt, {
				index: t,
				root: n,
				active: t === i,
				onActive: a,
				children: e
			}, t))
		})]
	});
}
function wt({ index: e, root: t, active: n, onActive: r, children: i }) {
	let a = y(null), o = c(a, {
		root: t,
		margin: "-45% 0px -45% 0px"
	});
	return g(() => {
		o && r(e);
	}, [
		o,
		e,
		r
	]), /* @__PURE__ */ S("li", {
		ref: a,
		className: St,
		"aria-current": n ? "step" : void 0,
		children: i
	});
}
// src/swipe-cards/swipe-cards.css.ts
var Tt = "_17q8eyq0", Et = "_17q8eyq1";
// src/swipe-cards/swipe-cards.tsx
function Dt({ cards: e, getKey: n, renderCard: r, onSwipe: i, threshold: a = 100, tilt: o = 12, direction: s, className: c, cardClassName: l }) {
	let u = e.slice(0, 3), [d, f] = b("right"), p = s ?? d;
	return /* @__PURE__ */ S("div", {
		className: D(Tt, c),
		children: /* @__PURE__ */ S(t, {
			initial: !1,
			custom: p,
			children: u.map((e, t) => /* @__PURE__ */ S(Ot, {
				depth: t,
				threshold: a,
				tilt: o,
				className: l,
				onSwipe: (t) => {
					f(t), i(e, t);
				},
				children: r(e)
			}, n(e))).toReversed()
		})
	});
}
function Ot({ depth: e, threshold: t, tilt: n, className: r, onSwipe: i, children: o }) {
	let s = d(), c = l(0), u = m(c, [
		-200,
		0,
		200
	], [
		-n,
		0,
		n
	]), f = e === 0;
	function p(e, n) {
		let r = Math.abs(n.offset.x) > t, a = Math.abs(n.velocity.x) > 600;
		(r || a) && i(n.offset.x > 0 ? "right" : "left");
	}
	return /* @__PURE__ */ S(a.div, {
		className: D(Et, r),
		style: {
			x: c,
			rotate: s ? 0 : u,
			zIndex: 10 - e
		},
		drag: f ? "x" : !1,
		dragSnapToOrigin: !0,
		onDragEnd: p,
		initial: !1,
		animate: {
			scale: 1 - e * .05,
			y: e * 12,
			opacity: e > 1 ? .6 : 1
		},
		variants: { exit: (e) => ({
			x: s ? 0 : e === "right" ? 400 : -400,
			opacity: 0,
			transition: { duration: s ? 0 : .3 }
		}) },
		exit: "exit",
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 32
		},
		children: o
	});
}
// src/toast-stack/toast-stack.css.ts
var kt = "eoy14u0", At = "eoy14u1", jt = "eoy14u2", Mt = "eoy14u4", Nt = "eoy14u5", Pt = "eoy14u6", Ft = "eoy14u8", It = 10, Lt = .05;
function Rt({ toasts: e, onDismiss: n, duration: r = 4, limit: i = 3, collapse: o = !0, label: s = "Notifications", dismissLabel: c = "Dismiss", className: l, toastClassName: u }) {
	let f = d(), [p, m] = b(!1), [h, _] = b(!1), [v, x] = b(!1), w = y(null), T = p || h || v && e.length > 0;
	g(() => {
		if (!v) return;
		let e = (e) => {
			w.current?.contains(e.target) || x(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [v]);
	let E = o && !T, O = e.slice(-i).toReversed(), k = f ? { duration: 0 } : {
		type: "spring",
		stiffness: 420,
		damping: 36
	}, A = new Set(e.map((e) => e.id));
	return /* @__PURE__ */ C("section", {
		"aria-label": s,
		className: D(kt, l),
		children: [e.map((e) => /* @__PURE__ */ S(zt, {
			id: e.id,
			duration: r,
			paused: T,
			onDismiss: n
		}, e.id)), /* @__PURE__ */ S("div", {
			ref: w,
			className: At,
			onClick: (e) => {
				o && !e.target.closest("button") && x(!0);
			},
			onPointerEnter: () => m(!0),
			onPointerLeave: () => m(!1),
			onFocus: () => _(!0),
			onBlur: (e) => {
				e.currentTarget.contains(e.relatedTarget) || _(!1);
			},
			children: /* @__PURE__ */ S("div", {
				role: "status",
				"aria-live": "polite",
				"aria-relevant": "additions",
				children: /* @__PURE__ */ S("ol", {
					className: D(jt, E && "eoy14u3"),
					"data-stacked": E || void 0,
					children: /* @__PURE__ */ S(t, {
						initial: !1,
						mode: "popLayout",
						custom: A,
						children: O.map((e, t) => /* @__PURE__ */ C(a.li, {
							layout: !f && "position",
							className: D(Mt, u),
							custom: A,
							variants: { exit: (t) => f ? { opacity: 0 } : t.has(e.id) ? {
								opacity: 0,
								y: (E ? i : 0) * It,
								scale: 1 - i * Lt,
								transition: { duration: .2 }
							} : {
								opacity: 0,
								x: 48,
								transition: { duration: .2 }
							} },
							exit: "exit",
							initial: f ? { opacity: 0 } : {
								opacity: 0,
								y: -24,
								scale: .96
							},
							animate: {
								opacity: 1,
								y: E ? t * It : 0,
								scale: E ? 1 - t * Lt : 1,
								zIndex: O.length - t
							},
							transition: {
								...k,
								opacity: { duration: f ? 0 : .12 }
							},
							"aria-hidden": E && t > 0 ? !0 : void 0,
							children: [/* @__PURE__ */ C("div", {
								className: Nt,
								children: [/* @__PURE__ */ S("span", {
									className: Pt,
									children: e.title
								}), e.body && /* @__PURE__ */ S("span", {
									className: "eoy14u7",
									children: e.body
								})]
							}), /* @__PURE__ */ S("button", {
								type: "button",
								className: Ft,
								"aria-label": c,
								tabIndex: E && t > 0 ? -1 : void 0,
								onClick: () => n(e.id),
								children: /* @__PURE__ */ S("svg", {
									viewBox: "0 0 16 16",
									width: "14",
									height: "14",
									"aria-hidden": !0,
									children: /* @__PURE__ */ S("path", {
										d: "M4 4l8 8M12 4l-8 8",
										stroke: "currentColor",
										strokeWidth: "1.75"
									})
								})
							})]
						}, e.id))
					})
				})
			})
		})]
	});
}
function zt({ id: e, duration: t, paused: n, onDismiss: r }) {
	let i = y(t * 1e3), a = y(r);
	return g(() => {
		a.current = r;
	}), g(() => {
		i.current = t * 1e3;
	}, [t]), g(() => {
		if (n || t <= 0) return;
		let r = performance.now(), o = setTimeout(() => a.current(e), i.current);
		return () => {
			clearTimeout(o), i.current -= performance.now() - r;
		};
	}, [
		n,
		t,
		e
	]), null;
}
// src/text-scramble/text-scramble.css.ts
var Bt = "_1s9xvkt0", Vt = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=?<>/[]{}";
function Ht({ text: e, duration: t = 1.2, className: n }) {
	let r = y(null), i = c(r, { once: !0 }), a = d(), [o, s] = b(() => Ut(e, 0));
	return g(() => {
		if (!i || a) return;
		let n = 0, r = performance.now(), o = (i) => {
			let a = Math.min((i - r) / (t * 1e3), 1);
			s(Ut(e, a)), a < 1 && (n = requestAnimationFrame(o));
		};
		return n = requestAnimationFrame(o), () => cancelAnimationFrame(n);
	}, [
		i,
		a,
		e,
		t
	]), /* @__PURE__ */ C("span", {
		ref: r,
		className: D(Bt, n),
		children: [/* @__PURE__ */ S("span", {
			className: X,
			children: e
		}), /* @__PURE__ */ S("span", {
			"aria-hidden": !0,
			children: a ? e : o
		})]
	});
}
function Ut(e, t) {
	let n = Math.floor(t * e.length);
	return [...e].map((e, t) => t < n || e === " " ? e : Vt[Math.floor(Math.random() * 50)]).join("");
}
// src/tilt-card/tilt-card.css.ts
var Wt = "c04r4x0", Gt = "c04r4x1";
// src/tilt-card/tilt-card.tsx
function Kt({ children: e, maxTilt: t = 12, className: n }) {
	let r = d(), i = l(.5), o = l(.5), s = {
		stiffness: 200,
		damping: 20
	}, c = p(m(o, [0, 1], [t, -t]), s), u = p(m(i, [0, 1], [-t, t]), s);
	function f(e) {
		if (r) return;
		let t = e.currentTarget.getBoundingClientRect();
		i.set((e.clientX - t.left) / t.width), o.set((e.clientY - t.top) / t.height);
	}
	function h() {
		i.set(.5), o.set(.5);
	}
	return /* @__PURE__ */ S("div", {
		className: Wt,
		children: /* @__PURE__ */ S(a.div, {
			className: D(Gt, n),
			style: {
				rotateX: c,
				rotateY: u
			},
			onPointerMove: f,
			onPointerLeave: h,
			children: e
		})
	});
}
// src/view-transition/view-transition.tsx
function qt(e = .35) {
	let t = d();
	return h((n) => {
		t || typeof document > "u" || !document.startViewTransition ? n() : (document.documentElement.style.setProperty("--vt-duration", `${e}s`), document.startViewTransition(() => T(n)));
	}, [t, e]);
}
function Jt() {
	let e = _().replace(/[^a-zA-Z0-9-]/g, "");
	return h((t) => `vt-${e}-${t.replace(/[^a-zA-Z0-9-]/g, "")}`, [e]);
}
export { M as Accordion, H as AnalogClock, oe as CommandPalette, de as CompareSlider, fe as CountUp, ge as CursorFollower, Ce as LineDraw, _e as MagneticButton, ke as Marquee, Fe as MorphModal, e as MotionProvider, Ze as NumberTicker, Ue as Parallax, Ve as ReorderList, tt as ScrollHighlight, $e as ScrollReveal, mt as SevenSegment, vt as SplitText, Ct as StickyStory, Dt as SwipeCards, Ht as TextScramble, Kt as TiltCard, Rt as ToastStack, D as cx, K as defaultMatch, Jt as useTransitionName, qt as useViewTransition };

//# sourceMappingURL=index.js.map