/**
 * @typedef {number | string | null} StateValueType
 * @typedef {{[k: string]: StateValue | StateValueType}} StateValue
 * @typedef {(value: StateValueType) => void} StateCb
 * @typedef {{[k: string]: InspectorStateEl | HTMLElement}} InspectorStateEl
 * @typedef {{[k: string]: InspectorStateCb | StateCb }} InspectorStateCb
 * @typedef {{
 *      title?: string,
 *      type?: "number" | "text" | "file" | "submit" | "color" | "range",
 *      options?: {
 *          min?: number,
 *          max?: number,
 *          step?: number,
 *          [x: string]: any,
 *      },
 *      onChange?: StateCb,
 *      value: InspectorCreateStateObject | string | number,
 * }} InspectorCreateState
 * @typedef {{[k: string]: InspectorCreateState }} InspectorCreateStateObject
 */

import { createEl } from "./Utils.js";

function camelToTitleCase(str) {
    return str
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
}

export class InspectorSection {
    /** @type {HTMLElement} Body section element */
    #bodyEl
    /** @type {HTMLElement} Items section element */
    #itemsEl
    /** @type {string} Inspector name */
    #name
    /** @type {StateValue} Inspector state object */
    #state
    /** @type {InspectorStateEl} Inspector state elements */
    #stateEl
    /** @type {InspectorStateCb} Inspector state callback */
    #stateCb

