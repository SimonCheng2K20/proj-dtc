/* eslint-disable no-console */
/* datasource: DR.04.Y1.001 - 檢驗報告 */
const configCollection = [
	{ key: 'LDate', label: '檢查日期', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap" },
	{ key: 'eGFR', label: 'eGFR', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap font-weight-bold" },
	{ key: 'FreeT4', label: 'Free-T4', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap font-weight-bold" },
]
const dataCollection = [
	{ guid: '1234567893', LDate: '108/07/25', eGFR: '90 mL/min/1.73m2', FreeT4: '0.70 ng/dL' },
	{ guid: '1234567892', LDate: '108/07/15', eGFR: '92 mL/min/1.73m2', FreeT4: '0.71 ng/dL' },
	{ guid: '1234567891', LDate: '108/06/10', eGFR: '', FreeT4: '2.61 ng/dL', _rowVariant: 'danger' },
	{ guid: '1234567890', LDate: '108/06/01', eGFR: '59 mL/min/1.73m2', FreeT4: '', _rowVariant: 'danger' },
]

export let PresentConfig = function() { return configCollection },
	DataSet = function() { return dataCollection },
	DataRow = (guid) => {
		var collections = []
		if(guid) {
			dataCollection.forEach(e => {
				if(e.guid === guid) {
					collections.push(e)
				}
			})
		}
		return collections
	}
