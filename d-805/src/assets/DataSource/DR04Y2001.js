/* eslint-disable no-console */
/* datasource: DR.04.Y2.001 - 過敏記錄 ~ 各式顯影劑 */
const configCollection = [
	{ key: 'RDate', label: '登錄日期', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap" },
	{ key: 'Agent', label: '顯影劑', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap font-weight-bold text-left" },
	{ key: 'Severity', label: '嚴重度', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap font-weight-bold" },
]
const dataCollection = [
	{ guid: '1234567893', RDate: '108/06/25', Agent: '非離子性二聚體型', Severity: 'none' },
	{ guid: '1234567892', RDate: '108/06/15', Agent: '非離子性單體型', Severity: 'none' },
	{ guid: '1234567891', RDate: '108/06/10', Agent: '離子性二聚體型', Severity: 'mild', _rowVariant: 'warning' },
	{ guid: '1234567890', RDate: '108/06/05', Agent: '離子性單體型', Severity: 'mild', _rowVariant: 'warning' },
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