    /**
     * Create new instance of InspectorSection.
     * @param {string} name Name of the inspector section.
     * @param {string} title Title of the inspector section.
     * @param {InspectorCreateStateObject} states State object to create.
     */
    constructor(name, title, states) {
        this.#name = name;
        this.#state = {};
        this.#stateCb = {};
        this.#stateEl = {};
        this.#itemsEl = document.createElement("tbody");
        this.#bodyEl = createEl(`
        <div class="insp-sect" id="insp-${name}">
            <table class="insp-items">
                <thead>
                    <tr>
                        <th colspan="4">${title}</th>
                    </tr>
                </thead>
            </table>
        </div>
        `);
        this.#bodyEl.children.item(0).appendChild(this.#itemsEl);
        this.#createStateEl(states);
        this.toggle(false);
        // Prevent refresh on submit form
        // this.#bodyEl.submit((e) => e.preventDefault());
    }

    get bodyEl() {
        return this.#bodyEl;
    }

    get itemsEl() {
        return this.#itemsEl;
    }

    get state() {
        return this.#state;
    }

    get name() {
        return this.#name;
    }

    setState(state, useCallback=true) {
        const name = this.#name;
        function setValueState(curState, cbState, elState, newState) {
            Object.keys(newState).forEach(v => {
                if (!(v in curState)) {
                    console.error(
                        `setting new key ${v} in state ${name} not allowed!`,
                        "Current state is", curState, "and new state is", state
                    );
                    return; // drop if key not in state
                }
                const s = newState[v];
                if (typeof s === "object") {
                    setValueState(curState[v], cbState[v], elState[v], s);
                } else {
                    if (curState[v] === s) return; // drop if same value
                    curState[v] = s;
                    try { elState[v].value = s; } catch (_) {}
                    useCallback && cbState[v] && cbState[v](s);
                }
            });
        }
        setValueState(this.#state, this.#stateCb, this.#stateEl, state);
    }

    setStateCallback(state, cb) {
        const curSt = this.#state;
    }
    
    toggle(visible) {
        if (visible) this.#bodyEl.style.display = "flex";
        else this.#bodyEl.style.display = "none";
    }

    /**
     * Create state element.
     * @param {InspectorCreateStateObject} states State object to create.
     */
    #createStateEl(states) {
        const prefix = "insp-" + this.#name;
        Object.keys(states).forEach(v => {
            const s = states[v].value;
            if (typeof s === "object" && s !== null) {
                const body = createEl(`<template>
                    <tr><td colspan="4">${states[v].title || v}</td></tr>
                    <tr></tr>
                </template>`);
                const tr = body.item(1);
                this.#stateEl[v] = {};
                this.#stateCb[v] = {};
                this.#state[v] = {};
                Object.keys(s).forEach(vv => {
                    this.#state[v][vv] = s[vv].value;
                    if(!s[vv].title) s[vv].title = camelToTitleCase(vv);
                    const [it, inp] = this.#createStateInputEl(`${prefix}-${v}-${vv}`, s[vv], v, vv);
                    this.#stateEl[v][vv] = inp;
                    tr.append(it);
                });
                this.#itemsEl.append(body.item(0), tr);
            } else {
                const tr = document.createElement("tr");
                this.#state[v] = s;
                if(!states[v].title) states[v].title = camelToTitleCase(v);
                const [it, inp] = this.#createStateInputEl(`${prefix}-${v}`, states[v], null, v);
                this.#stateEl[v] = inp;
                tr.append(it);
                this.#itemsEl.append(tr);
            }
        })
    }

    /**
     * 
     * @param {string} id Id of the input element.
     * @param {InspectorCreateState} state State to create
     * @param {string?} parent Parent of the state
     * @param {string} child Child of the state
     */
    #createStateInputEl(id, state, parent, child) {
        const type = state.type || "number";
        const options = state.options || {};
        // Selector for child or parent
        const d = { [child]: state[child] };
        let cs = this.#state, sd = d;
        if (parent) {
            sd = { [parent]: d };
            cs = cs[parent];
            this.#stateCb[parent][child] = state.onChange;
        } else {
            this.#stateCb[child] = state.onChange;
        }
        const it = createEl(`
        <td colspan="${parent?1:4}">
            <div class="insp-item-sect">
            </div>
        </td>
        `);
        const t = it.children.item(0);

        if (options.label || (type !== "submit" && options.label == null))
            t.appendChild(createEl(`<label for="${id}">${state.title || child}</label>`));
        
        function getValue(e) {
            const value = e.target.value;
            return ["number", "range"].indexOf(type) === 1 ? parseFloat(value) : value;
        }
        function assignAttributes(el) {
            Object.keys(options).forEach(v => {
                if (v === "choices") return;
                el.setAttribute(v, options[v]);
            });
            return el;
        }
        const listenInput = (el) => {
            el.addEventListener("input", (e) => {
                let val;
                if (type === "checkbox") {
                    val = e.target.checked;
                } else {
                    val = getValue(e);
                    if (type === "number" && Number.isNaN(val))
                        return;
                }
                d[child] = val;
                this.setState(sd);
            })
            return el;
        };
        const inputCreator = {
            general: () => listenInput(assignAttributes(createEl(`
                <input type="${type}" id="${id}" value="${state.value}" ${state.value === true ? "checked":""} />
            `))),
            select: () => listenInput(assignAttributes(createEl(`
                <select id="${id}">
                ${Object.keys(options.choices || {}).map(v =>
                    `<option value="${v}" ${cs[child] === v ? "selected":""}>
                        ${options.choices[v]}
                    </option>`
                ).join('')}
                </select>
            `))),
            file: () => {
                const inp = assignAttributes(createEl(`
                    <input type="file" id="${id}" />
                `));
                inp.addEventListener("change", (e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        d[child] = e.target.result;
                        this.setState(sd);
                    }
                    reader.readAsText(file);
                });
                return inp;
            },
            submit: () => {
                const inp = assignAttributes(createEl(`
                    <input type="submit" id="${id}" value="${state.title || child}" />
                `));
                inp.addEventListener("click", (e) => {
                    state.onChange(e);
                });
                return inp;
            },
        }
        const inp = inputCreator[type in inputCreator ? type:"general"]();
        t.appendChild(inp);
        return [it, inp];
    }
}

export class Inspector {
    /** @type {HTMLElement} Main element */
    #mainEl
    /** @type {Object<string, InspectorSection>} Inspector sections */
    #sections
    /** @type {Set<string>} Current sections */
    #currentSect

    constructor(mainEl) {
        this.#mainEl = mainEl;
        this.#sections = {};
        this.#currentSect = new Set();
    }

    register(inspector) {
        this.#sections[inspector.name] = inspector;
        this.#mainEl.appendChild(inspector.bodyEl);
    }

    toggle(inspName) {
        if (this.#currentSect.has(inspName)) this.hide(inspName);
        else this.show(inspName);
    }

    show(...inspName) {
        if (inspName.length > 1) {
            inspName.forEach(v => this.show(v));
            return;
        }
        if (inspName.length === 0) return;
        inspName = inspName[0];
        if (!(inspName in this.#sections)) return;
        if (this.#currentSect.has(inspName)) return;
        this.#currentSect.add(inspName);
        this.#sections[inspName].toggle(true);
    }

    hide(...inspName) {
        if (inspName.length > 1) {
            inspName.forEach(v => this.hide(v));
            return;
        }
        if (inspName.length === 0) return;
        inspName = inspName[0];
        if (!(inspName in this.#sections)) return;
        if (!this.#currentSect.has(inspName)) return;
        this.#currentSect.delete(inspName);
        this.#sections[inspName].toggle(false);
    }
}

export const state = {
    input: (value, type="number", onChange=null, options={}) => {
        return {
            value,
            type,
            onChange,
            options,
        }
    },
    group: (title, value) => {
        return {
            value,
            title,
        }
    },
    button: (title=null, onClick=null) => {
        return {
            ...state.input(null, "submit", onClick),
            title,
        }
    },
    select: (title, value, choices, onChange=null, options={}) => {
        return {
            ...state.input(value, "select", onChange, {
                choices,
                ...options,
            }),
            title,
        }
    },
    number: (value, onChange=null, options={}) => {
        return state.input(value, "number", onChange, options);
    },
    range: (value, onChange=null, options={}) => {
        return state.input(value, "range", onChange, options);
    },
    vector3: (title, onChange=null, value={}, options={}) => {
        return state.group(title, {
            x: state.number(value.x || 0, (v) => onChange?.('x',v), options),
            y: state.number(value.y || 0, (v) => onChange?.('y',v), options),
            z: state.number(value.z || 0, (v) => onChange?.('z',v), options),
        });
    },
    text: (value, onChange=null, options={}) => {
        return state.input(value, "text", onChange, options);
    },
    file: (value, onChange=null, options={}) => {
        return state.input(value, "file", onChange, options);
    },
    color: (value, onChange=null, options={}) => {
        return state.input(value, "color", onChange, options);
    },
    toggle: (value, onChange=null, options={}) => {
        return state.input(value, "checkbox", onChange, options);
    },
}
