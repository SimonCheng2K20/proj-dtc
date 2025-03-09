/*
subect:簡易的組態設定集合
create:20191003, Pollux
update:
-	20191003 Pollux, create
-	20191025 Pollux, 加入 hotkey 辨識及處理所需常數
usages:
	// 載入組態設定
	import * as configs from '@/config'
	// 使用常數
	let BaseURL = configs.APIBaseUrl
*/
/* eslint-disable no-console */
// 是否為開發環境?
export const Mode4Dev = process.env.NODE_ENV !== 'production'
// RESTful API base URL, 得依: 正式環境 及 開發環境 給定不同的值
export const APIBaseUrl = process.env.NODE_ENV === 'production' ? 'https://dtcwcf01.azurewebsites.net/api' : 'https://dtcwcf01.azurewebsites.net/api'
//port const APIBaseUrl = 'https://dtcwcf01.azurewebsites.net/api'
export const publicPath = process.env.BASE_URL
export const hubUrl = process.env.NODE_ENV === 'production' ? $setting.apiHost : 'http://192.168.1.200' + $setting.apiHost
//: 'http://localhost:14722'
// hotkey 辨識及處理
export const KeyCode4Control = 'KC.'
export const KeyCode4Alternate = 'KA.'
export const KeyCode4Shift = 'KS.'

// Theme pack keywords
export const ThemeId4Black = 'themeBlack'

// VueX
export const XUserAuthorized = 'UserAuthorized'

// JWT
export const JWTTokenName = 'JWTToke'
// login page
export const RouteName4LogInPage = '/Login'

export const TimeOut = 80 * 60 // 單位秒
