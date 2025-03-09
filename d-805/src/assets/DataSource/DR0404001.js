/* eslint-disable no-console */
/* datasource: DR.04.04.001 - 檢查室清單 */
const dataCollection = [
	{ value: 1, text: 'CR001' },
	{ value: 2, text: 'CR002' },
	{ value: 3, text: 'CR003' },
]

export let
	Options = () => {
		var collections = [{ value: null, text: '請選擇' },]
		dataCollection.forEach(e => { collections.push(e) })
		return collections
	}
