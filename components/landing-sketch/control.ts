class Control {
  cursor = {
    x: 0,
    y: 0,
    fromCenter: {
      x: 0,
      y: 0
    },
    ratio: {
      x: 0,
      y: 0,
      fromCenter: {
        x: 0,
        y: 0
      }
    }
  }

  pan = {
    value: {
      x: 0,
      y: 0
    },
    target: {
      x: 0,
      y: 0
    },
    mobileLimit: 0.5,
    easing: 2,
    amplitude: {
      x: 0.1,
      y: 0.1
    },
  }

  init () {
    this.listenToStore()
  }

  listenToStore () {
    watchEffect(() => this.processCursorOrSizeUpdate())
  }

  processCursorOrSizeUpdate () {
    const store = useStore()
    const cursor = this.cursor
    const { width, height } = store.ui.viewport

    cursor.x = store.ui.cursor.x
    cursor.y = store.ui.cursor.y

    cursor.ratio.x = cursor.x / width
    cursor.ratio.y = cursor.y / height

    cursor.fromCenter.x = cursor.x -  width / 2
    cursor.fromCenter.y = -(cursor.y - height / 2)

    cursor.ratio.fromCenter.x = cursor.fromCenter.x / width * 2
    cursor.ratio.fromCenter.y = cursor.fromCenter.y / height * 2

    return this.cursor
  }

  update(delta: number) {
    this.updatePan(delta)
  }

  updatePan(delta: number) {
    this.pan.target.x =
      this.cursor.ratio.fromCenter.x * this.pan.amplitude.x
    this.pan.target.y =
      -this.cursor.ratio.fromCenter.y * this.pan.amplitude.y

    if (isNaN(this.pan.value.x)) {
      this.pan.value.x = 0
      this.pan.value.y = 0
    }

    this.pan.value.x +=
      (this.pan.target.x - this.pan.value.x) * this.pan.easing * delta
    this.pan.value.y +=
      (this.pan.target.y - this.pan.value.y) * this.pan.easing * delta
  }

}

export const control = new Control()
