const generateOptions = (item) => {
  const No = item.No || item.Id || item.value;
  const Name = item.Name || item.text;
  return { NO, Name, Id: No, value: No, text: Name };
};
import store from '@/store';

export default {
  g_hasClickNotify(state) {
    return state.hasClickNotify;
  },
  g_isNewLogin(state) {
    return state.checkIsLogin;
  },
  g_isLogin(state) {
    return state.dakar.Token !== '';
  },
  g_userToken(state) {
    return state.dakar.Token;
  },
  g_userNo(state) {
    return state.dakar.No;
  },
  g_functionsOptions(state) {
    return state.functions.map(generateOptions);
  },
  g_functionsMenuList(state) {
    //比對user擁有的功能和全部的功能進行過濾
    const allUserFunctions = store.state?.dakar
      ? JSON.parse(JSON.stringify(store.state?.dakar.FunctionNos))
      : [];
    const allFunctions = store.state?.functions
      ? JSON.parse(JSON.stringify(store.state.functions))
      : [];

    let arr = allFunctions.filter((s) =>
      allUserFunctions.find((k) => k == s.No)
    );
    const objSysmanage = allFunctions.find((s) => +s.Seq == 100);
    const objStatisticsManage = allFunctions.find((s) => +s.Seq == 200);
    const objDiagnosismanage = allFunctions.find((s) => +s.Seq == 300);

    const userHasSystemManageFunctions = arr.find((s) => +s.Seq < 200)
      ? true
      : false;

    const userHasSysManageFunction = arr.find((s) => +s.Seq == 100)
      ? true
      : false;

    const userHasStatisticsFunctions = arr.find(
      (s) => +s.Seq > 200 && +s.Seq < 300
    )
      ? true
      : false;

    const userHasStatisticFunction = arr.find((s) => +s.Seq == 200)
      ? true
      : false;

    const userHasDiagnosisFunctions = arr.find((s) => +s.Seq > 300)
      ? true
      : false;

    const userHasDiagnosisFunction = arr.find((s) => +s.Seq == 300)
      ? true
      : false;

    if (userHasSystemManageFunctions && !userHasSysManageFunction) {
      arr.unshift(objSysmanage);
    }
    if (userHasStatisticsFunctions && !userHasStatisticFunction) {
      arr.unshift(objStatisticsManage);
    }
    if (userHasDiagnosisFunctions && !userHasDiagnosisFunction) {
      arr.unshift(objDiagnosismanage);
    }

    arr = arr.filter((s) => !s.Name.includes('帳號審核'));

    const returnArr = arr.reduce((acc, cur) => {
      if (cur.Seq % 100 === 0) {
        acc.push({ label: cur.Name, Seq: cur.Seq, items: [] });
      } else {
        const _parent = acc.find(
          (parent) => parent.Seq === Math.floor(cur.Seq / 100) * 100
        );
        // const _parent = acc[0]
        if (_parent)
          _parent.items.push({ label: cur.Name, name: cur.No, path: cur.No });
      }
      return acc;
    }, []);

    returnArr.sort(function (a, b) {
      return b.Seq - a.Seq;
    });

    return returnArr;
  },
};
