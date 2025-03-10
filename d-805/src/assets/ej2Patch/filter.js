import { EventHandler, isNullOrUndefined, extend, closest, getValue } from '@syncfusion/ej2-base';
import { getActualPropFromColl, isActionPrevent, getColumnByForeignKeyValue } from '../base/util';
import { remove, matches, isBlazor } from '@syncfusion/ej2-base';
import { DataUtil, Query, DataManager } from '@syncfusion/ej2-data';
import * as events from '../base/constant';
import { CellType } from '../base/enum';
import { RowRenderer } from '../renderer/row-renderer';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { FilterCellRenderer } from '../renderer/filter-cell-renderer';
import { parentsUntil } from '../base/util';
import { FilterMenuRenderer } from '../renderer/filter-menu-renderer';
import { CheckBoxFilter } from '../actions/checkbox-filter';
import { ExcelFilter } from '../actions/excel-filter';
/**
 *
 * The `Filter` module is used to handle filtering action.
 */
var Filter = /** @class */ (function () {
    /**
     * Constructor for Grid filtering module
     * @hidden
     */
    function Filter(parent, filterSettings, serviceLocator) {
        this.predicate = 'and';
        this.contentRefresh = true;
        this.refresh = true;
        this.values = {};
        this.cellText = {};
        this.nextFlMenuOpen = '';
        this.type = { 'Menu': FilterMenuRenderer, 'CheckBox': CheckBoxFilter, 'Excel': ExcelFilter };
        /** @hidden */
        this.filterOperators = {
            contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
            lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith'
        };
        this.fltrDlgDetails = { field: '', isOpen: false };
        /** @hidden */
        this.skipNumberInput = ['=', ' ', '!'];
        this.skipStringInput = ['>', '<', '='];
        this.actualPredicate = {};
        this.parent = parent;
        this.filterSettings = filterSettings;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }
    /**
     * To render filter bar when filtering enabled.
     * @return {void}
     * @hidden
     */
    Filter.prototype.render = function (e) {
        if (DataUtil.getObject('args.isFrozen', e)) {
            return;
        }
        var gObj = this.parent;
        this.l10n = this.serviceLocator.getService('localization');
        this.getLocalizedCustomOperators();
        if (this.parent.filterSettings.type === 'FilterBar') {
            if (gObj.columns.length) {
                var fltrElem = this.parent.element.querySelector('.e-filterbar');
                if (fltrElem) {
                    remove(fltrElem);
                }
                var rowRenderer = new RowRenderer(this.serviceLocator, CellType.Filter, gObj);
                var row = void 0;
                var cellrender = this.serviceLocator.getService('cellRendererFactory');
                cellrender.addCellRenderer(CellType.Filter, new FilterCellRenderer(this.parent, this.serviceLocator));
                this.valueFormatter = this.serviceLocator.getService('valueFormatter');
                rowRenderer.element = this.parent.createElement('tr', { className: 'e-filterbar' });
                row = this.generateRow();
                row.data = this.values;
                this.parent.getHeaderContent().querySelector('thead').appendChild(rowRenderer.element);
                var rowdrag = this.parent.element.querySelector('.e-rowdragheader');
                this.element = rowRenderer.render(row, gObj.getColumns(), null, null, rowRenderer.element);
                var detail = this.element.querySelector('.e-detailheadercell');
                if (detail) {
                    detail.className = 'e-filterbarcell e-mastercell';
                }
                if (rowdrag) {
                    rowdrag.className = 'e-dragheadercell e-mastercell';
                }
                var gCells = [].slice.call(this.element.querySelectorAll('.e-grouptopleftcell'));
                if (gCells.length) {
                    gCells[gCells.length - 1].classList.add('e-lastgrouptopleftcell');
                }
                this.wireEvents();
                this.parent.notify(events.freezeRender, { case: 'filter' });
            }
        }
    };
    /**
     * To destroy the filter bar.
     * @return {void}
     * @hidden
     */
    Filter.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        if (this.filterModule) {
            this.filterModule.destroy();
        }
        // tslint:disable-next-line:no-any
        if (!this.parent.refreshing) {
            this.filterSettings.columns = [];
        }
        this.updateFilterMsg();
        this.removeEventListener();
        this.unWireEvents();
        if (this.element) {
            remove(this.element);
            var filterBarElement = this.parent.getHeaderContent().querySelector('.e-filterbar');
            if (this.parent.getFrozenColumns() && filterBarElement) {
                remove(filterBarElement);
            }
        }
    };
    Filter.prototype.generateRow = function (index) {
        var options = {};
        var row = new Row(options);
        row.cells = this.generateCells();
        return row;
    };
    Filter.prototype.generateCells = function () {
        //TODO: generate dummy column for group, detail, stacked row here for filtering;
        var cells = [];
        if (this.parent.allowGrouping) {
            for (var c = 0, len = this.parent.groupSettings.columns.length; c < len; c++) {
                cells.push(this.generateCell({}, CellType.HeaderIndent));
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            cells.push(this.generateCell({}, CellType.DetailHeader));
        }
        if (this.parent.isRowDragable()) {
            cells.push(this.generateCell({}, CellType.RowDragHIcon));
        }
        for (var _i = 0, _a = this.parent.getColumns(); _i < _a.length; _i++) {
            var dummy = _a[_i];
            cells.push(this.generateCell(dummy));
        }
        return cells;
    };
    Filter.prototype.generateCell = function (column, cellType) {
        var opt = {
            'visible': column.visible,
            'isDataCell': false,
            'rowId': '',
            'column': column,
            'cellType': cellType ? cellType : CellType.Filter,
            'attributes': { title: this.l10n.getConstant('FilterbarTitle') }
        };
        return new Cell(opt);
    };
    /**
     * To update filterSettings when applying filter.
     * @return {void}
     * @hidden
     */
    Filter.prototype.updateModel = function () {
        var col = this.parent.getColumnByField(this.fieldName);
        // var field = col.isForeignColumn() ? col.foreignKeyValue : this.fieldName;
        var field = this.fieldName;
        this.currentFilterObject = {
            field: field, uid: col.uid, isForeignKey: col.isForeignColumn(), operator: this.operator,
            value: this.value, predicate: this.predicate,
            matchCase: this.matchCase, ignoreAccent: this.ignoreAccent, actualFilterValue: {}, actualOperator: {}
        };
        var index = this.getFilteredColsIndexByField(col);
        if (index > -1) {
            this.filterSettings.columns[index] = this.currentFilterObject;
        }
        else {
            this.filterSettings.columns.push(this.currentFilterObject);
        }
        this.filterSettings.columns = this.filterSettings.columns;
        this.parent.dataBind();
    };
    Filter.prototype.getFilteredColsIndexByField = function (col) {
        var cols = this.filterSettings.columns;
        for (var i = 0, len = cols.length; i < len; i++) {
            if (cols[i].uid === col.uid || (col.isForeignColumn() && this.parent.getColumnByUid(col.uid).field === col.foreignKeyValue)) {
                return i;
            }
        }
        return -1;
    };
    /**
     * To trigger action complete event.
     * @return {void}
     * @hidden
     */
    Filter.prototype.onActionComplete = function (e) {
        if (isBlazor() && !this.parent.isJsComponent) {
            e.rows = null;
        }
        var args = !this.isRemove ? {
            currentFilterObject: this.currentFilterObject,
            /* tslint:disable:no-string-literal */
            currentFilteringColumn: !isNullOrUndefined(this.column) ? this.column.field : undefined,
            /* tslint:enable:no-string-literal */
            columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionComplete
        } : {
            requestType: 'filtering', type: events.actionComplete
        };
        this.parent.trigger(events.actionComplete, extend(e, args));
        this.isRemove = false;
    };
    Filter.prototype.wireEvents = function () {
        EventHandler.add(this.parent.getHeaderContent(), 'keyup', this.keyUpHandler, this);
    };
    Filter.prototype.unWireEvents = function () {
        EventHandler.remove(this.parent.getHeaderContent(), 'keyup', this.keyUpHandler);
    };
    Filter.prototype.enableAfterRender = function (e) {
        if (e.module === this.getModuleName() && e.enable) {
            this.parent.getHeaderTable().classList.add('e-sortfilter');
            this.render();
        }
    };
    Filter.prototype.initialEnd = function () {
        this.parent.off(events.contentReady, this.initialEnd);
        if (this.parent.getColumns().length && this.filterSettings.columns.length) {
            var gObj = this.parent;
            this.contentRefresh = false;
            this.initialLoad = true;
            for (var _i = 0, _a = gObj.filterSettings.columns; _i < _a.length; _i++) {
                var col = _a[_i];
                this.filterByColumn(col.field, col.operator, col.value, col.predicate, col.matchCase, col.ignoreAccent, col.actualFilterValue, col.actualOperator);
            }
            this.initialLoad = false;
            this.updateFilterMsg();
            this.contentRefresh = true;
        }
    };
    /**
     * @hidden
     */
    Filter.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.filterComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.keyPressed, this.keyUpHandler, this);
        this.parent.on(events.columnPositionChanged, this.columnPositionChanged, this);
        this.parent.on(events.headerRefreshed, this.render, this);
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.filterMenuClose, this.filterMenuClose, this);
        EventHandler.add(document, 'click', this.clickHandler, this);
        this.parent.on(events.filterOpen, this.columnMenuFilter, this);
        this.parent.on(events.click, this.filterIconClickHandler, this);
    };
    /**
     * @hidden
     */
    Filter.prototype.removeEventListener = function () {
        EventHandler.remove(document, 'click', this.clickHandler);
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.filterComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.keyPressed, this.keyUpHandler);
        this.parent.off(events.columnPositionChanged, this.columnPositionChanged);
        this.parent.off(events.headerRefreshed, this.render);
        this.parent.off(events.filterOpen, this.columnMenuFilter);
        this.parent.off(events.filterMenuClose, this.filterMenuClose);
        this.parent.off(events.click, this.filterIconClickHandler);
    };
    Filter.prototype.filterMenuClose = function (args) {
        this.fltrDlgDetails.isOpen = false;
    };
    /**
     * Filters the Grid row by fieldName, filterOperator, and filterValue.
     * @param  {string} fieldName - Defines the field name of the filter column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value which is used to filter records.
     * @param  {string} predicate - Defines the relationship of one filter query with another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, then the filter records
     * the exact match or <br> filters records that are case insensitive (uppercase and lowercase letters treated the same).
     * @param {boolean} ignoreAccent - If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     * @return {void}
     */
    Filter.prototype.filterByColumn = function (fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator) {
        var gObj = this.parent;
        var filterCell;
        this.column = gObj.grabColumnByFieldFromAllCols(fieldName);
        if (this.filterSettings.type === 'FilterBar') {
            filterCell = gObj.getHeaderContent().querySelector('[id=\'' + this.column.field + '_filterBarcell\']');
        }
        if (!isNullOrUndefined(this.column.allowFiltering) && !this.column.allowFiltering) {
            this.parent.log('action_disabled_column', { moduleName: this.getModuleName(), columnName: this.column.headerText });
            return;
        }
        if (isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, {
                instance: this, handler: this.filterByColumn, arg1: fieldName, arg2: filterOperator, arg3: filterValue, arg4: predicate,
                arg5: matchCase, arg6: ignoreAccent, arg7: actualFilterValue, arg8: actualOperator
            });
            return;
        }
        this.value = filterValue;
        this.matchCase = matchCase || false;
        this.ignoreAccent = this.ignoreAccent = !isNullOrUndefined(ignoreAccent) ? ignoreAccent : this.parent.filterSettings.ignoreAccent;
        this.fieldName = fieldName;
        this.predicate = predicate || 'and';
        this.operator = filterOperator;
        filterValue = !isNullOrUndefined(filterValue) && filterValue.toString();
        if (this.column.type === 'number' || this.column.type === 'date') {
            this.matchCase = true;
        }
        gObj.getColumnHeaderByField(fieldName).setAttribute('aria-filtered', 'true');
        if (filterValue.length < 1 || this.checkForSkipInput(this.column, filterValue)) {
            this.filterStatusMsg = filterValue.length < 1 ? '' : this.l10n.getConstant('InvalidFilterMessage');
            this.updateFilterMsg();
            return;
        }
        if (filterCell && this.filterSettings.type === 'FilterBar' && filterCell.value !== filterValue) {
            filterCell.value = filterValue;
        }
        if (!isNullOrUndefined(this.column.format)) {
            this.applyColumnFormat(filterValue);
            if (this.initialLoad && this.filterSettings.type === 'FilterBar') {
                filterCell.value = this.values[this.column.field];
            }
        }
        else {
            this.values[this.column.field] = filterValue; //this line should be above updateModel
        }
        this.actualPredicate[this.fieldName] = [{
                field: this.fieldName,
                predicate: predicate,
                matchCase: matchCase,
                ignoreAccent: ignoreAccent,
                operator: this.operator,
                value: this.value,
                type: this.column.type
            }];
        this.addFilteredClass(this.fieldName);
        if (this.checkAlreadyColFiltered(this.column.field)) {
            return;
        }
        this.updateModel();
    };
    Filter.prototype.applyColumnFormat = function (filterValue) {
        var getFlvalue = (this.column.type === 'date' || this.column.type === 'datetime') ?
            new Date(filterValue) : parseFloat(filterValue);
        this.values[this.column.field] = this.setFormatForFlColumn(getFlvalue, this.column);
    };
    Filter.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        for (var _i = 0, _a = Object.keys(e.properties); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'columns':
                    if (this.contentRefresh) {
                        this.parent.notify(events.modelChanged, {
                            currentFilterObject: this.currentFilterObject, currentFilteringColumn: this.column ?
                                this.column.field : undefined,
                            columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionBegin
                        });
                        this.refreshFilterSettings();
                        this.updateFilterMsg();
                        this.updateFilter();
                    }
                    break;
                case 'showFilterBarStatus':
                    if (e.properties[prop]) {
                        this.updateFilterMsg();
                    }
                    else if (this.parent.allowPaging) {
                        this.parent.updateExternalMessage('');
                    }
                    break;
                case 'type':
                    this.parent.refreshHeader();
                    this.refreshFilterSettings();
                    break;
            }
        }
    };
    Filter.prototype.refreshFilterSettings = function () {
        if (this.filterSettings.type === 'FilterBar') {
            for (var i = 0; i < this.filterSettings.columns.length; i++) {
                this.column = this.parent.grabColumnByUidFromAllCols(this.filterSettings.columns[i].uid);
                var filterValue = this.filterSettings.columns[i].value;
                filterValue = !isNullOrUndefined(filterValue) && filterValue.toString();
                if (!isNullOrUndefined(this.column.format)) {
                    this.applyColumnFormat(filterValue);
                }
                else {
                    var key = this.filterSettings.columns[i].field;
                    this.values[key] = this.filterSettings.columns[i].value;
                }
                var filterElement = this.getFilterBarElement(this.column.field);
                if (filterElement) {
                    if (this.cellText[this.filterSettings.columns[i].field] !== ''
                        && !isNullOrUndefined(this.cellText[this.filterSettings.columns[i].field])) {
                        filterElement.value = this.cellText[this.column.field];
                    }
                    else {
                        filterElement.value = this.filterSettings.columns[i].value;
                    }
                }
            }
            if (this.filterSettings.columns.length === 0) {
                var col = this.parent.getColumns();
                for (var i = 0; i < col.length; i++) {
                    var filterElement = this.getFilterBarElement(col[i].field);
                    if (filterElement && filterElement.value !== '') {
                        filterElement.value = '';
                        delete this.values[col[i].field];
                    }
                }
            }
        }
    };
    Filter.prototype.getFilterBarElement = function (col) {
        var selector = '[id=\'' + col + '_filterBarcell\']';
        var filterElement;
        if (selector && !isNullOrUndefined(this.element)) {
            filterElement = this.element.querySelector(selector);
        }
        return filterElement;
    };
    /**
     * @private
     */
    Filter.prototype.refreshFilter = function () {
        this.refreshFilterSettings();
        this.updateFilterMsg();
    };
    /**
     * Clears all the filtered rows of the Grid.
     * @return {void}
     */
    Filter.prototype.clearFiltering = function () {
        var _this = this;
        var cols = getActualPropFromColl(this.filterSettings.columns);
        if (isActionPrevent(this.parent)) {
            this.parent.notify(events.preventBatch, { instance: this, handler: this.clearFiltering });
            return;
        }
        cols.forEach(function (col) {
            col.uid = col.uid || _this.parent.getColumnByField(col.field).uid;
        });
        var colUid = cols.map(function (f) { return f.uid; });
        var filteredcols = colUid.filter(function (item, pos) { return colUid.indexOf(item) === pos; });
        this.refresh = false;
        for (var i = 0, len = filteredcols.length; i < len; i++) {
            this.removeFilteredColsByField(this.parent.getColumnByUid(filteredcols[i]).field, false);
        }
        if (isBlazor() && !this.parent.isJsComponent) {
            this.filterSettings.columns = this.filterSettings.columns;
        }
        this.refresh = true;
        if (filteredcols.length) {
            this.parent.renderModule.refresh();
        }
        if (this.parent.filterSettings.columns.length === 0 && this.parent.element.querySelector('.e-filtered')) {
            var fltrElement = [].slice.call(this.parent.element.querySelectorAll('.e-filtered'));
            for (var i = 0, len = fltrElement.length; i < len; i++) {
                fltrElement[0].removeAttribute('aria-filtered');
                fltrElement[0].classList.remove('e-filtered');
            }
        }
        this.isRemove = true;
        this.filterStatusMsg = '';
        this.updateFilterMsg();
    };
    Filter.prototype.checkAlreadyColFiltered = function (field) {
        var columns = this.filterSettings.columns;
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var col = columns_1[_i];
            if (col.field === field && col.value === this.value &&
                col.operator === this.operator && col.predicate === this.predicate) {
                return true;
            }
        }
        return false;
    };
    Filter.prototype.columnMenuFilter = function (args) {
        this.column = args.col;
        var ele = closest(args.target, '#' + args.id);
        if (args.isClose && !ele) {
            this.filterModule.closeDialog();
        }
        else if (ele) {
            this.filterDialogOpen(this.column, args.target);
        }
    };
    Filter.prototype.filterDialogOpen = function (col, target, left, top) {
        var gObj = this.parent;
        if (this.filterModule) {
            this.filterModule.closeDialog();
        }
        this.filterModule = new this.type[col.filter.type || this.parent.filterSettings.type](this.parent, gObj.filterSettings, this.serviceLocator, this.customOperators, this);
        var dataSource = col.filter.dataSource || gObj.getDataModule().dataManager;
        this.filterModule.openDialog({
            type: col.type, field: col.field, displayName: col.headerText,
            dataSource: dataSource, format: col.format, height: 800, columns: gObj.getColumns(),
            filteredColumns: gObj.filterSettings.columns, target: target, dataManager: gObj.getDataModule().dataManager,
            formatFn: col.getFormatter(), ignoreAccent: gObj.filterSettings.ignoreAccent,
            parserFn: col.getParser(), query: gObj.query, template: col.getFilterItemTemplate(),
            hideSearchbox: isNullOrUndefined(col.filter.hideSearchbox) ? false : col.filter.hideSearchbox,
            handler: this.filterHandler.bind(this), localizedStrings: gObj.getLocaleConstants(),
            position: { X: left, Y: top }, column: col, foreignKeyValue: col.foreignKeyValue,
            actualPredicate: this.actualPredicate, localeObj: gObj.localeObj,
            isRemote: gObj.getDataModule().isRemote(), allowCaseSensitive: this.filterSettings.enableCaseSensitivity
        });
    };
    /**
     * Removes filtered column by field name.
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @return {void}
     * @hidden
     */
    Filter.prototype.removeFilteredColsByField = function (field, isClearFilterBar) {
        var fCell;
        var cols = this.filterSettings.columns;
        if (isActionPrevent(this.parent)) {
            var args = { instance: this, handler: this.removeFilteredColsByField, arg1: field, arg2: isClearFilterBar };
            this.parent.notify(events.preventBatch, args);
            return;
        }
        var colUid = cols.map(function (f) { return f.uid; });
        var filteredColsUid = colUid.filter(function (item, pos) { return colUid.indexOf(item) === pos; });
        for (var i = 0, len = filteredColsUid.length; i < len; i++) {
            cols[i].uid = cols[i].uid || this.parent.getColumnByField(cols[i].field).uid;
            var len_1 = cols.length;
            var column = this.parent.grabColumnByUidFromAllCols(filteredColsUid[i]);
            if (column.field === field || (column.field === column.foreignKeyValue && column.isForeignColumn())) {
                if (this.filterSettings.type === 'FilterBar' && !isClearFilterBar) {
                    var selector = '[id=\'' + column.field + '_filterBarcell\']';
                    fCell = this.parent.getHeaderContent().querySelector(selector);
                    if (fCell) {
                        fCell.value = '';
                        delete this.values[field];
                    }
                }
                while (len_1--) {
                    if (cols[len_1].uid === column.uid) {
                        cols.splice(len_1, 1);
                    }
                }
                var fltrElement = this.parent.getColumnHeaderByField(column.field);
                fltrElement.removeAttribute('aria-filtered');
                if (this.filterSettings.type !== 'FilterBar') {
                    var iconClass = this.parent.showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
                    fltrElement.querySelector(iconClass).classList.remove('e-filtered');
                }
                this.isRemove = true;
                if (this.actualPredicate[field]) {
                    delete this.actualPredicate[field];
                }
                if (this.values[field]) {
                    delete this.values[field];
                }
                if (this.refresh) {
                    this.parent.notify(events.modelChanged, {
                        requestType: 'filtering', type: events.actionBegin, currentFilterObject: {
                            field: column.field, operator: this.operator, value: this.value, predicate: this.predicate,
                            matchCase: this.matchCase, ignoreAccent: this.ignoreAccent, actualFilterValue: {}, actualOperator: {}
                        }, currentFilterColumn: column
                    });
                }
                break;
            }
        }
        this.updateFilterMsg();
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Filter.prototype.getModuleName = function () {
        return 'filter';
    };
    Filter.prototype.keyUpHandler = function (e) {
        var gObj = this.parent;
        var target = e.target;
        if (target && matches(target, '.e-filterbar input')) {
            var closeHeaderEle = closest(target, 'th.e-filterbarcell');
            this.column = gObj.getColumnByUid(closeHeaderEle.getAttribute('e-mappinguid'));
            if (!this.column) {
                return;
            }
            if ((this.filterSettings.mode === 'Immediate' || e.keyCode === 13) && e.keyCode !== 9) {
                this.value = target.value.trim();
                this.processFilter(e);
            }
        }
        if (e.action === 'altDownArrow' && this.filterSettings.type !== 'FilterBar') {
            var element = gObj.focusModule.currentInfo.element;
            if (element && element.classList.contains('e-headercell')) {
                var column = gObj.getColumnByUid(element.firstElementChild.getAttribute('e-mappinguid'));
                this.openMenuByField(column.field);
                this.parent.focusModule.clearIndicator();
            }
        }
        if (e.action === 'escape' && this.filterSettings.type === 'Menu') {
            this.filterModule.closeDialog();
            gObj.notify(events.restoreFocus, {});
        }
    };
    Filter.prototype.updateCrossIcon = function (element) {
        if (element.value.length) {
            element.nextElementSibling.classList.remove('e-hide');
        }
    };
    Filter.prototype.updateFilterMsg = function () {
        if (this.filterSettings.type === 'FilterBar') {
            var gObj = this.parent;
            var getFormatFlValue = void 0;
            var columns = this.filterSettings.columns;
            var formater = this.serviceLocator.getService('valueFormatter');
            var column = void 0;
            var value = void 0;
            if (!this.filterSettings.showFilterBarStatus) {
                return;
            }
            if (columns.length > 0 && this.filterStatusMsg !== this.l10n.getConstant('InvalidFilterMessage')) {
                this.filterStatusMsg = '';
                for (var index = 0; index < columns.length; index++) {
                    column = gObj.grabColumnByUidFromAllCols(columns[index].uid) || gObj.grabColumnByFieldFromAllCols(columns[index].field);
                    if (index) {
                        this.filterStatusMsg += ' && ';
                    }
                    if (!isNullOrUndefined(column.format)) {
                        var flValue = (column.type === 'date' || column.type === 'datetime') ?
                            this.valueFormatter.fromView(this.values[column.field], column.getParser(), column.type) :
                            this.values[column.field];
                        if (!(column.type === 'date' || column.type === 'datetime')) {
                            var formater_1 = this.serviceLocator.getService('valueFormatter');
                            getFormatFlValue = formater_1.toView(flValue, column.getParser()).toString();
                        }
                        else {
                            getFormatFlValue = this.setFormatForFlColumn(flValue, column);
                        }
                        this.filterStatusMsg += column.headerText + ': ' + getFormatFlValue;
                    }
                    else {
                        this.filterStatusMsg += column.headerText + ': ' + this.values[column.field];
                    }
                }
            }
            if (gObj.allowPaging) {
                gObj.updateExternalMessage(this.filterStatusMsg);
            }
            //TODO: virtual paging       
            this.filterStatusMsg = '';
        }
    };
    Filter.prototype.setFormatForFlColumn = function (value, column) {
        var formater = this.serviceLocator.getService('valueFormatter');
        return formater.toView(value, column.getFormatter()).toString();
    };
    Filter.prototype.checkForSkipInput = function (column, value) {
        var isSkip;
        if (column.type === 'number') {
            if (DataUtil.operatorSymbols[value] || this.skipNumberInput.indexOf(value) > -1) {
                isSkip = true;
            }
        }
        else if (column.type === 'string') {
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var val = value_1[_i];
                if (this.skipStringInput.indexOf(val) > -1) {
                    isSkip = true;
                }
            }
        }
        return isSkip;
    };
    Filter.prototype.processFilter = function (e) {
        this.stopTimer();
        this.startTimer(e);
    };
    Filter.prototype.startTimer = function (e) {
        var _this = this;
        this.timer = window.setInterval(function () { _this.onTimerTick(); }, e.keyCode === 13 ? 0 : this.filterSettings.immediateModeDelay);
    };
    Filter.prototype.stopTimer = function () {
        window.clearInterval(this.timer);
    };
    Filter.prototype.onTimerTick = function () {
        var selector = '[id=\'' + this.column.field + '_filterBarcell\']';
        var filterElement = this.element.querySelector(selector);
        if (!filterElement && this.parent.getFrozenColumns()) {
            filterElement = this.parent.getHeaderContent().querySelector(selector);
        }
        var filterValue;
        this.cellText[this.column.field] = filterElement.value;
        this.stopTimer();
        if (!isNullOrUndefined(this.column.filterBarTemplate)) {
            var templateRead = this.column.filterBarTemplate.read;
            if (typeof templateRead === 'string') {
                templateRead = getValue(templateRead, window);
            }
            if (!isNullOrUndefined(templateRead)) {
                this.value = templateRead.call(this, filterElement);
            }
        }
        else {
            filterValue = JSON.parse(JSON.stringify(filterElement.value));
        }
        if (isNullOrUndefined(this.value) || this.value === '') {
            this.removeFilteredColsByField(this.column.field);
            if (isBlazor() && !this.parent.isJsComponent) {
                this.filterSettings.columns = this.filterSettings.columns;
            }
            return;
        }
        this.validateFilterValue(this.value);
        this.filterByColumn(this.column.field, this.operator, this.value, this.predicate, this.filterSettings.enableCaseSensitivity, this.ignoreAccent);
        filterElement.value = filterValue;
        this.updateFilterMsg();
    };
    Filter.prototype.validateFilterValue = function (value) {
        var gObj = this.parent;
        var skipInput;
        var index;
        this.matchCase = this.filterSettings.enableCaseSensitivity;
        switch (this.column.type) {
            case 'number':
                if (this.column.filter.operator) {
                    this.operator = this.column.filter.operator;
                }
                else {
                    this.operator = this.filterOperators.equal;
                }
                skipInput = ['>', '<', '=', '!'];
                for (var i = 0; i < value.length; i++) {
                    if (skipInput.indexOf(value[i]) > -1) {
                        index = i;
                        break;
                    }
                }
                this.getOperator(value.substring(index));
                if (index !== 0) {
                    this.value = value.substring(0, index);
                }
                if (this.value !== '' && value.length >= 1) {
                    this.value = this.valueFormatter.fromView(this.value, this.column.getParser(), this.column.type);
                }
                if (isNaN(this.value)) {
                    this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                }
                break;
            case 'date':
            case 'datetime':
                this.operator = this.filterOperators.equal;
                if (this.value !== '' && !(this.value instanceof Date)) {
                    this.getOperator(value);
                    this.value = this.valueFormatter.fromView(this.value, this.column.getParser(), this.column.type);
                    if (isNullOrUndefined(this.value)) {
                        this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                    }
                }
                break;
            case 'string':
                this.matchCase = false;
                if (value.charAt(0) === '*') {
                    this.value = this.value.slice(1);
                    this.operator = this.filterOperators.startsWith;
                }
                else if (value.charAt(value.length - 1) === '%') {
                    this.value = this.value.slice(0, -1);
                    this.operator = this.filterOperators.startsWith;
                }
                else if (value.charAt(0) === '%') {
                    this.value = this.value.slice(1);
                    this.operator = this.filterOperators.endsWith;
                }
                else {
                    if (this.column.filter.operator) {
                        this.operator = this.column.filter.operator;
                    }
                    else {
                        this.operator = this.filterOperators.startsWith;
                    }
                }
                break;
            case 'boolean':
                if (value.toLowerCase() === 'true' || value === '1') {
                    this.value = true;
                }
                else if (value.toLowerCase() === 'false' || value === '0') {
                    this.value = false;
                }
                else if (value.length) {
                    this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                }
                this.operator = this.filterOperators.equal;
                break;
            default:
                if (this.column.filter.operator) {
                    this.operator = this.column.filter.operator;
                }
                else {
                    this.operator = this.filterOperators.equal;
                }
        }
    };
    Filter.prototype.getOperator = function (value) {
        var singleOp = value.charAt(0);
        var multipleOp = value.slice(0, 2);
        var operators = extend({ '=': this.filterOperators.equal, '!': this.filterOperators.notEqual }, DataUtil.operatorSymbols);
        if (operators.hasOwnProperty(singleOp) || operators.hasOwnProperty(multipleOp)) {
            this.operator = operators[singleOp];
            this.value = value.substring(1);
            if (!this.operator) {
                this.operator = operators[multipleOp];
                this.value = value.substring(2);
            }
        }
        if (this.operator === this.filterOperators.lessThan || this.operator === this.filterOperators.greaterThan) {
            if (this.value.charAt(0) === '=') {
                this.operator = this.operator + 'orequal';
                this.value = this.value.substring(1);
            }
        }
    };
    Filter.prototype.columnPositionChanged = function (e) {
        if (this.parent.filterSettings.type !== 'FilterBar') {
            return;
        }
    };
    Filter.prototype.getLocalizedCustomOperators = function () {
        var numOptr = [
            { value: 'equal', text: this.l10n.getConstant('Equal') },
            { value: 'greaterthan', text: this.l10n.getConstant('GreaterThan') },
            { value: 'greaterthanorequal', text: this.l10n.getConstant('GreaterThanOrEqual') },
            { value: 'lessthan', text: this.l10n.getConstant('LessThan') },
            { value: 'lessthanorequal', text: this.l10n.getConstant('LessThanOrEqual') },
            { value: 'notequal', text: this.l10n.getConstant('NotEqual') }
        ];
        this.customOperators = {
            stringOperator: [
                { value: 'startswith', text: this.l10n.getConstant('StartsWith') },
                { value: 'endswith', text: this.l10n.getConstant('EndsWith') },
                { value: 'contains', text: this.l10n.getConstant('Contains') },
                { value: 'equal', text: this.l10n.getConstant('Equal') },
                { value: 'notequal', text: this.l10n.getConstant('NotEqual') }
            ],
            numberOperator: numOptr,
            dateOperator: numOptr,
            datetimeOperator: numOptr,
            booleanOperator: [
                { value: 'equal', text: this.l10n.getConstant('Equal') },
                { value: 'notequal', text: this.l10n.getConstant('NotEqual') }
            ]
        };
    };
    ;
    /** @hidden */
    Filter.prototype.openMenuByField = function (field) {
        var gObj = this.parent;
        var column = gObj.getColumnByField(field);
        var header = gObj.getColumnHeaderByField(field);
        var target = header.querySelector('.e-filtermenudiv');
        if (!target) {
            return;
        }
        var gClient = gObj.element.getBoundingClientRect();
        var fClient = target.getBoundingClientRect();
        this.filterDialogOpen(column, target, fClient.right - gClient.left, fClient.bottom - gClient.top);
    };
    Filter.prototype.filterIconClickHandler = function (e) {
        var target = e.target;
        if (target.classList.contains('e-filtermenudiv') && (this.parent.filterSettings.type === 'Menu' ||
            this.parent.filterSettings.type === 'CheckBox' || this.parent.filterSettings.type === 'Excel')) {
            var gObj = this.parent;
            var col = gObj.getColumnByUid(parentsUntil(target, 'e-headercell').firstElementChild.getAttribute('e-mappinguid'));
            this.column = col;
            if (this.fltrDlgDetails.field === col.field && this.fltrDlgDetails.isOpen) {
                return;
            }
            if (this.filterModule) {
                this.filterModule.closeDialog();
            }
            this.fltrDlgDetails = { field: col.field, isOpen: true };
            this.openMenuByField(col.field);
        }
    };
    Filter.prototype.clickHandler = function (e) {
        if (this.filterSettings.mode === 'Immediate' || this.parent.filterSettings.type === 'Menu' ||
            this.parent.filterSettings.type === 'CheckBox' || this.parent.filterSettings.type === 'Excel') {
            var gObj = this.parent;
            var target = e.target;
            var datepickerEle = target.classList.contains('e-day'); // due to datepicker popup cause
            var dialog = parentsUntil(this.parent.element, 'e-dialog');
            var hasDialog = false;
            var popupEle = parentsUntil(target, 'e-popup');
            if (dialog && popupEle) {
                hasDialog = dialog.id === popupEle.id;
            }
            if (parentsUntil(target, 'e-filter-popup') || target.classList.contains('e-filtermenudiv')) {
                return;
            }
            else if (this.filterModule && (!parentsUntil(target, 'e-popup-wrapper')
                && (!closest(target, '.e-filter-item.e-menu-item'))) && !datepickerEle) {
                if ((hasDialog && (!parentsUntil(target, 'e-filter-popup'))
                    && (!parentsUntil(target, 'e-popup-flmenu'))) || (!popupEle)) {
                    this.filterModule.closeDialog(target);
                }
            }
            if (this.filterSettings.mode === 'Immediate' && target.classList.contains('e-clear-icon')) {
                var targetText = target.previousElementSibling;
                this.removeFilteredColsByField(targetText.id.slice(0, -14)); //Length of _filterBarcell = 14
            }
        }
    };
    Filter.prototype.filterHandler = function (args) {
        var filterIconElement;
        this.actualPredicate[args.field] = args.actualPredicate;
        var dataManager = new DataManager(this.filterSettings.columns);
        var query = new Query().where('field', this.filterOperators.equal, args.field);
        var result = dataManager.executeLocal(query);
        for (var i = 0; i < result.length; i++) {
            var index = -1;
            for (var j = 0; j < this.filterSettings.columns.length; j++) {
                if (result[i].field === this.filterSettings.columns[j].field) {
                    index = j;
                    break;
                }
            }
            if (index !== -1) {
                this.filterSettings.columns.splice(index, 1);
            }
        }
        if (args.action === 'clear-filter' && isBlazor() && !this.parent.isJsComponent) {
            this.filterSettings.columns = this.filterSettings.columns;
        }
        if (this.values[args.field]) {
            delete this.values[args.field];
        }
        var iconClass = this.parent.showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
        filterIconElement = this.parent.getColumnHeaderByField(args.field).querySelector(iconClass);
        if (args.action === 'filtering') {
            this.filterSettings.columns = this.filterSettings.columns.concat(args.filterCollection);
            if (this.filterSettings.columns.length && filterIconElement) {
                filterIconElement.classList.add('e-filtered');
            }
        }
        else {
            if (filterIconElement) {
                filterIconElement.classList.remove('e-filtered');
            }
            this.parent.renderModule.refresh(); //hot-fix onpropertychanged not working for object { array }           
        }
        this.parent.dataBind();
    };
    Filter.prototype.updateFilter = function () {
        var cols = this.filterSettings.columns;
        this.actualPredicate = {};
        for (var i = 0; i < cols.length; i++) {
            this.column = this.parent.getColumnByField(cols[i].field) ||
                getColumnByForeignKeyValue(cols[i].field, this.parent.getForeignKeyColumns());
            var fieldName = cols[i].field;
            if (!this.parent.getColumnByField(cols[i].field)) {
                fieldName = getColumnByForeignKeyValue(cols[i].field, this.parent.getForeignKeyColumns()).field;
            }
            /* tslint:disable-next-line:max-line-length */
            this.refreshFilterIcon(fieldName, cols[i].operator, cols[i].value, cols[i].type, cols[i].predicate, cols[i].matchCase, cols[i].ignoreAccent, cols[i].uid);
        }
    };
    /* tslint:disable-next-line:max-line-length */
    Filter.prototype.refreshFilterIcon = function (fieldName, operator, value, type, predicate, matchCase, ignoreAccent, uid) {
        var obj;
        obj = {
            field: fieldName,
            predicate: predicate,
            matchCase: matchCase,
            ignoreAccent: ignoreAccent,
            operator: operator,
            value: value,
            type: type
        };
        this.actualPredicate[fieldName] ? this.actualPredicate[fieldName].push(obj) : this.actualPredicate[fieldName] = [obj];
        var field = uid ? this.parent.grabColumnByUidFromAllCols(uid).field : fieldName;
        this.addFilteredClass(field);
    };
    Filter.prototype.addFilteredClass = function (fieldName) {
        var filterIconElement;
        if (this.parent.showColumnMenu) {
            filterIconElement = this.parent.getColumnHeaderByField(fieldName).querySelector('.e-columnmenu');
        }
        else if (this.parent.getColumnByField(fieldName)) {
            filterIconElement = this.parent.getColumnHeaderByField(fieldName).querySelector('.e-icon-filter');
        }
        if (filterIconElement) {
            filterIconElement.classList.add('e-filtered');
        }
    };
    return Filter;
}());
export { Filter };
