import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'

export default {
  props: {
    path: String,
    childItemName: String,
    fkName: String,
    exclude: {
      type: Array,
      default: () => []
    },
    activeColumnName: {
      type: String,
      default: 'active'
    }
  },
  data() {
    return {
      loader: false
    }
  },
  computed: {
    ...mapState('crud', [
      'childItems',
      'itemIdColumn'
    ]),
    ...mapGetters('crud', [
      'item',
      'childrenList',
    ]),
    details() {
      return this.childItems[this.childItemName].details
    },
    fileteredTableFields() {
      return this.fieldsInfo.filter(field => field.table != false && field.type != 'divider' && field.childTable != false && !this.exclude.includes(field.name))
    },
    fileteredDetailsFields() {
      return this.fieldsInfo.filter(field => field.details != false && field.type != 'divider' && field.childTable != false && !this.exclude.includes(field.name))
    },
  },
  methods: {
    ...mapMutations('crud', [
      'hideChildDialog',
      'resetChild',
      'editChildDialog',
      'createChildDialog',
    ]),
    ...mapActions('crud', [
      'updateChild',
      'storeChild',
      'getChild',
      'deleteChild'
    ]),
    edit(id) {
      this.loader = true
      this.getChild([id, this.path, this.childItemName]).then(response => {
        this.editChildDialog([id, this.childItemName])
        this.loader = false
      })
    },
    create() {
      this.resetChild(this.childItemName)
      this.createChildDialog(this.childItemName)
    },
    suspend(id) {
      this.updateChild([
        id,
        {
          active: 0
        },
        this.$t('global.alerts.suspended'),
        this.path
      ])
    },
    restore(id) {
      this.updateChild([
        id,
        {
          active: 1
        },
        this.$t('global.alerts.restored'),
        this.path
      ])
    },
    reset() {
      this.resetChild(this.childItemName)
    },
    close() {
      this.hideChildDialog(this.childItemName)
    },
    destroy(id) {      
      if (confirm(this.$t("global.alerts.confirm"))) {
        this.deleteChild([
          id,
          this.$t("global.alerts.deleted"),
          this.$t("global.alerts.deleteError"),
          this.path
        ]);
      }
    },
    update(id, data) {
      this.close()
      this.updateChild([
        id,
        data,
        this.$t('global.alerts.updated'),
        this.path
      ])
    },
    store(data) {
      data[this.fkName] = this.item[this.itemIdColumn]
      this.close()
      this.storeChild([
        data,
        this.$t('global.alerts.stored'),
        this.path
      ])
    },
  },
}
