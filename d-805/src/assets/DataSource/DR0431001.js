/* eslint-disable no-console */
/* datasource: DR.04.31.001 - 報告及病患來源 */
const dataCollection = [
	{ value: 1, text: '急診' },
	{ value: 2, text: '住院' },
	{ value: 3, text: '門診' },
	{ value: 4, text: '健檢' },
	{ value: 5, text: '轉診' },
	{ value: 6, text: '轉檢' },
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
