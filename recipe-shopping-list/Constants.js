module.exports = {
    // https://agenda.community/t/x-callback-url-support-and-reference/27253
    AGENDA_CALLBACK_URL_BASE: 'agenda://x-callback-url/',
    DEFAULT_COLOR: Color.dynamic(Color.white(), Color.black()),
    HIGHLIGHT_COLOR: Color.dynamic(new Color('#e8e8e8'), new Color('#303030')),
    THEME_COLOR: Color.dynamic(new Color('#e2c9ff'), new Color('#3d215e')),
    NOTE_TEMPLATE: '## Meals\n\n%%meals%%\n\n## Items\n\n%%items%%',
};