/* eslint-disable no-console */
/* datasource: DR.04.23.003 - 人員資料．護理師 */
const dataCollection = [
	{ guid: "6c5deaff5ae94edfa9beefa829f21bb2", pid: "A123456789", name: "邱俊佩", gender: "M", birthday: "1987-08-12", ptype:  1 },
	{ guid: "3acd2e741a7b400baa9d4427c65a6f9d", pid: "B123454421", name: "藍家維", gender: "M", birthday: "1966-04-08", ptype:  1 },
	{ guid: "591ee5de66f047e1b909ff5a4e27653a", pid: "C123458976", name: "謝承恩", gender: "M", birthday: "1983-07-15", ptype:  1 },
	{ guid: "65ea5fb8a37e446abc5e2ed1a96e3c99", pid: "D123451235", name: "管靜宜", gender: "M", birthday: "1982-05-05", ptype:  1 },
	{ guid: "387fce9a5a014c1fb06a31a53885e13a", pid: "E123455568", name: "趙柏翰", gender: "M", birthday: "1981-06-27", ptype:  1 },
	{ guid: "d5bf4efec583438182e0bb3efb54bd4a", pid: "F123456874", name: "林珍男", gender: "M", birthday: "1975-12-20", ptype:  1 },
	{ guid: "f794b5cca11c438ba7e3cd5d6699af8e", pid: "G123451111", name: "別宛君", gender: "M", birthday: "1988-09-10", ptype:  1 },
	{ guid: "cebb642166cc43fb8d6a375eb430009b", pid: "H123452346", name: "宣忠翰", gender: "M", birthday: "1964-11-14", ptype:  1 },
	{ guid: "1b96c65b267b4500825e4ffb85246d36", pid: "I123456351", name: "鍾明憲", gender: "M", birthday: "1970-06-25", ptype:  1 },
	{ guid: "39213856463047dfb69eaa8e943cfd81", pid: "J123451237", name: "丁育維", gender: "M", birthday: "1967-06-27", ptype:  1 },
	{ guid: "43b43013d86e42a18312dd9d8c25009d", pid: "K123454682", name: "劉玉能", gender: "M", birthday: "1978-02-07", ptype:  1 },
	{ guid: "33cff021aedf485880582eb165955730", pid: "L123459563", name: "吳政儒", gender: "M", birthday: "1986-12-18", ptype:  1 },
	{ guid: "5b2864377adf44529c18df94821d5dac", pid: "N225364741", name: "李淑卿", gender: "F", birthday: "1987-10-15", ptype:  1 },
	{ guid: "9c6955671afa44e9bde8898a79a33f80", pid: "X245711592", name: "王智堯", gender: "F", birthday: "1987-03-05", ptype:  1 },
	{ guid: "e0c9bd8464e24a6e9e0a0acb2c01e103", pid: "R128177661", name: "施怡婷", gender: "M", birthday: "1985-08-02", ptype:  1 },
	{ guid: "cff0c296bd264d758965f15954fbabde", pid: "W121744866", name: "黃惠順", gender: "M", birthday: "1983-02-18", ptype:  1 },
	{ guid: "68f67f74c1ed446eab5ae95895f556cd", pid: "U154497655", name: "徐威廷", gender: "M", birthday: "1971-11-19", ptype:  1 },
	{ guid: "6a08a1e704cb42fdab381e649b6d1ea2", pid: "G237562878", name: "榮俊霖", gender: "F", birthday: "1965-09-09", ptype:  1 },
	{ guid: "a11d7249389b456cb89ea89540e84234", pid: "Z191962384", name: "趙俊逸", gender: "M", birthday: "1985-01-06", ptype:  1 },
	{ guid: "fdb97fc034a446c8b4d21a172c351b5f", pid: "H182758449", name: "程心怡", gender: "M", birthday: "1987-06-30", ptype:  1 },
	{ guid: "48f2115353e64edf8fdc5d2594e8ae29", pid: "N263627630", name: "潘慧龍", gender: "F", birthday: "1968-03-06", ptype:  1 },
	{ guid: "adfaa4fa5f8b4c8a9f0978e3019cb0ec", pid: "P134419829", name: "權怡芬", gender: "M", birthday: "1969-11-03", ptype:  1 },
	{ guid: "ddb8acabbedf4a73afb13e93d7ffb28f", pid: "K203832042", name: "李志宏", gender: "F", birthday: "1976-08-19", ptype:  1 },
	{ guid: "f865247b0b8047a29a14cd8290a3ea95", pid: "G131091323", name: "吳柏洋", gender: "M", birthday: "1973-11-15", ptype:  1 },
	{ guid: "349c7f40276e4123828ad0df16e9ed5f", pid: "U175151896", name: "陳致汝", gender: "M", birthday: "1982-01-18", ptype:  1 },
	{ guid: "b62992ea3ea74905b8a7b25beea2d086", pid: "I155245374", name: "張孟勳", gender: "M", birthday: "1979-05-03", ptype:  1 },
	{ guid: "6fe038519cf54986ae6b9c844d746e6a", pid: "Z132687122", name: "王劭映", gender: "M", birthday: "1984-05-02", ptype:  1 },
	{ guid: "11079bfa68cd4ff59e10eb7d8cf4b277", pid: "H277282378", name: "陳馥軍", gender: "F", birthday: "1987-07-07", ptype:  1 },
	{ guid: "d471e7f01f4e4be793aa74209f6b8e17", pid: "Y236191136", name: "方琪馨", gender: "F", birthday: "1977-12-19", ptype:  1 },
	{ guid: "b51a3906148947189d2b047f1fd41943", pid: "N253981716", name: "馮雅琪", gender: "F", birthday: "1982-01-07", ptype:  1 },
	{ guid: "8a96d42107a5467f9c03dd125dd8b164", pid: "E165647499", name: "黃聖筠", gender: "M", birthday: "1980-06-19", ptype:  1 },
	{ guid: "7cd04f240a8943488616ff6148963101", pid: "B119872427", name: "吳昭青", gender: "M", birthday: "1979-11-01", ptype:  1 },
	{ guid: "d74b58b2ec9b42e4ade04d6ab9fc6c1b", pid: "H201175499", name: "李惠如", gender: "F", birthday: "1978-03-05", ptype:  1 },
	{ guid: "4154ae08293540929c2bf736860a2d3c", pid: "L197401977", name: "牛家瑜", gender: "M", birthday: "1974-05-13", ptype:  1 },
	{ guid: "f5af0a6d3ecb421d8304d71b98d52dfa", pid: "N109964669", name: "韓吟南", gender: "M", birthday: "1980-03-11", ptype:  1 },
	{ guid: "ad4082a946954f19a92d731a9cad2767", pid: "M254271889", name: "王姿發", gender: "F", birthday: "1971-10-02", ptype:  1 },
	{ guid: "dbb1a7b106db443690d5d726144cdf41", pid: "Q295055259", name: "李家豪", gender: "F", birthday: "1982-05-19", ptype:  1 },
	{ guid: "dd179cd92abf4dddaa14dee1b30cffeb", pid: "Q147475896", name: "陳姿穎", gender: "M", birthday: "1986-01-20", ptype:  1 },
	{ guid: "078c3f79f295461c8bbffe102d2f6417", pid: "D248606986", name: "李佳玲", gender: "F", birthday: "1970-01-15", ptype:  1 },
	{ guid: "fbc88ea25f1b4765afd6628f5fc841c8", pid: "C242861991", name: "連湖齊", gender: "F", birthday: "1983-03-03", ptype:  1 },
	{ guid: "b4c0bf456f894ffcb01bbad693eb5dad", pid: "T244032518", name: "鄧剛全", gender: "F", birthday: "1981-01-01", ptype:  1 },
	{ guid: "7a3cde51851c4dd0b7b8735dce9f2fca", pid: "F186412504", name: "陳勳合", gender: "M", birthday: "1986-07-17", ptype:  1 },
	{ guid: "6b799ed5e07b4b1ab18784eb1db49596", pid: "K113737132", name: "吳美雲", gender: "M", birthday: "1964-06-03", ptype:  1 },
	{ guid: "ed69626b4a154514812e26051fa37d8e", pid: "U118878574", name: "李文名", gender: "M", birthday: "1987-07-05", ptype:  1 },
	{ guid: "3d6c973a57084bb2a9dbe2f804d0e586", pid: "P281328613", name: "顏靜怡", gender: "F", birthday: "1972-09-06", ptype:  1 },
	{ guid: "6b6342b2dc0148b39b5e1f03a7e5f9de", pid: "Q283102350", name: "吳鳳珠", gender: "F", birthday: "1976-08-06", ptype:  2 },
	{ guid: "e56e700ed92140fe8ee43c9d466e4df1", pid: "J273938512", name: "林淑貞", gender: "F", birthday: "1988-04-13", ptype:  2 },
	{ guid: "a543fd5dab784297be91b0062068b7cf", pid: "S172432267", name: "吳宗玲", gender: "M", birthday: "1980-10-08", ptype:  2 },
	{ guid: "050a69cf79474c2aab1b0a38cc404848", pid: "G123289293", name: "葉琪鑫", gender: "M", birthday: "1977-10-20", ptype:  2 },
	{ guid: "6fb8d836865340e3852b96a058ee625a", pid: "M173483254", name: "李瑋倫", gender: "M", birthday: "1972-02-24", ptype:  2 },
	{ guid: "e37a438a4f7c4d81a39f7c7ce1626924", pid: "R246670336", name: "林柏幸", gender: "F", birthday: "1976-03-14", ptype:  2 },
	{ guid: "1ff7b0199d15409bbe74a021eb0723c3", pid: "U160211189", name: "王宗翰", gender: "M", birthday: "1984-07-16", ptype:  3 },
	{ guid: "92c46e7e949f43a195f946ad52de98ce", pid: "K187644111", name: "劉山隆", gender: "M", birthday: "1973-11-30", ptype:  3 },
	{ guid: "01212b396afd425882c620d8db081b57", pid: "I132446328", name: "許佩珊", gender: "M", birthday: "1973-01-02", ptype:  3 },
	{ guid: "7228d654714741df992ab34afd0efcdb", pid: "A246574719", name: "許嘉妃", gender: "F", birthday: "1964-03-13", ptype:  3 },
	{ guid: "7ae200ed7a8847cca580064ab06b1821", pid: "S174842878", name: "謝思賢", gender: "M", birthday: "1966-08-17", ptype:  3 },
	{ guid: "6c525e67cfd44eae8071d5ecf824860d", pid: "Q164853241", name: "魏哲瑋", gender: "M", birthday: "1980-11-17", ptype:  3 },
	{ guid: "d179d3e48631443b93cc7deddeed0231", pid: "P191538389", name: "洪靖雯", gender: "M", birthday: "1970-12-07", ptype:  5 },
	{ guid: "8071b58cc9714f9db867aa1407aa5604", pid: "R249720502", name: "李淑月", gender: "F", birthday: "1966-08-09", ptype:  5 },
	{ guid: "ab4fb44568fc4e248b2df40790cdb9c7", pid: "H262688868", name: "李育紫", gender: "F", birthday: "1984-12-03", ptype:  5 },
]

export let
	Options = () => {
		var collections = [{ value: null, text: '請選擇' },]
		dataCollection.forEach(e => {
			if(e.ptype === 3) {
				collections.push({ value: e.guid, text: e.name })
			}
		})
		return collections
	},
	GetText = (v) => {
		var result = ''
		if(v) {
			dataCollection.forEach(e => {
				if(e.guid === v && e.ptype === 3) {
					result = e.name
				}
			})
		}
		return result
	}