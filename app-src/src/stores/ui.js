import { reactive } from 'vue'

let _id = 0

export const ui = reactive({
  toasts: [],
  loading: false,
  confirmState: null, // { message, resolve }

  toast(message, type = 'info', timeout = 2600) {
    const id = ++_id
    this.toasts.push({ id, message, type })
    setTimeout(() => this.dismiss(id), timeout)
    return id
  },
  success(m, t) {
    return this.toast(m, 'success', t)
  },
  error(m, t) {
    return this.toast(m, 'error', t || 3200)
  },
  dismiss(id) {
    const i = this.toasts.findIndex((t) => t.id === id)
    if (i !== -1) this.toasts.splice(i, 1)
  },

  setLoading(v) {
    this.loading = v
  },

  /** Apre un dialog di conferma. Risolve true/false. */
  confirm(message) {
    return new Promise((resolve) => {
      this.confirmState = { message, resolve }
    })
  },
  _resolveConfirm(value) {
    if (this.confirmState) {
      this.confirmState.resolve(value)
      this.confirmState = null
    }
  },
})
