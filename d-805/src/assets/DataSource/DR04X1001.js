/* eslint-disable no-console */
/* datasource: DR.04.X1.001 - 作業進度 */
const dataCollection = [
	{ value: 11, text: '尚未開單' },
	{ value: 12, text: '尚未排檢(已開單)' },
	{ value: 21, text: '預約排檢' },
	{ value: 22, text: '現場排檢' },
	{ value: 31, text: '櫃台報到' },
	{ value: 41, text: '檢查報到' },
	{ value: 51, text: '檢查中' },
	{ value: 61, text: '檢查完畢' },
	{ value: 71, text: '取消預約' },
	{ value: 72, text: '取消櫃台報到' },
	{ value: 73, text: '取消檢查室報到' },
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
