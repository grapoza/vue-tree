// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
const dropEffect = Object.freeze({
    None: 'none',
    Copy: 'copy',
    Move: 'move',
    Link: 'link'
});

// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed
const effectAllowed = Object.freeze({
    None: 'none',
    All: 'all',
    Copy: 'copy',
    Move: 'move',
    Link: 'link',
    CopyMove: 'copyMove',
    CopyLink: 'copyLink',
    LinkMove: 'linkMove'
});

// indicates where a dragged node should drop relative to the target node
const targetZone = Object.freeze({
    Before: 0,
    After: 1,
    Child: 2
});

export { dropEffect, effectAllowed, targetZone };