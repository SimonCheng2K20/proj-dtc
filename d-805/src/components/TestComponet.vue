<template>
	<div>
		您好, 我是測試元件 TestComponet.
	</div>
</template>

<script>
export default {
	name: 'TestComponet',
	data() { return {
		ObjApp: null,
	}},
	methods: {
		WaitingFlash(flag = true) {
			console.log(this.$logs())
			if(this.ObjApp) {
				if(flag) {
					this.ObjApp.WaitingShow()
				} else {
					this.ObjApp.WaitingHide()
				}
			} else {
				console.log('this.ObjApp NOT available!')
			}
		},
	},
	created() {
		console.log(this.$logs())
		//console.log(this.$parent.WaitingShow ? 'EXIST' : 'NONE')
		//console.log(this.$parent.$parent.WaitingShow ? 'EXIST' : 'NONE')
		//
		let cnt = 0
		let obj = this.$parent
		let stop = false
		while(obj && !obj.WaitingShow) {
			cnt ++
			console.log(cnt)
			obj = obj.$parent
		}
		if(obj) {
			this.ObjApp = obj
			console.log('about to show')
			obj.WaitingShow()
		}
	},
	mounted() {
		console.log(this.$logs())
		//console.log(this.$parent.WaitingShow ? 'EXIST' : 'NONE')
		//console.log(this.$parent.$parent.WaitingShow ? 'EXIST' : 'NONE')
		//
		let cnt = 0
		let obj = this.$parent
		let stop = false
		while(obj && !obj.WaitingShow) {
			cnt ++
			console.log(cnt)
			obj = obj.$parent
		}
		if(obj) {
			console.log('about to hide')
			obj.WaitingHide()
		}
		//
		this.WaitingFlash()
		this.WaitingFlash(false)
	},
}
</script>