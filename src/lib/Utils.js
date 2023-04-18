/**
 * Get clip position from mouse event.
 * @param {Event} ev Event to get position from.
 * @returns {{x: number, y: number}}
 */
export function getClipPosition(ev) {
    /** @type {HTMLCanvasElement} */
    let canvas = ev.target;
    let rect = canvas.getBoundingClientRect();
    return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
    }
}

/**
 * Create new element node from HTML string.
 * @param {string} html HTML string to create element from
 * @return {Element}
 */
export function createEl(html) {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    const el = template.content.children.item(0);
    if (el instanceof HTMLTemplateElement)
        return el.content.children;
    return template.content.children.item(0);
}