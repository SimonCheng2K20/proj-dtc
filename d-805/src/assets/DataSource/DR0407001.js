/* eslint-disable no-console */
/* datasource: DR.04.07.001 - 檢查項目 */
const dataCollection = [
	{ value: 1, text: 'XXXX檢驗' },
	{ value: 2, text: 'YYYY檢驗' },
	{ value: 3, text: 'ZZZZ檢驗' },
]

export let
	Options = () => {
		var collections = [{ value: null, text: '請選擇' },]
		dataCollection.forEach(e => { collections.push(e) })
		return collections
	},
	GetText = (v) => {
		var result = ''
		if(v) {
			dataCollection.forEach(e => {
				if(e.value === v) {
					result = e.text
				}
			})
		}
		return result
	}
