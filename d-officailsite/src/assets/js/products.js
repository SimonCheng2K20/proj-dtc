const _products = [
  { 
    title: 'Radiological Information System', sub: 'RIS-放射資訊系統', img: 'productMobile_image/ris.png', 
    contents: ['放射科資訊系統(RIS)的主要功能是整合醫療資訊系統(HIS)與醫療影像擷取與傳輸系統(PACS),透過RIS系統放射可在作業時醫療人員可直接至HIS系統取得患者資料,避免放射科醫護人員執行不必要的病人資料重複輸入作業,縮短放射科病人等待時間。','當患者完成放射檢查後,RIS所產生的診斷報告影像資料,同時可傳送到HS系統,門診醫生就能快速取得患者資訊進行診斷。','整合RIS、HIS與PACS等系統,採用國際標準HL7建置系統,一個良好的放射科資訊系統(RIS)應該要和醫院資訊系統(HIS)密切結合,並且能夠同時支援臨床服務、研究以及品管。在臨床醫療的運作上本系統提供了重要的助益。'], 
    steps: [{ title: '輕鬆快速製作報告', sub: '整合PACS系統與HIS系統提供<br />製作報告排程權限資料管理' },{ title: '強大的擴充功能', sub: '同時支援臨床服務、<br />研究以及品管' },{ title: '醫療成本降低', sub: '避免重複輸入病患資料,<br />縮短候診時間' },{ title: '完全整合現有<br />系統與設備', sub: '結合影像設備操作<br />建構完整作業流程' },{ title: '強大影像管理<br />動靜皆宜的影像擷取', sub: '擷取醫療影像資料<br />提升作業效率' },{ title: '符合國際醫療標準', sub: '採用國際標準HL7<br />建置系統' }] 
  },


  { title: 'Pictures Archiving Communication System', sub: 'PACS-影像醫學傳輸系統', img: 'productMobile_image/pacs.png', contents: [], steps: [] },

  { title: 'DC-100 Image Storage', sub: '醫療影像伺服器', img: 'productMobile_image/pacs.png', 
    contents: ['支援DICOM3.0所有標準儀器之連接,接收DICOM影像儲存。符合DICOM3.0標準,任何品牌之Printer、Viewer、Gateway都可連接・提供設定Server傳送與接收參數設定,連接各種儀器和產品。','提供超高效能的影像調閱索引技術,有效管理您的醫療影像與傳輸。','支援DICOM Routing功能,可設定Routing DICOM Tag 傳送修件。','支援DICOM影像刪除,以設定時間為刪除條件支援DICOM3.0規模之各項SOP。採用Multi-Thread架構,簡化前端介面並加強背景多工作業,記憶資料共用。','提供醫院使用者帳號管理、身份確認及安全控管。提供影像自動路由傳送之功能,可設定多組傳送路徑及接收端。提供安全性,正確性,穩定性,保證不同系統之標準影像交換機制可正常執行。'], 
    steps: [{ title: '資料儲存/備份', sub: '自動傳送影像到影像中心,可建<br />立多筆影像備份儲存管理設定。' }, { title: '容量管理', sub: '自動監測影像儲存空間容量,<br />確保有足夠空間可利用。' }, { title: '資料維護與還原', sub: '可支援影像新增、修改、刪除、合<br />併/分割及影像倒回(Redo)等功能。' }] 
  },
  { title: 'DC-200 Worklist Server', sub: '排程伺服器', img: 'productMobile_image/dc-200.png', 
    contents: ['支援MPPS(防漏傳機制)功能。提供欄位MAPPING設定。提供下載排程儀器AETitle記錄,方便管理者追蹤排程去向。','提供系統使用者狀態記錄及監視。提供字集設定包含UTF8支援,可自行定義查詢資料字串型態。','提供患者編號流水號、儀器類別、狀態等排程資料查詢。','提供各式儀器排程查詢與下載。支援Oracle、MS-SOL、Access等資料庫。支援HIS/RIS病患排程資料欄位對應功能,提供資訊人員手動設定載入排程資料至排程工作清單佇列。','支援網路磁片與FTP接收HIS所輸出之排程檔案,格式包含HL7、Textfile、MISfile 、XML file。','設定HIS系統與Worklist Server聯機各項聯機參數。提供HIS系統排程作業接收。','具有事件記錄功能,可設定不同等級紀錄内容以方便管理者追蹤管理。','提供不同部門儀器連接工作清單查詢。可進行資料新增、搜尋、修改與刪除等作業。','支援Barcode Reader讀取功能。提供錯誤日誌記錄。',], 
    steps: [{ title: '整合容易', sub: '支援系統相容的連線參數,透過HIS/RIS資料欄位對應功能,載入工作清單,並支援Unicode格式。'},{ title: '資訊安全不外洩', sub: '內建安全機制,提供系統即時監視。嚴格控管患者資料。'},{ title: '存取便利', sub: '含查詢欄位,並可預先設定快速檢索。另可自行定義查詢資料,提供字集設定包含UTF8支援。'}] },
  { title: 'DC-300 QC Station', sub: '影像品質工作站', img: 'productMobile_image/dc-300.png', 
    contents: ['符合DICOM3.0.影像資料儲存及傳送之規範,支援DICOM Verification ServiceClass ,支援DICOM WorkList SCU。','提供病患基本資料修正功能,檢查資料修正功能。提供程影像自動/手動Match功能,提供合併series之功能。','支援DICOMGSPS,提供合併/分割影像之功能,提供影像W/L、Rotate等影像處理功能,提供測量,遮照功能。','多張影像顯示時可依系統預設之ECHOTime : Image Time , Image Number 、Exam 、Series 、Image Position等,正反向排序顯示。','支援DICOM Storage Commitment,支援DICOM MPPSㆍ支援Auto Routing影像轉送。可重傳續傳自動上傳並提供影像上傳狀態顯示。'], 
    steps: [{ title: '直覺UI介面', sub: '介面具親和力,支援多螢幕顯示,影像可動態播放。'},{ title: '影像編輯操控簡易', sub: '獨家開發系統低耗能的2D/3D靜態及動態多視窗影像。'},{ title: 'DICOM DIR', sub: '檢查的影像紀錄可直接輸出,支援DICOM3.0系統'},{ title: '資料編輯方便快速', sub: '可支援影像新增、修改、刪除、合併/分割的功能。'},{ title: '影像自動轉送', sub: '可重傳、續傳和自動上傳,減少介面操作步驟。'},{ title: '自訂合併功能', sub: '排程和影像資料比對合併、或針對特定條件影像合併。'}] 
  },
  { title: 'DC-500 Report Station', sub: '報告判讀工作站', img: 'productMobile_image/dc-500.png', 
    contents: ['提供醫院PACS系統整合,支援報告,畫面DICOM格式化。','提供報告編輯功能:圖文並茂之報告輸出功能,提供內建報告範式。','提供影像瀏覽功能,提供影像資料快速瀏覽功能。提供報告內容轉檔為PDF檔,可提供病患病歷電子檔。','提供注記功能,可編輯線的寬度、顏色、及文字大小、字型、顏色。','支援Worklis查詢條件:依日期、檢查項目、申請序號、病例號查詢。','本系統支援DICOM3.0格式傳送、並可與院內現有DICOM主機做整合。','提供統計功能,其統計專案包含醫師,報告內容,病歷編號、年齡、報告狀態。','支援Bar-Code Reader直接下載排程資料及指定完成下載後之作業、系統須提供提供NTSC/PAL,色差訊號或更高階之影像訊號之擷取。','支援即時校正調整影像之亮度、對比、色差設定確保影像輸入品質。','提供單張靜態影像擷取及儲存功能、及動態影像。可上傳PACS伺服器功能:重傳、續傳並自動控制。設定BaraCode對應之排程及作業。','支援自動連線下載最新排程資料。支援多台DICOM Worklist下載排程。提供每月檢查項目數量統計表。','提供報告設計工具,可自行設計撰寫報告及内容。支援DICOM worklist SUC/SCP溝通下載排程。提供選取影像圖形可依照使用者自行隨意排列。提供多種範本列印模式可自行選擇使用。支援使用者自行設定多個排程查詢條件。','支援排序顯示欄位設定功能。支援斷電自動回覆檢查影像功能。支援影像暫存及取回功能。'], 
    steps: [{ title: '超強大整合功能', sub: '支援DICOM3.0, DICOM SR格式、醫院HS系統,有效整合及管理病歷影像,大幅節省醫療成本。'},{ title: '製報告輕鬆容易', sub: '影像快速瀏覽,依照需要排列。內建多種報告範本,亦可自行設計報告格式及內容。'},{ title: '個人化編輯功能', sub: '點選縮圖即可進行調整。可註記於選取的影像,並可設定及儲存快速片語,依使用者習慣定義使用。'},{ title: '環保無紙化', sub: 'PACS系統整合,醫療影像報告DICOM SR格式,快速分享資源,達到醫療影像無紙化。'},{ title: '圖文並茂', sub: '提供DICOM影像崁入功能,圖文並茂的檢查報告能減少病患對病情的認知誤差。'}] },
  { title: 'DC-600 Image Viewer', sub: '影像瀏覽工作站', img: 'productMobile_image/dc-600.png', 
    contents: ['可供同時登詢多台DICOM C-SSCP主機下載影像。具有使用者登入/註銷許可權管理。可影示與管理已下載檢查列表亦可同時選擇多個檢查並顯示。','提供明暗對比之Window Level調整。具多重螢幕顯示功能,影像可同時顯示並可任意縮放調整視窗。提供影像小圖快選功能並可快速與主視窗切換。','具有影像轉存格式JPEG、JPEG2000、BMP、AVIMPEG2等影像格式。提供DICOM MPEG播放功能。可全選影像上的標記或量測物件及刪除的功能並可將上述標記儲存成DICOMPR物件,提供文字批註功能。可影示Multi frame與Multiple影像動態與靜態影示,並提供使用者可自行設定影像撥放延遲時間及循序、來回等撥放模式等功能。','提供放大/縮小、左/右傾90度、上下左右翻轉、遮罩、反相與重置等功能。支援療程追蹤功能,可並排顯示不同批次檢查之影像。可直接在影像上描繪線段、矩形、任意多邊形。'], 
    steps: [{ title: '查詢省時有效率', sub: '自定查詢條件設定,提供關鍵字查詢,支援遠端資料庫查詢。'},{ title: '直覺UI介面', sub: '介面具親和力,支援多螢幕顯示,影像可動態播放。'},{ title: '樹狀式快速展開', sub: '採樹狀顯式,調閱指定日期,指定檢查影像,皆可快速檢閱。'},{ title: '影像編輯操控簡易', sub: '獨家開發系統低耗能的2D/3D靜態及動態多視窗影像。'},{ title: '關鍵影像比對分析', sub: '關鍵影像比對可協助醫師對相同病患或相同病史影像比對。'},{ title: 'DICOM DIR', sub: '檢查的影像紀錄可直接輸出，支援DICOM3.0系統。'}] },
  { title: 'DC-700 Printer DICOM', sub: '影像列印工作站', img: 'productMobile_image/dc-700.png', 
    contents: ['支援健保申報影像列印。','支援多人同時列印。','可設定多種列印模板。','提供單張指定選取與多重選取功能。','提供搜尋、新增與刪除功能。','提供病患資訊內崁列印功能。'], 
    steps: [{ title: '支援多人同時列印', sub: '支援多人同時列印、可設定多種列印模式,圖文並列或分別輸出。支援DICOM影像列印'},
    { title: '支援DICOM影像列印', sub: 'DICOM Printer可支援所有DICOM影像的列印及健保申報影像列印。'},{ title: '搜尋、新增與刪除', sub: '其他功能還有提供搜尋、新增與刪除功能,病患資訊內崁列印功能。'}] },
  { title: 'DC-810 Dental Viewer', sub: '牙科影像流覽工作站', img: 'productMobile_image/dc-810.png', 
    contents: ['可供同時登詢多台DICOM C-Store SCP主機下載影像。可影示與管理已下載檢查列表,亦可同時選擇多個檢查一併顯示。提供直接拖曳功能,選取影像後可直接拖曳,至指定牙位。','支援顯示牙根尖模式、全口牙模式、側顱模式。提供牙圖影像定址存取功能,可自動記錄影像所在牙圖位置。提供Image Zoom in/out影像縮放功能。可直接在影像上描繪線段、矩形、任意多邊形。可作影像長度量測、面積量測、任意兩線交角量測。','可執行放大/縮小、左/右傾90度、上下/左右翻轉、遮罩、反相與重置等功能。支援療程追蹤功能,可並排顯示不同批次檢查之影像。','具多重螢幕顯示功能,影像可同時顯示並可任意縮放調整視窗。提供影像小圖快選功能並可快速與主視窗切換。可全選影像上的標記或量測物件及刪除的功能並可將上述標記成DICOMPR物件。提供文字註解功能。','提供明暗、對比之Window Level調整。具有使用者登入/登出權限管理。提供同一牙位影像瀏覽功能。'], 
    steps: [{ title: '獨家牙點陣圖流覽功能', sub: '系統還提供牙點陣圖影像定址存取功能,可自動記錄影像所在牙點陣圖的位置,爾後在調閱影像流覽時,可一目了然個別根尖片所在位置的影像,而當有特殊的客制牙點陣圖模組需求時,系統也提供使用者自訂牙點陣圖排列模組功能。'},{ title: '快速查詢功能省時有效率', sub: 'MIO-Viewer提供使用者自定快速查詢準則設定,協助使用者快速找到指定的資料,同時也提供了關鍵字快速查詢的預設功能,同時支援遠端資料庫查詢,包括檢查日期、病患姓名、病歷號碼等專案查詢和排序。'},{ title: '直覺UI介面', sub: '使用者介面具親和力,透過各種直覺式圖示來區別不同功能按鈕,可支援多螢幕、多視窗顯示,影像可呈現靜態顯示、動態播放。'},{ title: '影像編輯操控簡易', sub: '支援影像點距矯正,可直接在影像上描繪線段、矩形、任意多邊形,也可做長度量測如水準距離和垂直、不規則長度測量、矩形、圓形、面積量測、角度量測、水平線交角量測、任意兩線交角量測,並可全選影像上的標記或量測物件及刪除的功能,針對影像可做多圖流覽、明暗對比、負片效果、放大/縮小、上下左右旋轉、線段標示、文字批註。'},{ title: '牙點陣圖比對功能', sub: '可任意調閱同一病患,不同檢查日期之牙點陣圖進行比對模式,協助醫師方便對相同病患的歷史檢查進行比對與療程追蹤。'}] },
  { title: 'DC-830 Dental Gateway', sub: '牙科擷像工作站', img: 'productMobile_image/dc-830.png', 
    contents: ['支援傳統底片掃描轉換數位影像檔。','支援傳輸DICOM Printo','支援TWAIN模式影像擷取功能。'], 
    steps: [{ title: '相容DICOM或NON-DICOM儀器', sub: '符合標準DICOM3.0格式,任何廠牌儀器皆可順利連結,將擷取影像轉成標準DICOM格式傳送至PACS伺服器。可擷取牙科照影設備,例如電腦X光攝影(CR)、數位放射醫療(DR)、電腦斷層攝影(CT)等所全部影像,並儲存、管理與傳送。支援DICOM輸入、TWAIN介面輸入擷取,遠端下载Worklist排程資料。'},{ title: '獨家牙點陣圖排列流覽功能', sub: '系統內建24組標準牙點陣圖排列模組,可輕易針對根尖片進行不同模組的排列,同時提供牙點陣圖影像定址存取功能,可自動記錄影像,爾後調開影像,可一目了然個別根尖片所在位置,若有特殊客制牙點陣圖模組需求,亦提供使用者自訂牙點陣圖排列模組功能。'},{ title: '彈性使用排程資料', sub: '可自行新增排程進行擷像,並支持條碼掃瞄器,可直接讀取條碼編號,減少撰打作業。提供新增/查詢/修改/刪除排程等功能,可針對病歷編號、儀器類別、狀態等資料查詢,亦可查詢同部門儀器連接工作清單。字集設定包含UTF-8文字格式,可自行定義查詢資料字串型態,方便查詢動作後排程資料的修改與刪除。'},{ title: '使用者可自訂影像傳送及匯出/匯入', sub: '可設定系統手動或自動影像傳送,並可支援多個影像伺服器、多個端點傳送(Auto Routing)設定。系統外部影像之單張/多張影像匯入匯出功能,支援含JPG、BMP、TIFF 、DICOM等檔案格式匯入。'}] },
  { title: 'MiO-Dental Web Viewer(DC-1800)', key: 'DC-1800', sub: '牙科網路影像流覽工作站', img: 'productMobile_image/dc-1800.png', 
    contents: ['提供遠端線上Image Viewer功能。','提供使用者帳號管理、身份確認及使用者權限控管功能。', '支援多人同時線上功能。支援WADO。'], 
    steps: [
      { title: '提供遠端線上<br />DICOM Viewer功能', sub: '支援WADO協議(Web Access toDICOM Object),以網路為基礎服務元件,符合此規格資料可在網路上傳遞與交換。透過網路流覽器提供遠端線上DICOM Viewer功能,可支援多人同時上線功能,至少可提供200Clientuser以上,並使用者透過支援DICOM格式的網路流覽器可以自由地存取、閱覽、甚至在許可權允許下編輯資料。'},
      { title: '完善的網路安全<br />控管機制', sub: '在網路安全控管上,系統提供使用者帳號管理、身份確認及使用者權限的控管功能,可依許可權層級限制功能使用。'},{ title: '獨家牙點陣圖流覽功能', sub: '系統還提供牙點陣圖影像定址存取功能,可自動記錄影像所在牙點陣國的位置,爾後在調閱影像流覽時,可一目了然個別根尖片所在位置的影像,而當有特殊的客制牙點陣圖模組需求時,系統也提供使用者自訂牙點陣圖排列模組功能。'},{ title: '快速查詢功能省時有效率', sub: 'MIO-Viewer提供使用者自定快速查詢準則設定,協助使用者快速找到指定的資料,同時也提供了關鍵字快速查詢的預設功能,同時支援遠端資料庫查詢,包括檢查日期、病患姓名、病歷號碼等專案查詢和排序。'}] },
  { title: 'DICOM-DIR', sub: '醫療影像燒錄軟體', img: 'productMobile_image/dicom-dir.png', 
    contents: ['直接燒錄光碟,無需外掛燒錄程式。製作輸出ISO檔用以大量燒錄。','支援CD-RDVD/RW等多等燒錄格式。同一病患檢查影像可先進行預覽,確認選取後執行燒錄。燒錄完成光碟可直接於任何DVD ROM流覽DICOM影像。','燒錄完成光碟可附有內建簡易imageViewer功能,可執行放大/縮小、左右傾斜90度、上下/左右翻轉、遮罩、反相與重置等功能。'], 
    steps: [{ title: '先預覽確認影像', sub: '可先進行預覽,確認選取後執行燒錄。'},{ title: '支援多種燒錄格式', sub: '支援DC-R DVD/RW等多種燒錄格式。'},{ title: '直覺UI介面', sub: '介面具親和力,支援多螢幕顯示,影像可動態播放。'}] },


  { title: 'Hospital Information System', sub: 'HIS-醫院資訊系統', img: 'productMobile_image/his.png', 
    contents: ['以病患為中心之完整病歷紀錄,系統以單一病患的病史歸戶呈現,包括用藥紀錄、過敏狀況、檢査影像、療程資訊、報告資料、檢驗報告等,藉由這些資訊讓醫師做出更正確的診斷。','多功能與流暢使用者介面:提供科別、個人套組設定,可DITTO病患前次就診紀錄,提供常用診斷、檢驗、藥品、片語、關鍵字輸入,最佳化操作動線,縮短病患等待時間,提升看診品質。','多樣化系統功能:掛號系統、入院管理系統、門診醫囑系統、住院醫囑系統、急診醫囑系統、批價系統、出院管理系統、門診藥局系統、放射系統、電子病歷系統、檢驗系統、門診申報系統、住院藥局系統、管理系統、住院申報系統、護理站系統。'], 
    steps: [{ title: '即時管理機制', sub: '強化即時查詢、管制與提示的管理機制'},{ title: '醫囑系統提示', sub: '於醫囑系統中提示病患之過敏紀錄、重大醫療紀錄..等資訊'},{ title: '彈性設定', sub: '可依醫院需求調整如健保與衛生署法規等'}] },
  
  { title: 'Surgical Records Report System', sub: 'SRRS-手術記錄報告系統', img: 'productMobile_image/srrs.png', 
    contents: ['手術記錄是電子病歷中重要的一環,撰寫手術記錄是外科醫生手術後必要的基本工作項目,其內容的充分性與資料的正確性攸關醫療品質的良窳,並影響未來醫學研究資料分析的正確性與便利性。','由於外科系各次專科對進行的手術有不同的內容紀錄需求,其紀錄項目與格式亦常隨著臨床需求改變而更動,因此開發及維護高品質的手術記錄資訊系統需要耗費龐大的資源人力。','SRRS系統根據醫院需求開發作業環境,節省外科手術資訊管理之工時、提升手術作業流程,改善醫院品質管制。','本系統以衛生署訂定的手術記錄基本内容為基準。'], 
    steps: [{ title: '手術紀錄報告撰寫', sub: '支援閲覽或列印,維護編碼代號及常用片語並符合CAD製作標準'},{ title: '影像無線即時傳輸', sub: '經由無線wi-fi傳輸節省人工整理時間及減少錯置病患資料'},{ title: '觸控螢幕手繪圖功能', sub: '醫師直接於觸控螢幕上繪國,繪圖完成後自動整合入手術記錄內'},{ title: '自動手術全程錄影', sub: '接收醫療儀器端影像全程錄影'},{ title: '整合醫院既有系統', sub: '可整合既有的HIS及PACS系統,並符合DICOM標準'},{ title: '手術分析月報表製作', sub: '節省醫護人員工時提供政策決定者即時手術資訊'}] },
  
  { title: 'Electronic Medical Record', sub: 'EMR-電子病歷管理系統', img: 'productMobile_image/emr.png', 
    contents: ['電子病歷管理系統提供專屬電子病歷儲存庫並支援W3CXML電子簽章標準,提供線上圖文病歷即時閱覽,增加病歷可讀性與看診品質並減少紙本輸出,病歷歸戶查詢醫護人員可以一次調閱整本病歷,整合衛生署電子病歷交換平台。','電子病歷系統裡共有五大權限,分別是簽章、閲覽、稽核、増補、修改及列印,以群組的方式來設定權限,權限設定操作簡單,醫院可針對自己內部的流程來設定權限。'], 
    steps: [{ title: '權限控管設定', sub: '以群組的方式來設定權限,醫院可針對自己內部流程來設定'},{ title: '批次簽章', sub: '在完成一份報告後都要執行簽章,以確保以後權責歸屬'},{ title: '電子病歷查詢', sub: '可檢視其檢査日期、簽章日期及閱覽病歷的歷史報告'},{ title: '簽章狀態查詢', sub: '可查詢電子病歷是否已簽章及是否已逾時'},{ title: '稽核紀錄查詢', sub: '可查詢修改、新增、查詢、調閱及列印之紀錄'},{ title: '逾時簽章查詢', sub: '可查詢電子病歷未在24小時內簽章的原因'}] },
  
  { title: 'Pathological Examination System', sub: 'PES-病理檢驗系統', img: 'productMobile_image/pes.png', 
    contents: ['病理檢驗系統有效協助病理檢驗作業流程整合及標準化,更方便提供線上查詢與研究應用,不僅對後續相關的研討與教學有直接幫助,對於醫療品質可有效提升。','此模組用以協助病理檢驗的標準化與電子化,檢驗項目大致包括超顯微病理、細胞病理、外科病理及一般病理等。其作業内容包括:醫囑開立、病理編號、工作清單、病理檢驗自動申報、病理檢驗報告查詢、病理檢驗結果登錄、診斷、確認、審核及通報、病理檢驗進度分析統計。','其系統特色採用web化介面、結合權限管控、異常報告通知,及線上統計等,其中異常報告可即時通知臨床醫師,作適當的醫療處置。'], 
    steps: [{ title: 'WEB化介面', sub: '透過瀏覽器使用,並提供報告範本管理、SpllingCheck等'},
      { title: '黃卡全文檢索', sub: '以關鍵字來搜尋黃卡歴史資料,提供查詢、比對及研究使用'},
      { title: '線上統計功能', sub: '線上查看更正報告、逾期報告<br />統計等數據'},
      { title: '有效整合病理檢驗紀錄', sub: '提供線上查詢與研究應用,有效提升品質'},
      { title: '冰凍切片處理時間登錄', sub: '為稽核與檢討統計依據'}] },
  
  { title: 'Laboratory Information System', sub: 'LIS-檢驗資訊系統', img: 'productMobile_image/lis.png', 
    contents: ['自動化、資訊化、提高生產力、工作效率,縮短檢驗報告時間。精簡人力、降低人工、物料及管理成本、改善檢驗報告正確性。'], 
    steps: [{ title: '提升檢驗品質', sub: '改善檢驗報告正確性,避免病人、檢體及檢驗結果配對錯誤。'},{ title: '提高報告時效', sub: '網路傳輸檢驗資料、取代傳統人工作業。檢驗報告快速及時獲得'},{ title: '降低營運成本', sub: '利用資訊科技有效完成檢驗工作 ,降低成本'},{ title: '提高生產力', sub: '作業自動化並整合流程,大幅提高生產力'},{ title: '改善管理能力', sub: '資訊化管理,提供各種管理統計報表'}] },
  
  { title: 'Cancer Treatment Plan System', sub: 'CTPS-癌症管理系統', img: 'productMobile_image/ctps.png', 
    contents: ['高價值的癌症醫療照護系統,以病人為中心的服務系統本系統為配合行政衛生署國民健康局癌症防治中心所推動政策提供癌症登記資料庫,提供癌症治療計劃書之資訊化作業。','建立癌症病人個案管理模式,從診斷到治療提供病人為中心的資訊整合。協助提供癌症登記資料庫,並運用資料統計作為檢討改善依據。協助醫院全面提升癌症診療品質計畫。'], 
    steps: [] },
  
  { title: 'Medical Record Image System', sub: 'MRIS-病歷掃描倉儲系統', img: 'productMobile_image/mris.png', 
    contents: ['線上隨時調閱','採web-based開發','支援電子簽章整合','校正改善影像品質','支援批次掃描','提供Barcode條碼辨識','完整影像掃描擷取儲存','關鍵字查詢功能','線上影像列印功能','線上影像轉存備份'], 
    steps: [{ title: '整體功能', sub: '以群組的方式來設定權限,醫院可針對自己内部流程來設定'},{ title: '文件掃描與管理', sub: '在完成一份報告後都要執行簽章 ,以確保以後權責歸屬'},{ title: '電子簽章', sub: '可檢視其檢查日期、簽章日期及閱覽病歷的歷史報告'},{ title: '查詢與調閱', sub: '可查詢電子病歷是否已簽章及是否逾時'},{ title: '帳號群組管理', sub: '可查詢修改、新增、查詢、調閱及列印之紀錄'},{ title: '資料備份復原及光碟燒錄', sub: '可查詢電子病歷未在24小時內簽章的原因'}] },
  
  { title: 'Automatic Dialysis System', sub: 'ADS-血液淨化管理系統', img: 'productMobile_image/ads.png', 
    contents: ['結合美國與臺灣二十五年以上臨床與管理的先進技術,以病人為中心的設計理念,規劃六大模組的功能架構,護士人手一台的lpad為血液淨化過程提供了方便、快捷、實用、可靠的資料分析。'], 
    steps: [{ title: '手術紀錄報告撰寫', sub: '透析安排功能<br />患者登記功能<br />血液淨化功能<br />醫囑用藥功能<br />醫療過程功能<br />庫存功能<br />'},{ title: '患者報到', sub: '透析前體重計<br />病床位置<br />透析過程自動紀錄<br />透析過程核對檢視<br />透析後體重計<br />自動產生血液淨化紀錄<br />'},{ title: '手術紀錄報告撰寫', sub: '即時監控<br />顯示病區病床<br />緊急處理<br />顯示公告訊息<br />護士核對身份及設定治療參數<br />'}] }
];

export const products = _products.map(product => ({
  ...product, 
  key: product.hasOwnProperty('key')
    ? product.key
    : product.title.split(' ')[0]
}));

