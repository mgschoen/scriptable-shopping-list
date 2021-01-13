const { AGENDA_CALLBACK_URL_BASE } = importModule('Constants');

module.exports = class AgendaClient {
    constructor(options) {
        this.projectTitle = options.projectTitle ?
            options.projectTitle :
            'New Project ' + new Date().getTime();
        this.projectId = null;
        this.noteId = null;
    }

    static createCallbackUrl(action, parameters) {
        const cb = new CallbackURL(AGENDA_CALLBACK_URL_BASE + action);
        for (let parameter in parameters) {
            cb.addParameter(parameter, parameters[parameter]);
        }
        return cb;
    }

    async init() {
        // check for existing Agenda project
        const callbackOpenProject = AgendaClient.createCallbackUrl('open-project', { title: this.projectTitle });
        try {
            const callbackResult = await callbackOpenProject.open();
            this.projectId = callbackResult.project;
        } catch (_) { /* Do nothing */ }

        // create project if none exists
        if (!this.projectId) {
            const callbackCreateProject = AgendaClient.createCallbackUrl('create-project', { title: this.projectTitle });
            try {
                const callbackResult = await callbackCreateProject.open();
                this.projectId = callbackResult.project;
            } catch (error) {
                console.error(error);
                presentAlert('Fehler', 'Beim Anlegen eines neuen Agenda-Projekts ist etwas schiefgelaufen');
                return false;
            }
        }

        return true;
    }

    async writeNote(noteTitle, content) {
        if (this.noteId) {
            console.warn('[AgendaClient.writeNote] Did not write note, because a note already exists for this instance');
            return;
        }

        const callbackCreateNote = AgendaClient.createCallbackUrl('create-note', {
            'project-title': this.projectTitle,
            title: noteTitle,
            text: content
        });
        const response = await callbackCreateNote.open();
        this.noteId = response.note ||  null;
        return this.noteId;
    }
}