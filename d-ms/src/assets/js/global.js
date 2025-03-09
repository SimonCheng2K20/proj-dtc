import moment from 'moment'

export default {
  delay(x) {
    return new Promise(function (resolve) {
      setTimeout(() => {
        resolve();
      }, x);
    });
  },
  YYYYMMDD(x) {
    return moment(x).format('YYYY-MM-DD')
  },
  YYYYMMDDHHmm(x) {
    return moment(x).format('YYYY-MM-DD HH:mm')
  },
  arrToObj(x, key) {
    let res = {}
    for (let item of x) {
      res[item[key]] = item
    }
    return res
  },
  treeToArr(x,first=true) {
    if(first) {
      let res=[]
      for(let item of x) {
        res.push(...this.treeToArr(item,false))
      }
      return res
    }
    else {
      if(x.children&&x.children.length) {
        let res=[x]
        for(let item of x.children) {
          let data=JSON.parse(JSON.stringify(item))
          data.Pid=x.Id
          res.push(...this.treeToArr(data,false))
        }
        return res
      }
      else return [x]
    }
  },
  arrToTree(x,first=true,arr) {
    if(first) {
      let res=[]
      let nonePid=x.filter(r=>!r.Pid).map(r=>{return {...r,fullName:r.Name}})
      for(let item of nonePid) {
        res.push(this.arrToTree(item,false,x))
      }
      return res
    }
    else {
      let children=arr.filter(r=>r.Pid===x.Id).map(r=>{return {...r,fullName:x.fullName+' - '+r.Name}})
      if(children.length) {
        let data={...x,children:[]}
        for(let item of children) {
          data.children.push(this.arrToTree(item,false,arr))
        }
        return data
      }
      else return x
    }
  },
  getPathByPid(x,arr) {
    let res=[]
    console.log(22,x)
    res.push(x)
    if(x.Pid) {
      let pNode=arr.filter(r=>r.Id===x.Pid)[0]
      res.push(...this.getPathByPid(pNode,arr))
      return res
    }
    else return res
  },
  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  },
  permissionsCheck(x,y) {
    let res=true
    for(let item of Object.keys(x)) {
      if(!y[item]) {
        res=false
        break
      }
    }
    console.log(x,y)
    return res
  },
  toODataOrder(prop,order) {
    if(!prop||!order) return null
    else {
      if(order==='ascending') return `${prop}`
      else if(order==='descending') return `${prop} desc`
    }
  },
  objToFormData(x) {
    let form_data = new FormData();
    for ( var key in x ) {
      if(x[key]) form_data.append(key, x[key]);
    }
    return form_data

  },

}