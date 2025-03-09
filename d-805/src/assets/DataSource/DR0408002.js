/* eslint-disable no-console */
/* datasource: DR.04.08.002 - 檢查用藥品及耗材 ~ 資料表格 */
const configCollection = [
	{ key: 'tdId', label: '項次', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap text-right" },
	{ key: 'Category', label: '類別', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap" },
	{ key: 'hcId', label: '健保代號', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap font-weight-bold" },
	{ key: 'icId', label: '院內編號', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap font-weight-bold" },
	{ key: 'name', label: '項目名稱', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap text-left" },
	{ key: 'dosage', label: '劑量', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap font-weight-bold text-right" },
	{ key: 'unit', label: '單位', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap" },
	{ key: 'dose', label: '數量', sortable: false, thClass: "text-nowrap", tdClass: "text-nowrap font-weight-bold text-right" },
]
const dataCollection = [
	{ xuid: 'A1', guid: '1234567890', pId: 'A123456789', tdId: 1, mCategory: 1, hcId: 'HCDRA00001', icId: 'RAVCUG0001', name: '非離子性二聚體型顯影劑', elId: 1, dosage: 15, unit: 'ml', dose: 1 },
	{ xuid: 'A2', guid: '1234567891', pId: 'A123456789', tdId: 2, mCategory: 2, hcId: 'HCSRM00001', icId: 'SMVCUG0001', name: '非離子性二聚體型顯影劑皮下注射組', elId: 1, dosage: 1, unit: 'set', dose: 1 },
	{ xuid: 'A3', guid: '1234567892', pId: 'B223456789', tdId: 1, mCategory: 1, hcId: 'HCDRA00002', icId: 'RAVCUG0002', name: '非離子性單體型顯影劑', elId: 3, dosage: 10, unit: 'ml', dose: 1 },
	{ xuid: 'A4', guid: '1234567893', pId: 'B223456789', tdId: 2, mCategory: 2, hcId: 'HCSRM00002', icId: 'SMVCUG0002', name: '非離子性單體型顯影劑皮下注射組', elId: 3, dosage: 1, unit: 'set', dose: 1 },
]

export let PresentConfig = function() { return configCollection },
	DataSet = function(pId) {
		var collections = []
		dataCollection.forEach(e => {
			if(e.pId === pId) {
				var item = JSON.parse(JSON.stringify(e))
				item.Category = e.mCategory === 1 ? '藥品' : '耗材'
				collections.push(item)
			}
		})
		return collections
	},
	DataRow = (guid) => {
		var collections = []
		if(guid) {
			dataCollection.forEach(e => {
				if(e.guid === guid) {
					var item = JSON.parse(JSON.stringify(e))
					item.Category = e.mCategory === 1 ? '藥品' : '耗材'
					collections.push(item)
				}
			})
		}
		return collections
	}
