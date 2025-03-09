/* eslint-disable no-console */
/*
// KeyPressIdentifier.js
subect:
create:20191031.1329 Pollux
update:
-	20191031 Pollux, create
usages:
	// 載入組態設定
	import KeyPressIdentifier from '@/assets/KeyPressIdentifier'
	// 使用
	let keyCombine = KeyPressIdentifier(event[, debugMode:true/false])
remark:
-	將本函數從 FI0301-報告撰寫 中獨立出來, 以利閱讀及維護
*/

// 載入組態設定模組
import * as configs from "@/config";

// 取得相關設定(這裡是 KeyCode 字串常數)
const KeyCode4Control = configs.KeyCode4Control;
const KeyCode4Alternate = configs.KeyCode4Alternate;
const KeyCode4Shift = configs.KeyCode4Shift;

function KeyPressIdentifier(e, debugMode = false) {
  // 轉換鍵盤按鍵為自訂字串以供後續辨識

  //
  // 關於 HotKey 辨識:
  //
  // KeyboardEvent > [https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent]
  // e.location > [https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/room]
  // e.code > [https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code] >> Edge, IE 不支援
  // e.keyCode > !! Deprecated !! > [https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode]
  //
  // 當 e.key === 'Process' 表示處於中文輸入法之中(即:非英文模式)
  //	> 在輸入中文時, HotKey 應暫停運作
  //
  // 特殊按鈕 (fn) -- 不是 F1..F12, 是綠色或藍綠色小寫 fn 的那個按鍵, 完全偵測不到!
  //	另外像 Alt+Tab 也偵測不到後面同時按了 Tab
  // 特殊按鈕:
  //		> Escape/27
  //		> NumLock/144
  //		> Tab/9
  //		> Meta|MetaLeft(Right)
  //		> ...還有很多
  //
  //	有些按鍵是偵測不到的, 如: PrintScreen
  //	有許多按鍵本身就不該拿來做 hotkey, 例如: 方向鍵, 又像是 Tab, Alt, Control, Shift
  //
  // 複合鍵的處理會是個麻煩!
  //	1. 取設定值和解析對應時, 必須用相同的順序, 如:
  //		> 先判斷 Shift, 再判斷 Contrl, 最後判斷 Alt
  //	2. 最複雜的組合先判定, 最單純的組合留到最後才判定
  //

  //if(debugMode) console.log(`KPI> key(${e.key}), keyCode(${e.keyCode}), code(${e.code}) @ location(${e.location})`)
  let code = e.key;
  // 第一段 hotkey 排除:
  //	-	大小寫切換, ESC, Window 鈕, 數字切換, 中文輸入, TAB
  //	-	方向及移動鍵群
  //	-	Insert, Delete, Enter, ScrollLock, Pause
  //	-	ContextMenu
  // ,ArrowLeft,ArrowRight
  if (
    ",CapsLock,Escape,Meta,NumLock,Process,Tab,Home,End,PageUp,PageDown,ArrowUp,ArrowDown,Insert,Delete,Enter,ScrollLock,Pause,ContextMenu,".indexOf("," + code + ",") >=
    0
  ) {
    // 特定功能鍵直接不處理
    if (debugMode) console.log(`>> 排除-1`);
    return null;
  }

  // 用這個變數來組出最終的比對標的
  let keyCombine = "";

  // 複合性功能鍵判斷, 依序為: 1.Contral, 2.Alt, 3.Shift
  if (e.ctrlKey) {
    keyCombine += KeyCode4Control;
  }
  if (e.altKey) {
    keyCombine += KeyCode4Alternate;
  }
  if (e.shiftKey) {
    if (!(RegExp(/[`!@#$%^&*()_+}{|":?/><]/).test(code) || (code.length === 1 && RegExp(/[A-Z]/).test(code)))) {
      keyCombine += KeyCode4Shift;
    }
  }
  // 第二段 hotkey 排除: 複合性功能鍵接住時會一直觸發, 所以先排除
  if (",Alt,Control,Shift,".indexOf("," + code + ",") >= 0) {
    if (debugMode) console.log(`>> 排除-2`);
    return null;
  }
  //
  keyCombine += code.toUpperCase();

  // 第三段 hotkey 排除:
  //	- 單純之符號, 數字, 英文 及 空白
  if (
    keyCombine.length === 1 &&
    //gExp(/[`!@#$%^&*()_+}{|":;'?/><\[\],.\-=]/).test(keyCombine) ||
    (RegExp(/[`!@#$%^&*()_+}{|":;'?/><[\],.\-=]/).test(keyCombine) || RegExp(/[0-9]/).test(keyCombine) || RegExp(/[A-Z]/).test(keyCombine) || keyCombine === " ")
  ) {
    if (debugMode) console.log(`>> 排除-3`);
    return null;
  }
  if (debugMode) console.log(`>> KeyCodeString[${keyCombine}]`);
  //
  // 第四段 hotkey 排除, 如:
  //	-	網頁更新: F5, Ctrl-F5
  //	-	關閉 browser tag: Ctrl-F4
  //let elimiates = `F5,${KeyCode4Control}F5,`
  //if(elimiates.indexOf(`${keyCombine},`) >= 0) {
  //	if(debugMode) console.log(`>> 排除-4`)
  //	return null
  //}
  //
  return keyCombine;
}

export default KeyPressIdentifier;
