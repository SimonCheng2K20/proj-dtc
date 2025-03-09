/* eslint-disable no-console */
/*
//	TestSubjects.js
//	20191031.0859 Pollux, 這是用來做些測試的, 並非系統功能
// usage:
//	import * as util from '@/assets/TestSubjects'
//	或
//	let util = require('@/assets/TestSubjects')
*/

function IsTargetExists(e) { return typeof e !== 'undefined'}

export let Exists = (e) => IsTargetExists(e),
	Testing = (e) => {
		if(e && e.$parent) {
			let level = 1
			let i = e.$parent
			while(i && !i.WaitingShow) {
				level ++
				if(i.$parent) {
					i = i.$parent
				} else {
					i = null
					break
				}
			}
			return i === null ? i : [i, level]
		}
		return null
	}