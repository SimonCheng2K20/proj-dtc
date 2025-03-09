/* eslint-disable no-console */
/* datasource: DR.04.08.001 - 檢查用藥品及耗材 */
const dc4DR0408001 = [
	{ guid: '1234567890', mCategory: 1, hcId: 'HCDRA00001', icId: 'RAVCUG0001', name: '非離子性二聚體型顯影劑', elId: 1, dosage: 15, unit: 'ml', dose: 1 },
	{ guid: '1234567891', mCategory: 2, hcId: 'HCSRM00001', icId: 'SMVCUG0001', name: '非離子性二聚體型顯影劑皮下注射組', elId: 1, dosage: 1, unit: 'set', dose: 1 },
	{ guid: '1234567895', mCategory: 2, hcId: 'HCSRM00004', icId: 'SMVCUG0004', name: '消毒紗布 6X6', elId: 1, dosage: 1, unit: 'set', dose: 1 },
	{ guid: '1234567892', mCategory: 1, hcId: 'HCDRA00002', icId: 'RAVCUG0002', name: '非離子性單體型顯影劑', elId: 3, dosage: 10, unit: 'ml', dose: 1 },
	{ guid: '1234567893', mCategory: 2, hcId: 'HCSRM00002', icId: 'SMVCUG0002', name: '非離子性單體型顯影劑皮下注射組', elId: 3, dosage: 1, unit: 'set', dose: 1 },
	{ guid: '1234567894', mCategory: 2, hcId: 'HCSRM00003', icId: 'SMVCUG0003', name: '消毒紗布 9X9', elId: 3, dosage: 1, unit: 'set', dose: 1 },
]

function NameComposer(e) {
	if(e) {
		return `${e.name}/${e.dosage} ${e.unit} x ${e.dose}`
	}
}

export let
	Options = (elId = 1) => {
		//console.log(`DR0408001:Options`)
		var collections = [{ value: null, text: '請選擇' },]
		dc4DR0408001.forEach(e => {
			if(e.elId === elId) {
				collections.push({
					value: e.guid,
					text: NameComposer(e),
				})
			}
		})
		return collections
	},
	GetText = (v, elId = 1) => {
		//console.log(`DR0408001:GetText`)
		var result = ''
		if(v) {
			dc4DR0408001.forEach(e => {
				if(e.guid === v && e.elId === elId) {
					result = NameComposer(e)
				}
			})
		}
		return result
	},
	GetRow = (v) => {
		//console.log(`DR0408001:GetRow`)
		//console.log(`DR0408001:GetRow:BOF`)
		var result = []
		if(v) {
			dc4DR0408001.some(e => {
				//console.log(Object.keys(e).sort().toString())
				if(e.guid === v) {
					//
					// Object's Shallow Copy -> by reference
					//let item = e
					// Object's Deep Copy:
					// - ES6, 只能處理一層
					//let item = Object.assign({}, e)
					// - JSON, 只能單純是資料的才可以
					let item = JSON.parse(JSON.stringify(e))
					//
					item.Category = e.mCategory === 1 ? '藥品' : '耗材'
					result.push(item)
					return true
				}
			})
		}
		//console.log(`DR0408001:GetRow:EOF`)
		return result
	}
