import { defineComponent, markRaw, reactive, ref, h, nextTick } from 'vue'
import { QList, QItem, QItemSection, QIcon, QItemLabel, QPopupProxy } from 'quasar'
import { flattenDeep, set, get, isArray, map, cloneDeep } from 'lodash-es'
import { useRouter } from 'vue-router'

export default markRaw(
  defineComponent({
    name: 'MyMenu',
    setup() {
      const router = useRouter()
      const subMenuShow = reactive({})
      const qItemRefs = reactive({})
      const qListRefs = reactive({})
      const showKeys = ref([])

      return () => {
        const mapChildren = (route) => {
          const routes = [route]
          if (route.children && route.children.length > 0) {
            routes.push(route.children.map(mapChildren))
          }

          return routes
        }

        let menuArr = flattenDeep(cloneDeep(router.options.routes).map(mapChildren)).filter((route) => route.meta?.isMenu)

        const findMenuItem = (menuArr, title) => {
          return menuArr.find((item) => item.title === title)
        }

        menuArr = menuArr.reduce((resultArr, route) => {
          const menuGroup = route.meta.menuGroup.split('.')

          let menuItem = findMenuItem(resultArr, menuGroup[0])

          if (!menuItem) {
            const newMenuItem = { title: menuGroup[0], subItems: [] }
            resultArr.push(newMenuItem)
            menuItem = newMenuItem
          }

          if (menuGroup.length === 1) {
            menuItem.subItems.push(route)
          } else {
            for (let i = 1; i < menuGroup.length; i++) {
              const title = menuGroup[i]

              let existingMenuItem = findMenuItem(menuItem.subItems, title)

              if (i === menuGroup.length - 1) {
                if (existingMenuItem) {
                  existingMenuItem.subItems.push(route)
                } else {
                  const newMenuItem = { title, subItems: [route] }
                  menuItem.subItems.push(newMenuItem)
                }
              } else {
                if (existingMenuItem) {
                  menuItem = existingMenuItem
                } else {
                  const newMenuItem = { title, subItems: [] }
                  menuItem.subItems.push(newMenuItem)
                  menuItem = newMenuItem
                }
              }
            }
          }

          return resultArr
        }, [])

        const orderMenu = () => {
          let tempItem = null

          const orderBy = ['門診', '掛號/批價', '急診', '急診掛號']

          for (let i = 0; i < orderBy.length; i++) {
            const title = orderBy[i]
            if (menuArr[i].title !== title) {
              tempItem = menuArr[i]
              const menuIndex = menuArr.findIndex((item) => item.title === title)
              const menuItem = menuArr[menuIndex]
              menuArr[i] = menuItem
              menuArr[menuIndex] = tempItem
              tempItem = null
            }
          }
        }

        orderMenu()

        const createQItem = (menuItem, { isDeepSub, layer }) => {
          const title = menuItem.title || menuItem.meta.title
          const key = `${title}-${layer}`
          const to = menuItem.name ? { name: menuItem.name } : menuItem.redirect || menuItem.path
          const isDeepest = !!to

          return h(
            QItem,
            {
              ref: (el) => (qItemRefs[key] = el),
              class: 'whitespace-nowrap relative',
              dense: true,
              clickable: true,
              style: isDeepSub ? 'padding: 8px; min-height: auto;' : isDeepest ? '8px; min-height: auto;' : 'padding: 8px 8px 0 8px; min-height: auto;',
              onMouseenter: isDeepest
                ? null
                : async () => {
                    const index = showKeys.value.findIndex((item) => item.layer === layer)

                    if (index !== -1) {
                      const item = showKeys.value[index]
                      if (item.key !== key) {
                        showKeys.value.splice(index, 1)
                        subMenuShow[item.key] = false
                      }
                    }

                    if (showKeys.value.findIndex((item) => item.key === key) === -1) {
                      showKeys.value.push({ key, layer })
                    }

                    showKeys.value.forEach((item) => (subMenuShow[item.key] = true))
                    await nextTick()

                    const onMouseover = async (evt) => {
                      let testArr = map(qListRefs, (ref) => {
                        if (!!ref === false) return false
                        return ref.$el.contains(evt.target)
                      })

                      if (!!qItemRefs[key]) {
                        testArr = testArr.concat(qItemRefs[key].$el.contains(evt.target))
                      }

                      if (testArr.includes(true) === false) {
                        showKeys.value.forEach((item) => (subMenuShow[item.key] = false))
                        showKeys.value = []
                        window.removeEventListener('mouseover', onMouseover)
                      }
                    }

                    window.addEventListener('mouseover', onMouseover)
                  },
              onClick: isDeepest
                ? () => {
                    subMenuShow[key] = false
                    router.push(to)
                  }
                : null,
            },
            () => [
              h(QItemSection, null, () =>
                h(QItemLabel, { class: 'flex items-center no-wrap' }, () => [
                  title,
                  isDeepest ? null : h(QIcon, { name: 'arrow_drop_up', class: isDeepSub ? 'rotate-90 text-[18px]' : 'rotate-180 text-[18px]' }),
                ])
              ),
              isDeepest
                ? null
                : h(
                    QPopupProxy,
                    {
                      'model-value': subMenuShow[key],
                      'onUpdate:model-value'(val) {
                        subMenuShow[key] = val
                      },
                      anchor: isDeepSub ? 'top right' : 'bottom middle',
                      self: isDeepSub ? 'top left' : 'top middle',
                    },
                    () =>
                      h(QList, { ref: (el) => (qListRefs[key] = el) }, () =>
                        map(menuItem.subItems, (item) => {
                          return createQItem(item, { isDeepSub: true, layer: layer + 1 })
                        })
                      )
                  ),
            ]
          )
        }

        return map(menuArr, (item) => createQItem(item, { isDeepSub: false, layer: 0 }))
      }
    },
  })
)

