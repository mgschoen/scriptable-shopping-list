const { presentAlert } = importModule('Utils');
const { HIGHLIGHT_COLOR, THEME_COLOR } = importModule('Constants');

module.exports = class SelectionTable {
    constructor(options) {
        if (!options.headline) {
            presentAlert('Could not initialize ContentfulClient: missing option "headline"');
            return;
        }
        if (!options.data ||  !Array.isArray(options.data)) {
            presentAlert('Could not initialize ContentfulClient: missing or malformed option "data"');
            return;
        }

        this.headline = options.headline;
        this.subheadline = options.subheadline ? options.subheadline : '';
        this.data = options.data;

        this.table = new UITable();
        this.selectionState = [];
        this.rows = [];

        this._boundOnRowSelect = (index) => this._onRowSelect(index);

        this.table.showSeparators = true;
        this._initTableHeader();
        this._initTableRows();
    }

    _onRowSelect(num) {
        const index = num - 1;
        const row = this.rows[index];
        if (this.selectionState[index]) {
            this.selectionState[index] = false;
            row.backgroundColor = null;
        } else {
            this.selectionState[index] = true;
            row.backgroundColor = HIGHLIGHT_COLOR;
        }
        this.table.reload();
    }

    _initTableHeader() {
        const recipesHeadline = new UITableRow();
        recipesHeadline.isHeader = true;
        recipesHeadline.height = 100;
        recipesHeadline.backgroundColor = THEME_COLOR;
        recipesHeadline.addText(this.headline, this.subheadline);
        this.table.addRow(recipesHeadline);
    }

    _initTableRows() {
        for (let entry of this.data) {
            let label = null;
            if (typeof entry === 'string') {
                label = entry;
            } else if (entry.title && typeof entry.title === 'string') {
                label = entry.title;
            } else {
                label = '-';
            }

            const row = new UITableRow();
            row.dismissOnSelect = false;

            const content = UITableCell.text(label);
            content.widthWeight = 90;
            row.addCell(content);
            row.onSelect = this._boundOnRowSelect;

            this.table.addRow(row);
            this.rows.push(row);
            this.selectionState.push(false);
        }
    }

    // Presents the table and returns the selected datasets
    async present() {
        await this.table.present(true);
        const selectedDatasets = [];
        for (let index in this.selectionState) {
            const state = this.selectionState[index];
            if (state) {
                selectedDatasets.push(this.data[index]);
            }
        }
        return selectedDatasets;
    }
}